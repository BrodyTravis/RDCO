<?php
/**
 * Class ConnectionBase
 */
class ConnectionBase
{

    public $connection = null;

    /**
     * ConnectionBase constructor.
     *
     * @param $database_name
     *
     * @throws Exception
     */
    public function __construct($database_name)
    {
        try {
            $config_location = __DIR__ . "\\..\\config\\connection.cfg";
            $config_file = $this->load_and_decrypt_config($config_location);
            $this->connection = new PDO('sqlsrv:Server=' . $config_file[$database_name]["server"] . ';Database=' . $database_name, $config_file[$database_name]["username"], $config_file[$database_name]["password"]);
            $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (Exception $ex) {
            throw new Exception("ERROR CONNECTING TO DATABASE! \nVerify the provided database information", 1001);
        }
    }

    /**
     * @param $config_location
     *
     * @return mixed
     * @throws Exception
     */
    function load_and_decrypt_config($config_location)
    {
        $private_key_location = __DIR__ . "\\..\\config\\keys\\private_key.pem";

        if (file_exists($config_location)) {
            $private_key = file_get_contents($private_key_location);
            $encrypted_config = file_get_contents($config_location);
            openssl_private_decrypt($encrypted_config, $json_encoded_config, openssl_get_privatekey($private_key, "RDCORocks1"));
            $decrypted_config = json_decode($json_encoded_config, true);
            return $decrypted_config;
        }
        throw new Exception("NO CONFIG FILE FOUND");
    }

    /**
     * @param $query_string
     * @param $execute_values
     *
     * @return mixed
     */
    public function run_query($query_string, $execute_values)
    {  //LEFT AS PUBLIC FOR NOW TO TEST QUERIES FROM TEST.PHP, FIX ON RELEASE
        try {
            $prepared_query = $this->prepare_query($query_string);
            return $this->execute_query($prepared_query, $execute_values);
        } catch (PDOException $e) {
            trigger_error('Wrong SQL: ' . $query_string . ' Error: ' . $e->getMessage(), E_USER_ERROR);
        }
        return 0;
    }

    /**
     * @param $query_string
     *
     * @return PDOStatement
     */
    private function prepare_query($query_string)
    {
        return $this->connection->prepare($query_string);
    }

    /**
     * @param $prepared_query
     * @param $execute_values
     *
     * @return array|null
     */
    private function execute_query($prepared_query, $execute_values)
    {
        //echo "executing";
        $prepared_query->execute($execute_values);
        $res = $prepared_query->fetchAll(PDO::FETCH_ASSOC);
        if (count($res) > 0) {
            return $res;
        }
        return null;
    }


}
