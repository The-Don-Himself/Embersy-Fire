<?php

namespace App\EntityRepository;

use App\Entity\Profiles;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

/**
 * @method Profiles|null find($id, $lockMode = null, $lockVersion = null)
 * @method Profiles|null findOneBy(array $criteria, array $orderBy = null)
 * @method Profiles[]    findAll()
 * @method Profiles[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ProfilesRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Profiles::class);
    }

    public function queryAllProfiles(): array
    {
        return $this->findAll();
    }

    public function queryProfileById(int $profile_id): ?Profiles
    {
        return $this->find($profile_id);
    }

    public function queryProfilesByIds(array $profile_ids): array
    {
        $profiles = $this
            ->findBy(array('id' => $profile_ids));

        return $profiles;
    }

    public function queryProfileByFirebaseId(string $firebase_id): ?Profiles
    {
        $profile = $this
            ->findOneBy(array('firebase_id' => $firebase_id));

        return $profile;
    }

    public function queryProfileByUsername(string $username): ?Profiles
    {
        $profile = $this
            ->findOneBy(array('username' => $username));

        return $profile;
    }

}
