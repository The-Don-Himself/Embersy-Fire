<?php

namespace App\Firebase;

use Kreait\Firebase\Factory;
use Kreait\Firebase\ServiceAccount;
use Symfony\Component\Cache\Simple\ApcuCache;
use Symfony\Component\DependencyInjection\ParameterBag\ContainerBagInterface;

class Firebase
{
    private $kernel_root_dir;
    private $kernel_environment;

    public function __construct(
        ContainerBagInterface $params
    ) {
        $this->kernel_root_dir = $params->get('kernel.root_dir');
        $this->kernel_environment = $params->get('kernel.environment');
    }

    public function getFirebase()
    {
        $kernel_environment = $this->kernel_environment;
        if ('dev' == $kernel_environment) {
            $credentialsPath = realpath($this->kernel_root_dir.'/../embersy-fire-dev-firebase-adminsdk-jropn-53a00f2a8d.json');
        } else {
            $credentialsPath = realpath($this->kernel_root_dir.'/../embersy-fire-firebase-adminsdk-29shp-49d10a058d.json');
        }
        $serviceAccount = ServiceAccount::fromJsonFile($credentialsPath);

        $cache = new ApcuCache();
        $firebase = (new Factory())
            ->withServiceAccount($serviceAccount)
            ->withVerifierCache($cache)
            ->create();

        return $firebase;
    }
}
