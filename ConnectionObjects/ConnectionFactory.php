<?php
require_once 'ConnectionBase.php';

/**
 * Class ConnectionFactory
 */
class ConnectionFactory
{
    protected static $container;
    protected $connections;

    /**
     * ConnectionFactory constructor.
     */
    public function __construct()
    {
        try {
            $this->connections = array("shelterpro" => new ConnectionBase("Shelter_Pro_Test"), "vadim" => new ConnectionBase("vadim-local"));
        } catch (exception $ex) {
            die("Connection Factory Error: $ex");
        }

    }

    /**
     * @return ConnectionFactory
     */
    public static function get_factory()
    {
        if (is_null(self::$container)) {
            self::$container = new ConnectionFactory();
        }
        return self::$container;
    }

    /**
     * @return mixed
     */
    public function get_shelterpro_connection()
    {
        return $this->connections["shelterpro"];
    }

    /**
     * @return mixed
     */
    public function get_vadim_connection()
    {
        return $this->connections["vadim"];
    }
}
