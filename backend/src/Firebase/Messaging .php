<?php

namespace App\Firebase;

class Messaging
{
    private $factory;

    public function __construct(Firebase $firebase)
    {
		$this->factory = $firebase->getFactory();
    }

    public function getMessaging()
    {
        $factory = $this->factory;

        $messaging = $factory->createMessaging();

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
