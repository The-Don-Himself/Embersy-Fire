<?php

namespace App\Firebase;

use Firebase\Auth\Token\Exception\ExpiredToken;
use Firebase\Auth\Token\Exception\InvalidToken;
use Firebase\Auth\Token\Exception\IssuedInTheFuture;
use Kreait\Firebase\Exception\Auth\UserNotFound;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;
use Symfony\Component\HttpKernel\Exception\NotAcceptableHttpException;

class Authentication
{
    // instance of Lcobucci\JWT\Token
    private $verifiedIdToken;

    private $firebase;

    public function __construct(Firebase $firebase)
    {
        $this->firebase = $firebase->getFirebase();
    }

    public function getAuth()
    {
        $firebase = $this->firebase;

        $auth = $firebase->getAuth();

        return $auth;
    }

    public function getClaim(string $claim)
    {
        $verifiedIdToken = $this->verifiedIdToken;

        return $verifiedIdToken ? $verifiedIdToken->getClaim($claim, null) : null;
    }

    public function isAdmin()
    {
        $verifiedIdToken = $this->verifiedIdToken;

        return $verifiedIdToken ? $verifiedIdToken->getClaim('admin', false) : false;
    }

    public function verifiedIdTokenFromRequest(Request $request)
    {
        $authorization = $request->headers->get('Authorization');

        if (!$authorization) {
            throw new AccessDeniedHttpException('Authorization Header Is Required'); // 403
        }

        list($type, $token) = explode(' ', $authorization);

        if (!$token) {
            throw new AccessDeniedHttpException('Access Token Is Required'); // 403
        }

        $firebase = $this->firebase;

        try {
            $verifiedIdToken = $firebase->getAuth()->verifyIdToken($token, false, true);
        } catch (ExpiredToken $e) {
            throw new AccessDeniedHttpException($e->getMessage()); // 403
        } catch (IssuedInTheFuture $e) {
            throw new ConflictHttpException($e->getMessage()); // 409
        } catch (InvalidToken $e) {
            throw new NotAcceptableHttpException($e->getMessage()); // 406
        }

        $this->verifiedIdToken = $verifiedIdToken;

        return $verifiedIdToken;
    }

    public function userIdFromRequest(Request $request)
    {
        $authorization = $request->headers->get('Authorization');

        if (!$authorization) {
            throw new AccessDeniedHttpException('Authorization Header Is Required'); // 403
        }

        list($type, $token) = explode(' ', $authorization);

        if (!$token) {
            throw new AccessDeniedHttpException('Access Token Is Required'); // 403
        }

        $firebase = $this->firebase;

        try {
            $verifiedIdToken = $firebase->getAuth()->verifyIdToken($token, false, true);
        } catch (ExpiredToken $e) {
            throw new AccessDeniedHttpException($e->getMessage()); // 403
        } catch (IssuedInTheFuture $e) {
            throw new ConflictHttpException($e->getMessage()); // 409
        } catch (InvalidToken $e) {
            throw new NotAcceptableHttpException($e->getMessage()); // 406
        }

        $this->verifiedIdToken = $verifiedIdToken;

        if (!$verifiedIdToken->hasClaim('profile_id')) {
            return null;
        }

        $user_id = (int) $verifiedIdToken->getClaim('profile_id');

        return $user_id;
    }

    public function uidFromRequest(Request $request)
    {
        $authorization = $request->headers->get('Authorization');

        if (!$authorization) {
            throw new AccessDeniedHttpException('Authorization Header Is Required'); // 403
        }

        list($type, $token) = explode(' ', $authorization);

        if (!$token) {
            throw new AccessDeniedHttpException('Access Token Is Required'); // 403
        }

        $firebase = $this->firebase;

        try {
            $verifiedIdToken = $firebase->getAuth()->verifyIdToken($token, false, true);
        } catch (ExpiredToken $e) {
            throw new AccessDeniedHttpException($e->getMessage()); // 403
        } catch (IssuedInTheFuture $e) {
            throw new ConflictHttpException($e->getMessage()); // 409
        } catch (InvalidToken $e) {
            throw new NotAcceptableHttpException($e->getMessage()); // 406
        }

        $this->verifiedIdToken = $verifiedIdToken;
        $uid = $verifiedIdToken->getClaim('sub');

        return $uid;
    }

