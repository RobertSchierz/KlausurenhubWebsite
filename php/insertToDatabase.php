
<?php

// Including database connections
require_once 'database_connections.php';


$data = file_get_contents("php://input");
$request = json_decode($data);

$requestJSON = json_decode($request->uploadedfile, true);



 $name = $requestJSON['name'];
 $path = 'altklausuren/' . $requestJSON['name'];
 $uploader = 'Admin';
 $school = $requestJSON['school'];
 $course = $requestJSON['course'];
 $degree = $requestJSON['degree'];
 $semester = $requestJSON['semester'];
 $subject = $requestJSON['subject'];
 $teacher = $requestJSON['teacher'];
 $year = $requestJSON['year'];


// mysqli query to fetch all data from database
$query = "      INSERT INTO `klausurenhub`.`clauses` (
                `clauseID` ,
                `clauseName` ,
                `Path` ,
                `Uploader` ,
                `schoolID` ,
                `courseID` ,
                `degreeID` ,
                `semesterID` ,
                `subjectID` ,
                `teacherID` ,
                `yearID`
                )
                VALUES (
                 NULL , '$name', '$path', '$uploader', '$school', '$course', '$degree', '$semester', '$subject', '$teacher', '$year');


";

mysqli_query($con, $query);
echo var_dump($requestJSON);
?>



