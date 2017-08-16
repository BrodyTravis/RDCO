<?php
require '..\..\ConnectionObjects\ConnectionLink.php';
echo json_encode((new ConnectionLink())->query_animals());