    public function checkIfAdminFromRequest(Request $request)
    {
        list($type, $token) = explode(' ', $request->headers->get('Authorization'));

        if (!$token) {
            throw new AccessDeniedHttpException('Access Token Is Required'); // 403
        }

        $firebase = $this->firebase;

        try {
            $verifiedIdToken = $firebase->getAuth()->verifyIdToken($token, false, true);
        } catch (ExpiredToken $e) {
            throw new AccessDeniedHttpException($e->getMessage()); // 403
        } catch (IssuedInTheFuture $e) {
            throw new ConflictHttpException($e->getMessage()); // 409
        } catch (InvalidToken $e) {
            throw new NotAcceptableHttpException($e->getMessage()); // 406
        }

        $this->verifiedIdToken = $verifiedIdToken;

        $is_admin = $verifiedIdToken->getClaim('admin', false);

        if (!$is_admin) {
            throw new AccessDeniedHttpException('You Are Not An Admin'); // 403
        }

        $uid = $verifiedIdToken->getClaim('sub');

        $user = $this->getUser($uid);

        if (!$user) {
            throw new AccessDeniedHttpException('Admin Not Found'); // 403
        }

        $customAttributes = $user->customAttributes;
        if (!isset($customAttributes['profile_id'])) {
            throw new ConflictHttpException('Admin Profile Does Not Exist'); // 409
        }

        $user_id = (int) $customAttributes['profile_id'];

        return $user_id;
    }

    public function verifyIdToken(string $token)
    {
        $firebase = $this->firebase;

        try {
            $verifiedIdToken = $firebase->getAuth()->verifyIdToken($token, false, true);
        } catch (ExpiredToken $e) {
            throw new AccessDeniedHttpException($e->getMessage()); // 403
        } catch (IssuedInTheFuture $e) {
            throw new ConflictHttpException($e->getMessage()); // 409
        } catch (InvalidToken $e) {
            throw new NotAcceptableHttpException($e->getMessage()); // 406
        }

        $this->verifiedIdToken = $verifiedIdToken;

        return $verifiedIdToken;
    }

    public function getUserIdFromUid(string $uid)
    {
        $auth = $this->getAuth();

        try {
            $user = $auth->getUser($uid);
        } catch (UserNotFound $e) {
            $user = null;
        }

        if ($user) {
            $customAttributes = $user->customAttributes;
            if (isset($customAttributes['profile_id'])) {
                $user_id = (int) $customAttributes['profile_id'];

                return $user_id;
            }
        }

        return null;
    }

    public function getUser(string $uid)
    {
        $auth = $this->getAuth();

        try {
            $user = $auth->getUser($uid);
        } catch (UserNotFound $e) {
            $user = null;
        }

        if ($user) {
            $customAttributes = $user->customAttributes;
            if (isset($customAttributes['profile_id'])) {
                $user_id = (int) $customAttributes['profile_id'];
                // $this->user_id = $user_id;
            }
        }

        return $user;
    }

    public function getUserByEmail(string $email)
    {
        $auth = $this->getAuth();

        try {
            $user = $auth->getUserByEmail($email);
        } catch (UserNotFound $e) {
            $user = null;
        }

        return $user;
    }

    public function getUserByPhoneNumber(string $phoneNumber)
    {
        $auth = $this->getAuth();

        try {
            $user = $auth->getUserByPhoneNumber($phoneNumber);
        } catch (UserNotFound $e) {
            $user = null;
        }

        if ($user) {
            $customAttributes = $user->customAttributes;
            if (isset($customAttributes['profile_id'])) {
                $user_id = (int) $customAttributes['profile_id'];
                $this->user_id = $user_id;
            }
        }

        return $user;
    }

    public function deleteUser(string $uid)
    {
        $auth = $this->getAuth();

        $user = $auth->deleteUser($uid);

        return $user;
    }

    public function createUser(array $userProperties)
    {
        $auth = $this->getAuth();

        $createdUser = $auth->createUser($userProperties);

        return $createdUser;
    }

    public function updateUser(string $uid, array $userProperties)
    {
        $auth = $this->getAuth();

        $updatedUser = $auth->updateUser($uid, $userProperties);

        return $updatedUser;
    }

    public function changeUserPhoneNumber(string $uid, string $phone)
    {
        $auth = $this->getAuth();

        $properties = [
            'phoneNumber' => $phone,
        ];

        $updatedUser = $auth->updateUser($uid, $properties);

        return $updatedUser;
    }

    public function changeUserEmail(string $uid, string $email)
    {
        $auth = $this->getAuth();

        $updatedUser = $auth->changeUserEmail($uid, $email);

        return $updatedUser;
    }

    public function setCustomUserAttributes(string $uid, array $customAttributes)
    {
        $auth = $this->getAuth();

        $updatedUser = $auth->setCustomUserAttributes($uid, $customAttributes);

        return $updatedUser;
    }

    public function createCustomToken(string $uid)
    {
        $auth = $this->getAuth();

        $customToken = $auth->createCustomToken($uid);

        $customTokenString = (string) $customToken;

        return $customTokenString;
    }

    public function listUsers($maxResults = 1000, $batchSize = 1000)
    {
        $auth = $this->getAuth();

        $users = $auth->listUsers($maxResults, $batchSize);

        return $users;
    }
}
