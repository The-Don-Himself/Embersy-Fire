<?php

namespace App\JsonApi\Transformer;

use App\JsonApi\Model\Profiles;
use League\Fractal\TransformerAbstract;

class ProfilesTransformer extends TransformerAbstract
{
    /**
     * List of resources to automatically include.
     *
     * @var array
     */
    protected $defaultIncludes = [
        'country',
    ];

    /**
     * Turn this item object into a generic array.
     *
     * @return array
     */
    public function transform(Profiles $profile)
    {
        $array = json_decode(json_encode($profile), true);

        unset($array['country']);

        return $array;
    }

    /**
     * Include Country.
     *
     * @return League\Fractal\ItemResource
     */
    public function includeCountry(Profiles $profile)
    {
        $country = $profile->country;

        return $country ? $this->item($country, new CountryTransformer(), 'countries') : null;
    }
}
