
<?php

// Including database connections
require_once 'database_connections.php';


// mysqli query to fetch all data from database
$query = "SELECT clauseID , clauseName, Path, Uploader, courseName, schoolName
          FROM clauses
          LEFT JOIN courses
          ON clauses.courseID = courses.courseID
          LEFT JOIN schools
          ON clauses.schoolID = schools.schoolID";

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

