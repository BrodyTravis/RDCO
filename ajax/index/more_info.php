<?php
/**
 * Created by IntelliJ IDEA.
 * User: BrodyTravis
 * Date: 4/4/2017
 * Time: 3:59 PM
 */
$type = $_GET["type"];
$id = $_GET["id"];

$connection_link = new ConnectionLink();

if ($type == "animal") {
    $connection_link;
} else if ($type == "owner") {

}

echo "type:$type id:$id";