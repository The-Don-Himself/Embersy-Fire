<?php

namespace App\Filesystem;

use Google\Cloud\Storage\StorageClient;
use League\Flysystem\AdapterInterface;
use League\Flysystem\Cached\CachedAdapter;
use League\Flysystem\Cached\Storage\Memory as MemoryStore;
use League\Flysystem\Filesystem as Flysystem;
use Superbalist\Flysystem\GoogleStorage\GoogleStorageAdapter;
use Symfony\Component\DependencyInjection\ParameterBag\ContainerBagInterface;

class Filesystem
{
    private $kernel_root_dir;
    private $kernel_environment;

    public function __construct(
        ContainerBagInterface $params
    ) {
        $this->kernel_root_dir = $params->get('kernel.root_dir');
        $this->kernel_environment = $params->get('kernel.environment');
    }

    public function getFilesystem()
    {
        $kernel_environment = $this->kernel_environment;

        if ('dev' == $kernel_environment) {
            $credentialsPath = realpath($this->kernel_root_dir.'/../keys/embersy-fire-dev-firebase-adminsdk.json');

            $storage = new StorageClient([
              'projectId' => 'embersy-fire-dev',
              'requestTimeout' => 10,
              'keyFilePath' => $credentialsPath,
            ]);

            $bucket = $storage->bucket('embersy-fire-dev.appspot.com');

            $selectedAdapter = new GoogleStorageAdapter($storage, $bucket);
        } else {
            $credentialsPath = realpath($this->kernel_root_dir.'/../keys/embersy-fire-firebase-adminsdk.json');

            $storage = new StorageClient([
              'projectId' => 'embersy-fire',
              'requestTimeout' => 10,
              'keyFilePath' => $credentialsPath,
            ]);

            $bucket = $storage->bucket('embersy-fire.appspot.com');

            $selectedAdapter = new GoogleStorageAdapter($storage, $bucket);
        }

        $cacheStore = new MemoryStore();

        $adapter = new CachedAdapter($selectedAdapter, $cacheStore);

        $filesystem = new Flysystem(
            $adapter,
            [
                'visibility' => AdapterInterface::VISIBILITY_PUBLIC,
                // Google Cloud Storage Optimal Configuration
                'gs' => [
                     'acl' => 'public-read',
                     'enable_cache' => true,
                     'enable_optimistic_cache' => true,
                     'read_cache_expiry_seconds' => 31536000,
                 ],
                 'metadata' => [
                     'cacheControl' => 'public, s-maxage=31536000, max-age=31536000, immutable, stale-if-error=31536000, stale-while-revalidate=31536000',
                 ],
            ]
        );

        return $filesystem;
    }
}
