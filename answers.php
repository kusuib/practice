<?php

$_REQUEST = $_POST

foreach($_REQUEST as $ key => $value){
    echo '<pre>';
    echo $key.':'.$value;
    echo '<pre>';
}

?>