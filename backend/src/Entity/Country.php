<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
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
}
