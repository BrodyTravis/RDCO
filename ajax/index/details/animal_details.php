<?php
/**
 * Created by IntelliJ IDEA.
 * User: BrodyTravis
 * Date: 4/17/2017
 * Time: 1:28 PM
 */

require '..\..\..\ConnectionObjects\ConnectionLink.php';

$animal_key = $_GET["animal_key"];

echo json_encode((new ConnectionLink())->query_animal_details($animal_key));

