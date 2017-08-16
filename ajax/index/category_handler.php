<?php
/**
 * Created by IntelliJ IDEA.
 * User: BrodyTravis
 * Date: 4/18/2017
 * Time: 5:28 PM
 */


if (!isset($_GET["category"])) {
    $category = "404";
} else {
    $category = $_GET["category"];
}

try {
    switch ($category) {
        case $category == "home" || $category == "login" || $category == "licenses" || $category == "config":
            $file_path = "../../html/categories/" . $_GET["category"] . "/content.html";
            break;
        case $category == "animals" || $category == "people":
            $file_path = "../../html/categories/table_category_base.html";
            break;

        default:
            $file_path = "../../html/404.html";
            break;
    }
    if (file_exists($file_path)) {
        echo file_get_contents($file_path);
    } else {
        echo "NO FILE @ " . $file_path;
    }
} catch (Exception $ex) {
    die($ex);
}
