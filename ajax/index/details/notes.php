<?php
/**
 * Created by IntelliJ IDEA.
 * User: BrodyTravis
 * Date: 4/17/2017
 * Time: 7:24 PM
 */

require '..\..\..\ConnectionObjects\ConnectionLink.php';

$incident_key = $_GET["incident_key"];

echo json_encode((new ConnectionLink())->query_incident_notes($incident_key));