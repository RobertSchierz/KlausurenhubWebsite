<?php

function outputJSON($msg, $status = 'error'){
    header('Content-Type: application/json');
    die(json_encode(array(
        'data' => $msg,
        'status' => $status,
    )));
}


if($_FILES['uploadedfile']['error'] > 0){
    outputJSON('1', $_FILES['uploadedfile'] );
}



if($_FILES['uploadedfile']['type'] != 'application/pdf'){
    outputJSON('2', $_FILES['uploadedfile'] );
}


if($_FILES['uploadedfile']['size'] > 50000000){
    outputJSON('3', $_FILES['uploadedfile'] );
}


if(file_exists('../altklausuren/' . $_FILES['uploadedfile']['name'])){
    outputJSON('4', $_FILES['uploadedfile'] );
}


if(!move_uploaded_file($_FILES['uploadedfile']['tmp_name'], '../altklausuren/' . $_FILES['uploadedfile']['name'])){
    outputJSON('Falsches Verzeichnis');
}


outputJSON('5', $_FILES['uploadedfile'] );