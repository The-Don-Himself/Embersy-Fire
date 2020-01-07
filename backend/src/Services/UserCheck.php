<?php

namespace App\Services;

use App\Firebase\Authentication;
use Doctrine\ORM\EntityManagerInterface;

class UserCheck
{
    protected $em;
    private $authentication;

    public function __construct(EntityManagerInterface $em, Authentication $authentication)
    {
        $this->em = $em;
        $this->authentication = $authentication;
    }

    public function checkUsername($username)
    {
        $em = $this->em;

        $username = strip_tags($username);
        $username = str_replace(' ', '_', $username);

        $safe_username = $username;

        $forbidden = array();
        // Priviledged Usernames
        $forbidden[] = 'admin';
        $forbidden[] = 'administrator';
        $forbidden[] = 'superadmin';
        $forbidden[] = 'watson';

        // Abusive Usernames
        $forbidden[] = 'fuck';
        $forbidden[] = 'fuckme';
        $forbidden[] = 'fucker';
        $forbidden[] = 'motherfuck';
        $forbidden[] = 'motherfucker';
        $forbidden[] = 'shit';
        $forbidden[] = 'nigga';
        $forbidden[] = 'bitch';
        $forbidden[] = 'pussy';
        $forbidden[] = 'booty';
        $forbidden[] = 'cunt';
        $forbidden[] = 'dick';
        $forbidden[] = 'penis';
        $forbidden[] = 'slut';
        $forbidden[] = 'ass';
        $forbidden[] = 'asshole';
        $forbidden[] = 'whore';
        $forbidden[] = 'prostitute';
        $forbidden[] = 'pimp';
        $forbidden[] = 'bdsm';
        $forbidden[] = 'sex';
        $forbidden[] = 'sexy';
        $forbidden[] = 'sexgod';
        $forbidden[] = 'sexking';
        $forbidden[] = 'sexqueen';

        $username = str_replace('4', 'A', $username);
        $username = str_replace('1', 'i', $username);
        $username = str_replace('!', 'i', $username);
        $username = str_replace('$', 's', $username);
        $username = str_replace('z', 's', $username);
        $username = preg_replace('/[^A-Za-z]/', '', $username);
        $username = strtolower($username);
        if (in_array($username, $forbidden)) {
            return 'forbidden';
        }

        $profile = $em
            ->getRepository('App:Profiles')
            ->queryProfileByUsername($safe_username);

        if ($profile) {
            return 'exists';
        }

        return 'ok';
    }

    public function checkEmail($email)
    {
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return 'invalid';
        }

        $authentication = $this->authentication;
        $user = $authentication->getUserByEmail($email);

        if ($user) {
            return 'exists';
        }

        return 'ok';
    }

    public function checkPhone($phone)
    {
        $authentication = $this->authentication;
        $user = $authentication->getUserByPhoneNumber($phone);

        if ($user) {
            return 'exists';
        }

        return 'ok';
    }
}
