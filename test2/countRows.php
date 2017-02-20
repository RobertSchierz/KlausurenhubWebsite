
<?php

require_once 'database_connections.php';




$data = file_get_contents("php://input");
$request = json_decode($data, true);


 $idname = $request['rowname'];
 $id = $request[$request['rowname']];


$query = "SELECT COUNT(*)  AS count FROM `clauses`
WHERE $idname = $id";

$result = mysqli_query($con, $query);

$arr = array();

if(mysqli_num_rows($result) != 0) {
while($row = mysqli_fetch_assoc($result)) {
$arr[] = $row;
}
}


echo  json_encode($arr);
?>

