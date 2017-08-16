<?php
require '..\..\ConnectionObjects\ConnectionLink.php';
$search_Val = $_GET["search_param"];
$search_Type = $_GET["filter"];
echo json_encode((new ConnectionLink())->query_licenses($search_Val, $search_Type));
