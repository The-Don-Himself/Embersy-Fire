<?php

namespace App\Services;

use App\Entity\Profiles;
use App\Firebase\Authentication;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;

class ProfileCreate
{
    protected $em;
    private $authentication;

    public function __construct(EntityManagerInterface $em, Authentication $authentication)
    {
        $this->em = $em;
        $this->authentication = $authentication;
    }

    public function create(string $uid, string $username, $country_id = null, $firstname = null, $lastname = null)
    {
        $em = $this->em;

        $profile = new Profiles();
        $profile->setFirebaseId($uid);
        $profile->setUsername($username);

        if ($country_id > 0) {
            $country = $em
                   ->getRepository('App:Country')
                   ->queryCountryById($country_id);
            if ($country) {
                $profile->setCountry($country);
            }
        }

        $profile->setJoined(new DateTime());
        $profile->setFirstname($firstname);
        $profile->setLastname($lastname);

        $em->persist($profile);
        $em->flush();

        $user_id = $profile->getId();

        $customAttributes = [
            'profile_id' => (string) $user_id,
        ];

        $authentication = $this->authentication;
        $updatedUser = $authentication->setCustomUserAttributes($uid, $customAttributes);

        return $profile;
    }
}
