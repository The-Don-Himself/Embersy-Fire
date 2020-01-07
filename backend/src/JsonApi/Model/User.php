<?php

namespace App\JsonApi\Model;

class User
{
    public $id;
    public $email_verified;
    public $display_name;
    public $photo_url;
    public $disabled;
    public $created_at;
    public $last_login_at;
    public $profile_id;
    public $admin;

    public function __construct(array $array)
    {
        foreach ($array as $key => $value) {
            if ('uid' == $key) {
                $this->id = $value;
            } elseif ('metadata' == $key) {
                foreach ($value as $metadata_key => $metadata_value) {
                    $this->$metadata_key = $metadata_value;
                }
            } elseif ('email' == $key) {
            } elseif ('phone_number' == $key) {
            } elseif ('provider_data' == $key) {
            } elseif ('tokens_valid_after_time' == $key) {
            } elseif ('custom_attributes' == $key) {
                foreach ($value as $custom_attributes_key => $custom_attributes_value) {
                    $this->$custom_attributes_key = $custom_attributes_value;
                }
            } else {
                $this->$key = $value;
            }
        }
    }
}
