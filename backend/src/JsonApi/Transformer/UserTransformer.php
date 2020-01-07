<?php

namespace App\JsonApi\Transformer;

use App\JsonApi\Model\User;
use League\Fractal\TransformerAbstract;

class UserTransformer extends TransformerAbstract
{
    /**
     * @return array
     */
    public function transform(User $user)
    {
        $array = json_decode(json_encode($user), true);

        return $array;
    }
}
