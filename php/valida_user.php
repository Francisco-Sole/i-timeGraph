<?php
require_once 'dbConnect.php';
$nombre = $_POST["user"];
$pass = $_POST["passwd"];

$consulta="
SELECT u.id
	FROM usuario u 
WHERE u.nombre = '$nombre' AND 
	u.password = '$pass'";

$result = mysqli_query($link,$consulta);
$r = [];
while ($pos = mysqli_fetch_object($result))
{
	array_push($r, $pos->id);
}
echo json_encode($r);