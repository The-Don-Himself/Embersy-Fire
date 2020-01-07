<?php

namespace App\Firebase;

class Messaging
{
    private $firebase;

    public function __construct(Firebase $firebase)
    {
        $this->firebase = $firebase->getFirebase();
    }

    public function getMessaging()
    {
        $firebase = $this->firebase;

        $messaging = $firebase->getMessaging();

        return $messaging;
    }

    public function getClaim(string $claim)
    {
        $verifiedIdToken = $this->verifiedIdToken;

        return $verifiedIdToken ? $verifiedIdToken->getClaim($claim, null) : null;
    }

    public function isAdmin()
    {
        $verifiedIdToken = $this->verifiedIdToken;

        return $verifiedIdToken ? $verifiedIdToken->getClaim('admin', false) : false;
    }

    public function createCustomToken(string $uid)
    {
        $auth = $this->getAuth();

        $customToken = $auth->createCustomToken($uid);

        $customTokenString = (string) $customToken;

        return $customTokenString;
    }

    public function listUsers($maxResults = 1000, $batchSize = 1000)
    {
        $auth = $this->getAuth();

        $users = $auth->listUsers($maxResults, $batchSize);

        return $users;
    }
}
