<?php
// Output JSON
function outputJSON($msg, $status = 'error'){
    header('Content-Type: application/json');
    die(json_encode(array(
        'data' => $msg,
        'status' => $status
    )));
}

// Check for errors
if($_FILES['uploadedfile']['error'] > 0){
    outputJSON('An error ocurred when uploading.');
}


// Check filetype
if($_FILES['uploadedfile']['type'] != 'application/pdf'){
    outputJSON('Unsupported filetype uploaded.');
}

// Check filesize
if($_FILES['uploadedfile']['size'] > 500000){
    outputJSON('File uploaded exceeds maximum upload size.');
}

// Check if the file exists
if(file_exists('../altklausuren/' . $_FILES['uploadedfile']['name'])){
    outputJSON('File with that name already exists.');
}

// Upload file
if(!move_uploaded_file($_FILES['uploadedfile']['tmp_name'], '../altklausuren/' . $_FILES['uploadedfile']['name'])){
    outputJSON('Error uploading file - check destination is writeable.');
}

// Success!
outputJSON('File uploaded successfully to "' . '../altklausuren/' . $_FILES['uploadedfile']['name'] . '".', 'success');