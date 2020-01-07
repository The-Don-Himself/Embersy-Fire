<?php

namespace App\JsonApi\Model;

class Accounts
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

    public $settings;

    public $token;

    public function __construct(array $array)
    {
        foreach ($array as $key => $value) {
            if ('id' == $key) {
                $this->$key = $value;
            } elseif ('country' == $key && isset($value['id'])) {
                $this->$key = new Country($value);
            } else {
                $this->$key = $value;
            }
        }
    }
}
