<?php

namespace App\Controller;

use App\JsonApi\Model\Profiles;
use App\JsonApi\Serializer\CustomSerializer;
use App\JsonApi\Transformer\ProfilesTransformer;
use Doctrine\ORM\EntityManagerInterface;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use FOS\RestBundle\View\View;
use JMS\Serializer\SerializerInterface;
use League\Fractal\Manager;
use League\Fractal\Resource\Collection;
use League\Fractal\Resource\Item;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Cache;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/api")
 */
class ProfilesController extends AbstractFOSRestController
{
    /**
     * @Route("/profiles", name="profiles_api", methods={"GET"})
     * @Cache(public=true, maxage="60", smaxage="0")
     */
    public function profilesAction(
        EntityManagerInterface $em,
        Request $request,
        SerializerInterface $serializer
    ) {
        $from = $request->get('from');
        $from = $from ? (int) $from : 0;

        $limit = $request->get('size');
        $limit = $limit ? (int) $limit + $from : 10 + $from;

        $sort = $request->get('sort');
        $sort = $sort ? $sort : 'joined';

        $order = $request->get('order');
        $order = $order ? $order : 'decr';

        $profiles = $em
            ->getRepository(Profile::class)
            ->queryAllProfiles();

        $profiles_array = $serializer->toArray($profiles);

        $meta = array(
            'count' => count($profiles_array),
        );

        $data = array('data' => array(), 'meta' => $meta);

        $view = View::create();

        if (!$profiles_array) {
            $view->setData($data);

            return $view;
        }

        $jsonApiObjects = array();
        foreach ($profiles_array as $profile_array) {
            $jsonApiObjects[] = new Profiles($profile_array);
        }

        $manager = new Manager();
        $manager->setSerializer(new CustomSerializer());
        $resource = new Collection($jsonApiObjects, new ProfilesTransformer(), 'profiles');
        $array = $manager->createData($resource)->toArray();
        $array['meta'] = $meta;

        $view->setData($array);

        $view->setHeader('Surrogate-Control', 'max-age=900, stale-if-error=31536000, stale-while-revalidate=31536000');

        return $view;
    }

    /**
     * @Route("/profiles/{profile_id}", requirements={"profile_id" = "\d+", "_format" = "json"}, name="profile_api", methods={"GET"})
     * @Cache(public=true, maxage="60", smaxage="0")
     */
    public function profileAction(
        EntityManagerInterface $em,
        SerializerInterface $serializer,
        int $profile_id
    ) {
        $profile = $em
            ->getRepository(Profile::class)
            ->queryProfileById($profile_id);

        if (!$profile) {
            throw new NotFoundHttpException('No profile found for id '.$profile_id);
        }

        $profile_array = $serializer->toArray($profile);

        $jsonApiObject = new Profiles($profile_array);

        $manager = new Manager();
        $manager->setSerializer(new CustomSerializer());
        $resource = new Item($jsonApiObject, new ProfilesTransformer(), 'profiles');
        $array = $manager->createData($resource)->toArray();

        $view = View::create();
        $view->setData($array);

        $view->setHeader('Surrogate-Control', 'max-age=900, stale-if-error=31536000, stale-while-revalidate=31536000');

        return $view;
    }
}
