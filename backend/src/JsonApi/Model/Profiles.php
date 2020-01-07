<?php

namespace App\JsonApi\Model;

class Profiles
{
    public $id;
    public $username;
    public $joined;
    public $firstname;
    public $lastname;
    public $gender;
    public $birthday;
    public $bio;
    public $avatarversion;
    public $country;

    public function __construct(array $array)
    {
        $profile_id = $array['id'];
        foreach ($array as $key => $value) {
            if ('country' == $key && isset($value['id'])) {
                $this->$key = new Country($value);
            } else {
                $this->$key = $value;
            }
        }
    }
}
