<?php

namespace App\Controller;

use App\Entity\Profiles;
use App\Firebase\Authentication;
use App\JsonApi\Model\Accounts;
use App\JsonApi\Serializer\CustomSerializer;
use App\JsonApi\Transformer\AccountsTransformer;
use App\Services\ProfileCreate;
use App\Services\ProfileCreateAvatar;
use App\Services\UserCheck;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Egulias\EmailValidator\EmailValidator;
use Egulias\EmailValidator\Validation\DNSCheckValidation;
use Egulias\EmailValidator\Validation\MultipleValidationWithAnd;
use Egulias\EmailValidator\Validation\RFCValidation;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use FOS\RestBundle\Controller\Annotations\View as ViewAnnotation;
use FOS\RestBundle\View\View;
use JMS\Serializer\SerializerInterface;
use League\Fractal\Manager;
use League\Fractal\Resource\Item;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Cache;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/api/accounts")
 */
class AccountsController extends AbstractFOSRestController
{
    /**
     * @Route("/me", name="accounts_me", methods={"GET"})
     * @Cache(public=false, maxage="0", smaxage="0")
     * @ViewAnnotation(serializerGroups={"Default"})
     */
    public function accounts_meAction(
        Authentication $authentication,
        EntityManagerInterface $em,
        Request $request,
        SerializerInterface $serializer,
        ProfileCreate $profileCreate
    ) {
        $verifiedIdToken = $authentication->verifiedIdTokenFromRequest($request);

        $meta = array();

        if (!$verifiedIdToken->hasClaim('profile_id')) {
            // Let's Create A New Profile
            $uid = $verifiedIdToken->getClaim('sub');
            if ($verifiedIdToken->hasClaim('phone_number')) {
                $username = $verifiedIdToken->getClaim('phone_number');
            } elseif ($verifiedIdToken->hasClaim('email')) {
                $username = $verifiedIdToken->getClaim('email');
            } else {
                $username = $uid;
            }

            $profile = $profileCreate->create($uid, $username);
            $user_id = $profile->getId();

            $firebase_token = $authentication->createCustomToken($uid);
            $meta['firebase_token'] = $firebase_token;
        } else {
            $user_id = $verifiedIdToken->getClaim('profile_id');
        }

        $profile = $em
            ->getRepository(Profiles::class)
            ->queryProfileById($user_id);

        $profile_array = $serializer->toArray($profile);

        isset($meta['firebase_token']) ? $profile_array['token'] = $meta['firebase_token'] : null;

        $jsonApiObject = new Accounts($profile_array);

        $manager = new Manager();
        $manager->setSerializer(new CustomSerializer());
        $resource = new Item($jsonApiObject, new AccountsTransformer(), 'account');
        $array = $manager->createData($resource)->toArray();
        $array['meta'] = (object)$meta;
        // $meta ? $array['meta'] = (object)$meta : null;

        $view = View::create();
        $view->setData($array);

        return $view;
    }

    /**
     * @Route("/{account_id}", name="accounts_api", methods={"GET"})
     * @Cache(public=false, maxage="0", smaxage="0")
     */
    public function accountAction(
        Authentication $authentication,
        EntityManagerInterface $em,
        Request $request,
        SerializerInterface $serializer,
        int $account_id
    ) {
        $user_id = $authentication->userIdFromRequest($request);

        $view = View::create();

        if ($user_id != $account_id) {
            $view->setStatusCode(Response::HTTP_FORBIDDEN);

            return $view;
        }

        $view->setStatusCode(Response::HTTP_OK);

        return $view;
    }

    /**
     * @Route("/edit_avatar", name="account_edit_avatar", methods={"POST"})
     */
    public function edit_avatarAction(
        Authentication $authentication,
        EntityManagerInterface $em,
        Request $request,
        ProfileCreateAvatar $profileCreateAvatar
    ) {
        $user_id = $authentication->userIdFromRequest($request);

        $view = View::create();

        $avatar_encoded = null;

        $avatar_data = $request->get('avatar');
        if (!$avatar_data) {
            $data['error'] = 'A avatar must be uploaded';
            $view->setData($data);
            $view->setStatusCode(Response::HTTP_BAD_REQUEST);

            return $view;
        }

        $avatar_array = explode(',', $avatar_data);
        $avatar_encoded = $avatar_array[1];
        $avatar_encoded = str_replace(' ', '+', $avatar_encoded);

        $avatar_decoded = base64_decode($avatar_encoded);
        $im = imagecreatefromstring($avatar_decoded);
        if (false === $im) {
            $data['error'] = 'That image is malformed';
            $view->setData($data);
            $view->setStatusCode(Response::HTTP_BAD_REQUEST);

            return $view;
        }

        imagedestroy($im);

        $profile = $em
            ->getRepository(Profiles::class)
            ->queryProfileById($user_id);

        $avatar_version = $profile->getAvatarversion();
        $version = $avatar_version + 1;

        // Upload & Replace User Avatar
        $profileCreateAvatar->create_avatar($user_id, $avatar_encoded, $version);

        $view->setStatusCode(Response::HTTP_OK);

        return $view;
    }

