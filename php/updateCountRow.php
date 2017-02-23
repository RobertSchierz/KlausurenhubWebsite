
<?php


require_once 'database_connections.php';


$data = file_get_contents("php://input");
$request = json_decode($data);


$query = " SELECT COUNT(*) AS count
          FROM clauses
          LEFT JOIN courses
          ON clauses.courseID = courses.courseID
          LEFT JOIN schools
          ON clauses.schoolID = schools.schoolID
          LEFT JOIN degrees
          ON clauses.degreeID = degrees.degreeID
          LEFT JOIN semesters
          ON clauses.semesterID = semesters.semesterID
          LEFT JOIN subjects
          ON clauses.subjectID = subjects.subjectID
          LEFT JOIN teachers
          ON clauses.teacherID = teachers.teacherID
          LEFT JOIN years
          ON clauses.yearID = years.yearID   $request ";


$result = mysqli_query($con, $query);

$arr = array();

if(mysqli_num_rows($result) != 0) {
while($row = mysqli_fetch_assoc($result)) {
$arr[] = $row;
}
}


echo  json_encode($arr);



?>

