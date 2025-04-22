<?php
namespace App\Helpers;
use Hashids\Hashids;

class HashIdHelper
{
    private static $hashids;

    public static function init()
    {
        if (!self::$hashids) {
            self::$hashids = new Hashids('your-secret-salt', 10); // Salt dan panjang hash
        }
        return self::$hashids;
    }

    public static function encode($id)
    {
        return self::init()->encode($id);
    }

    public static function decode($hash)
    {
        $decoded = self::init()->decode($hash);
        return $decoded ? $decoded[0] : null;
    }
}