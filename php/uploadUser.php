
<?php


require_once 'database_connections.php';


$data = file_get_contents("php://input");
$request = json_decode($data, true);


 $id = $request['id'];
 $email = $request['email'];
 $name = $request['name'];




$query = "      INSERT INTO `klausurenhub`.`user` (
                `ID` ,
                `userEmail`,
                `userName`
                )
                VALUES (
                 $id , '$email', '$name');


";

mysqli_query($con, $query);
echo var_dump($id);
?>



