
<?php

// Including database connections
require_once 'database_connections.php';




$data = file_get_contents("php://input");
$request = json_decode($data);

// mysqli query to fetch all data from database
$query = "SELECT clauseID , clauseName, Path, Uploader, courseName, schoolName, clauses.schoolID, clauses.courseID
          FROM `clauses`
          LEFT JOIN courses
          ON clauses.courseID = courses.courseID
          LEFT JOIN schools
          ON clauses.schoolID = schools.schoolID
          WHERE `clauseName` like '%$request->searchvalue%' OR `Uploader` like '%$request->searchvalue%' OR `courseName` like '%$request->searchvalue%' OR `schoolName` like '%$request->searchvalue%'";





$result = mysqli_query($con, $query);

$arr = array();

if(mysqli_num_rows($result) != 0) {
while($row = mysqli_fetch_assoc($result)) {
$arr[] = $row;
}
}

// Return json array containing data from the databasecon
echo  json_encode($arr);
?>

