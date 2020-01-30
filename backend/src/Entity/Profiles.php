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

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFirebaseId(): ?string
    {
        return $this->firebase_id;
    }

    public function setFirebaseId(string $firebase_id): self
    {
        $this->firebase_id = $firebase_id;

        return $this;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): self
    {
        $this->username = $username;

        return $this;
    }

    public function getJoined(): ?\DateTimeInterface
    {
        return $this->joined;
    }

    public function setJoined(\DateTimeInterface $joined): self
    {
        $this->joined = $joined;

        return $this;
    }

    public function getFirstname(): ?string
    {
        return $this->firstname;
    }

    public function setFirstname(?string $firstname): self
    {
        $this->firstname = $firstname;

        return $this;
    }

    public function getLastname(): ?string
    {
        return $this->lastname;
    }

    public function setLastname(?string $lastname): self
    {
        $this->lastname = $lastname;

        return $this;
    }

    public function getAvatarversion(): ?int
    {
        return $this->avatarversion;
    }

    public function setAvatarversion(int $avatarversion): self
    {
        $this->avatarversion = $avatarversion;

        return $this;
    }

    public function getGender(): ?string
    {
        return $this->gender;
    }

    public function setGender(?string $gender): self
    {
        $this->gender = $gender;

        return $this;
    }

    public function getBirthday(): ?\DateTimeInterface
    {
        return $this->birthday;
    }

    public function setBirthday(?\DateTimeInterface $birthday): self
    {
        $this->birthday = $birthday;

        return $this;
    }

    public function getBio(): ?string
    {
        return $this->bio;
    }

    public function setBio(?string $bio): self
    {
        $this->bio = $bio;

        return $this;
    }

    public function getCountry(): ?Country
    {
        return $this->country;
    }

    public function setCountry(?Country $country): self
    {
        $this->country = $country;

        return $this;
    }
}
