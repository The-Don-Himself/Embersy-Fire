<?php

namespace App\Services;

use App\Filesystem\Filesystem;

class ProfileCreateAvatar
{
    private $filesystem;

    public function __construct(
        Filesystem $filesystem
    ) {
        $this->filesystem = $filesystem;
    }

    public function create_avatar(int $user_id, $encoded_image, int $version, $viaapp = null)
    {
        $filesystem = $this->filesystem->getFilesystem();

        $dir = 'users/'.$user_id;
        $image_dir = $dir.'/v'.$version;

        $image_decoded = base64_decode($encoded_image);

        $im = imagecreatefromstring($image_decoded);

        $im = imagescale($im, 200, 200);

        // Enable interlancing
        imageinterlace($im, true);

        // start buffering
        ob_start();
        imagejpeg($im);
        $contents = ob_get_clean();

        $avatarFileName = $image_dir.'/avatar.jpeg';

        $filesystem->put($avatarFileName, $contents);

        $thumbnail = imagescale($im, 100, 100);

        // Enable interlancing
        imageinterlace($thumbnail, true);

        // start buffering
        ob_start();
        imagejpeg($thumbnail);
        $contents = ob_get_clean();

        $thumbnailFileName = $image_dir.'/thumb.jpeg';

        $filesystem->put($thumbnailFileName, $contents);

        imagedestroy($im);
        imagedestroy($thumbnail);

        return true;
    }
}