    /**
     * @Route("/edit", name="account_edit", methods={"POST"})
     */
    public function edit_submitAction(
        Authentication $authentication,
        EntityManagerInterface $em,
        Request $request,
        SerializerInterface $serializer,
        UserCheck $userCheck
    ) {
        $user_id = $authentication->userIdFromRequest($request);

        $username = strip_tags($request->get('username'));
        $username = str_replace(' ', '_', $username);
        $email = strip_tags($request->get('email'));

        $firstname = strip_tags($request->get('firstname'));
        $lastname = strip_tags($request->get('lastname'));

        $country_id = preg_replace('/[^0-9]/', '', $request->get('country_id'));

        $gender = strip_tags($request->get('gender'));
        $birthday_string = strip_tags($request->get('birthday'));
        $bio = strip_tags($request->get('bio'));

        $view = View::create();

        $birthday = DateTime::createFromFormat('Y-m-d', $birthday_string);
        if (false === $birthday) {
            $view->setStatusCode(Response::HTTP_BAD_REQUEST);

            return $view;
        }

        if ('Male' !== $gender && 'Female' !== $gender) {
            $view->setStatusCode(Response::HTTP_BAD_REQUEST);

            return $view;
        }

        if (!$username || !$email || !$firstname || !$lastname || $country_id < 1) {
            $view->setStatusCode(Response::HTTP_BAD_REQUEST);

            return $view;
        }

        $profile = $em
            ->getRepository(Profiles::class)
            ->queryProfileById($user_id);

        $currentUsername = $profile->getUsername();

        if ($username) {
            // Check Username
            $check_username = $userCheck->checkUsername($username);
            if ('forbidden' == $check_username) {
                $view->setStatusCode(Response::HTTP_FORBIDDEN);

                return $view;
            }
            if ('exists' == $check_username && $currentUsername != $username) {
                $view->setStatusCode(Response::HTTP_CONFLICT);

                return $view;
            }
            $profile->setUsername($username);
        }
        if ($email) {
            // Check email
            $check_email = $userCheck->checkEmail($email);
            if ('invalid' == $check_email) {
                $view->setStatusCode(Response::HTTP_BAD_REQUEST);

                return $view;
            }
            if ('forbidden' == $check_email) {
                $view->setStatusCode(Response::HTTP_FORBIDDEN);

                return $view;
            }
            if ('exists' == $check_email && $currentEmail != $email) {
                $view->setStatusCode(Response::HTTP_CONFLICT);

                return $view;
            }
        }

        if ($country_id > 0) {
            $country = $em
                   ->getRepository('App:Country')
                   ->queryCountryById($country_id);
            if ($country) {
                $profile->setCountry($country);
            }
        }

        $profile->setFirstname($firstname);
        $profile->setLastname($lastname);

        $em->flush();

        $view->setStatusCode(Response::HTTP_OK);

        return $view;
    }

    /**
     * @Route("/availability_check", name="availability_check", methods={"GET"})
     * @Cache(public=false, maxage="0", smaxage="0")
     */
    public function availability_checkAction(
        Request $request,
        UserCheck $userCheck
    ) {
        $username = strip_tags($request->get('username'));
        $username = str_replace(' ', '_', $username);
        $email = strip_tags($request->get('email'));
        $phone = strip_tags($request->get('phone'));

        if ($phone && (0 === strpos($phone, ' '))) {
            $phone = '+'.ltrim($phone);
        }

        if ($phone && (0 !== strpos($phone, '+'))) {
            $phone = '+'.ltrim($phone);
        }

        $view = View::create();

        if ($username) {
            // Check Username
            $check_username = $userCheck->checkUsername($username);
            if ('forbidden' == $check_username) {
                $view->setStatusCode(Response::HTTP_FORBIDDEN);

                return $view;
            }
            if ('exists' == $check_username) {
                $view->setStatusCode(Response::HTTP_CONFLICT);

                return $view;
            }
            if ('ok' == $check_username) {
                $view->setStatusCode(Response::HTTP_ACCEPTED);

                return $view;
            }

            // Check Username returns forbidden, exists or ok
            $check_username = $userCheck->checkUsername($username);
            $data['status'] = $check_username;
            $view->setData($data);

            return $view;
        }
        if ($email) {
            // Check email returns invalid, forbidden, exists or ok
            $check_email = $userCheck->checkEmail($email);
            if ('invalid' == $check_email) {
                $view->setStatusCode(Response::HTTP_BAD_REQUEST);

                return $view;
            }
            if ('forbidden' == $check_email) {
                $view->setStatusCode(Response::HTTP_FORBIDDEN);

                return $view;
            }
            if ('exists' == $check_email) {
                $view->setStatusCode(Response::HTTP_CONFLICT);

                return $view;
            }

            $validator = new EmailValidator();
            $multipleValidations = new MultipleValidationWithAnd([
                new RFCValidation(),
                new DNSCheckValidation(),
            ]);

            $isValid = $validator->isValid($email, $multipleValidations); //true
            if (true !== $isValid) {
                $view->setStatusCode(Response::HTTP_BAD_REQUEST);

                return $view;
            }

            if ('ok' == $check_email) {
                $view->setStatusCode(Response::HTTP_ACCEPTED);

                return $view;
            }
        }
        if ($phone) {
            // Check phone returns invalid, forbidden, exists or ok
            $check_phone = $userCheck->checkPhone($phone);
            if ('invalid' == $check_phone) {
                $view->setStatusCode(Response::HTTP_BAD_REQUEST);

                return $view;
            }
            if ('forbidden' == $check_phone) {
                $view->setStatusCode(Response::HTTP_FORBIDDEN);

                return $view;
            }
            if ('exists' == $check_phone) {
                $view->setStatusCode(Response::HTTP_CONFLICT);

                return $view;
            }
            if ('ok' == $check_phone) {
                $view->setStatusCode(Response::HTTP_ACCEPTED);

                return $view;
            }
        }
        $view->setStatusCode(Response::HTTP_BAD_REQUEST);

        return $view;
    }
}
