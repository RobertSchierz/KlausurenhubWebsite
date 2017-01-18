<?php
// Output JSON
function outputJSON($msg, $status = 'error'){
    header('Content-Type: application/json');
    die(json_encode(array(
        'data' => $msg,
        'status' => $status,
    )));
}

// Check for errors
if($_FILES['uploadedfile']['error'] > 0){
    outputJSON('1', $_FILES['uploadedfile'] );
}


// Check filetype
if($_FILES['uploadedfile']['type'] != 'application/pdf'){
    outputJSON('2', $_FILES['uploadedfile'] );
}

// Check filesize
if($_FILES['uploadedfile']['size'] > 50000000){
    outputJSON('3', $_FILES['uploadedfile'] );
}

// Check if the file exists
if(file_exists('../altklausuren/' . $_FILES['uploadedfile']['name'])){
    outputJSON('4', $_FILES['uploadedfile'] );
}

// Upload file
if(!move_uploaded_file($_FILES['uploadedfile']['tmp_name'], '../altklausuren/' . $_FILES['uploadedfile']['name'])){
    outputJSON('Falsches Verzeichnis');
}

// Success!
outputJSON('5', $_FILES['uploadedfile'] );