<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as Serializer;

/**
 *  @ORM\Entity(repositoryClass="App\EntityRepository\CountryRepository")
 *  @ORM\Table(name="countries")
 *  @Serializer\ExclusionPolicy("all")
 */
class Country
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     * @Serializer\Expose
     * @Serializer\Groups({"Default"})
     */
    protected $id;

    /**
     * @ORM\Column(type="string")
     * @Serializer\Type("string")
     * @Serializer\Expose
     * @Serializer\Groups({"Default"})
     */
    protected $name;

    /**
     * @ORM\Column(type="string", length=2)
     * @Serializer\Type("string")
     * @Serializer\Expose
     * @Serializer\Groups({"Default"})
     */
    protected $iso2;

    /**
     * @ORM\Column(type="string", length=3)
     * @Serializer\Type("string")
     * @Serializer\Expose
     * @Serializer\Groups({"Default"})
     */
    protected $iso3;

    /**
     * @ORM\Column(type="string", nullable=true)
     * @Serializer\Type("string")
     * @Serializer\Expose
     * @Serializer\Groups({"Default"})
     */
    protected $currencycode;

    /**
     * @ORM\Column(type="string", nullable=true)
     * @Serializer\Type("string")
     * @Serializer\Expose
     * @Serializer\Groups({"Default"})
     */
    protected $currencysymbol;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Serializer\Expose
     * @Serializer\Groups({"Default"})
     */
    protected $callingcode;

    /**
     * @ORM\Column(type="boolean")
     * @Serializer\Type("boolean")
     * @Serializer\Expose
     * @Serializer\Groups({"Default"})
     */
    protected $active;

    /**
     * @ORM\OneToMany(targetEntity="Profiles", mappedBy="country")
     */
    protected $profiles;

    public function __construct()
    {
        $this->profiles = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getIso2(): ?string
    {
        return $this->iso2;
    }

    public function setIso2(string $iso2): self
    {
        $this->iso2 = $iso2;

        return $this;
    }

    public function getIso3(): ?string
    {
        return $this->iso3;
    }

    public function setIso3(string $iso3): self
    {
        $this->iso3 = $iso3;

        return $this;
    }

    public function getCurrencycode(): ?string
    {
        return $this->currencycode;
    }

    public function setCurrencycode(?string $currencycode): self
    {
        $this->currencycode = $currencycode;

        return $this;
    }

    public function getCurrencysymbol(): ?string
    {
        return $this->currencysymbol;
    }

    public function setCurrencysymbol(?string $currencysymbol): self
    {
        $this->currencysymbol = $currencysymbol;

        return $this;
    }

    public function getCallingcode(): ?int
    {
        return $this->callingcode;
    }

    public function setCallingcode(?int $callingcode): self
    {
        $this->callingcode = $callingcode;

        return $this;
    }

    public function getActive(): ?bool
    {
        return $this->active;
    }

    public function setActive(bool $active): self
    {
        $this->active = $active;

        return $this;
    }

    /**
     * @return Collection|Profiles[]
     */
    public function getProfiles(): Collection
    {
        return $this->profiles;
    }

    public function addProfile(Profiles $profile): self
    {
        if (!$this->profiles->contains($profile)) {
            $this->profiles[] = $profile;
            $profile->setCountry($this);
        }

        return $this;
    }

    public function removeProfile(Profiles $profile): self
    {
        if ($this->profiles->contains($profile)) {
            $this->profiles->removeElement($profile);
            // set the owning side to null (unless already changed)
            if ($profile->getCountry() === $this) {
                $profile->setCountry(null);
            }
        }

        return $this;
    }
}
