<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as Serializer;

/**
 *  @ORM\Entity(repositoryClass="App\EntityRepository\ProfilesRepository")
 *  @ORM\Table(
 *     name="profiles",
 *     indexes={
 *         @ORM\Index(name="username", columns={"username"})
 *     }
 *  )
 *  @Serializer\ExclusionPolicy("all")
 */
class Profiles
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     * @Serializer\Type("integer")
     * @Serializer\Expose
     * @Serializer\Groups({"Default"})
     */
    protected $id;

    /**
     * @ORM\Column(type="string", unique=true)
     * @Serializer\Type("string")
     * @Serializer\Expose
     * @Serializer\Groups({"Default"})
     */
    protected $firebase_id;

    /**
     * @ORM\Column(type="string", unique=true)
     * @Serializer\Type("string")
     * @Serializer\Expose
     * @Serializer\Groups({"Default"})
     */
    protected $username;

    /**
     * @ORM\Column(type="datetime")
     * @Serializer\Type("DateTime")
     * @Serializer\Expose
     * @Serializer\Groups({"Default"})
     */
    protected $joined;

    /**
     * @ORM\Column(type="string", nullable=true)
     * @Serializer\Expose
     * @Serializer\Groups({"Default"})
     */
    protected $firstname;

    /**
     * @ORM\Column(type="string", nullable=true)
     * @Serializer\Expose
     * @Serializer\Groups({"Default"})
     */
    protected $lastname;

    /**
     * @ORM\Column(type="integer")
     * @Serializer\Expose
     * @Serializer\Groups({"Default"})
     */
    protected $avatarversion = 0;

    /**
     * @ORM\ManyToOne(targetEntity="Country", inversedBy="profiles")
     * @ORM\JoinColumn(name="country_id", referencedColumnName="id", nullable=true)
     * @Serializer\Expose
     * @Serializer\Groups({"Default"})
     */
    protected $country;

    /**
     * @ORM\Column(type="string", nullable=true)
     * @Serializer\Expose
     * @Serializer\Groups({"Default"})
     */
    protected $gender;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Serializer\Type("DateTime")
     * @Serializer\Expose
     * @Serializer\Groups({"Default"})
     */
    protected $birthday;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Serializer\Expose
     * @Serializer\Groups({"Default"})
     */
    protected $bio;
}
