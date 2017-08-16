<?php

/**
 * Created by IntelliJ IDEA.
 * User: BrodyTravis
 * Date: 4/14/2017
 * Time: 4:56 PM
 */


require '..\..\..\ConnectionObjects\ConnectionLink.php';

$animal_key = $_GET["animal_key"];

echo json_encode((new ConnectionLink())->query_animal_incidents($animal_key));
