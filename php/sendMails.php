
<?php


require_once 'database_connections.php';


$data = file_get_contents("php://input");
$request = json_decode($data, true);




 $name = $request['name'];



$query = "SELECT * from `klausurenhub`.`user` ";

$result = mysqli_query($con, $query);



if(mysqli_num_rows($result) != 0) {
while($row = mysqli_fetch_assoc($result)) {



$to      = $row["userEmail"];
$subject = 'Eine neue Klausur wurde hochgeladen!';
$message = $name;
$headers = 'From: webmaster@Klausurenhub.de' . "\r\n" .
    'Reply-To: webmaster@Klausurenhub.de' . "\r\n" .
    'X-Mailer: PHP/' . phpversion();

mail($to, $subject, $message, $headers);


}
}



?>



