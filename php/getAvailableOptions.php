
<?php

// Including database connections
require_once 'database_connections.php';




$data = file_get_contents("php://input");
$request = json_decode($data);

// mysqli query to fetch all data from database
$query = "SELECT * from $request->database ";

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

