<?php
require '..\..\ConnectionObjects\ConnectionLink.php';
if ((new ConnectionLink())->log_in(filter_input(INPUT_POST, "login_username"), filter_input(INPUT_POST, "login_password")) == true) {
    //user logged in so refresh pages
    echo json_encode(array("message" => "Logged in successfull!", "code" => 999));
} else {
    echo json_encode(array("message" => "Invalid username/password!", "code" => 1000));
}
?>
