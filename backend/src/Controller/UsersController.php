<?php

namespace App\Controller;

use App\Firebase\Authentication;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use FOS\RestBundle\View\View;
use JMS\Serializer\SerializerInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Cache;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/api")
 */
class UsersController extends AbstractFOSRestController
{
    /**
     * @Route("/users/{firebase_id}", name="user_api", methods={"GET"})
     * @Cache(public=true, maxage="60", smaxage="0")
     */
    public function userAction(
        Authentication $authentication,
        SerializerInterface $serializer,
        string $firebase_id
    ) {
        $user = $authentication->getUser($firebase_id);

        if (!$user) {
            throw new NotFoundHttpException();
        }

        $disabled = $user->disabled;
        if ($disabled) {
            throw new NotFoundHttpException('This user account has been disabled');
        }

        $user_array = $serializer->toArray($user);

        $view = View::create();
        $view->setData($user_array);

        $view->setHeader('Surrogate-Control', 'max-age=900, stale-if-error=31536000, stale-while-revalidate=31536000');

        return $view;
    }
}
