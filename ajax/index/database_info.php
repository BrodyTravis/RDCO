<?php
try {
    if ($_GET['passphrase'] == "RDCORocks1") {
        $config_location = "..\\..\\config\\connection.cfg";
        $database = $_GET["database"];
        $built_config = array("server" => $_GET["server"], "username" => $_GET["username"], "password" => $_GET["password"]);

        if ($database == "both") {
            //set both connections to be the same config
            $decrypted_config = array("Shelter_Pro_Test" => $built_config, "vadim-local" => $built_config);
        } else {
            $decrypted_config = load_and_decrypt_config($config_location);
            $decrypted_config[$database] = $built_config;
        }

        encrypt_and_save_config($config_location, $decrypted_config);
    } else {
        throw new Exception();
    }
} catch (Exception $ex) {
    echo(1000);
}


function load_and_decrypt_config($config_location)
{
    $private_key_location = "..\\..\\config\\keys\\private_key.pem";

    if (!file_exists($config_location)) {
        $private_key = file_get_contents($private_key_location);
        $encrypted_config = file_get_contents($config_location);

        openssl_private_decrypt($encrypted_config, $json_encoded_config, openssl_get_privatekey($private_key));
        $decrypted_config = json_decode($json_encoded_config, true);
    } else {
        $decrypted_config = array("Shelter_Pro_Test" => null, "vadim-local" => null);
    }
    return $decrypted_config;
}

function encrypt_and_save_config($config_location, $decrypted_config)
{
    try {
        $public_key_location = "..\\..\\config\\keys\\public_key.pub";
        $public_key = file_get_contents($public_key_location);
        openssl_public_encrypt(json_encode($decrypted_config), $encrypted_config, openssl_pkey_get_public($public_key));
        file_put_contents($config_location, $encrypted_config);
    } catch (Exception $ex) {
        throw new Exception();
    }
}



