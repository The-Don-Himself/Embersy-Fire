<?php

namespace App\JsonApi\Transformer;

use App\JsonApi\Model\Accounts;
use League\Fractal\TransformerAbstract;

class AccountsTransformer extends TransformerAbstract
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
    public function transform(Accounts $accounts)
    {
        $array = json_decode(json_encode($accounts), true);

        unset($array['country']);

        return $array;
    }

    /**
     * Include Country.
     *
     * @return League\Fractal\ItemResource
     */
    public function includeCountry(Accounts $accounts)
    {
        $country = $accounts->country;

        return $country ? $this->item($country, new CountryTransformer(), 'countries') : null;
    }
}
