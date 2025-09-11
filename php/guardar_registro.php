<?php
require_once 'dbConnect.php';
$array = json_decode($_POST["datos"], true);
$id = $_POST["id"];
$r = 0;

for ($i=0; $i <count($array) ; $i++) { 
	
	$consulta = "
	INSERT INTO `empleado_asuntoproduccion` 
	(idEmpleado,
	horas,
	minutos,
	id_departamento,
	id_familia,
	id_subfamilia,
	id_subfamilia1,
	id_subfamilia2) 
	VALUE ($id,'".
	$array[$i][5][0] ."','".
	$array[$i][5][1] ."',".
	$array[$i][0] .",";
	if (isset($array[$i][1])) {
		$consulta .= $array[$i][1];
	} else
	{
		$consulta .= 'null';
	}
	$consulta .= ",";
	if (isset($array[$i][2])) {
		$consulta .= $array[$i][2];
	} else
	{
		$consulta .= 'null';
	}
	$consulta .= ",";if (isset($array[$i][3])) {
		$consulta .= $array[$i][3];
	} else
	{
		$consulta .= 'null';
	}
	$consulta .= ",";if (isset($array[$i][4])) {
		$consulta .= $array[$i][4];
	} else
	{
		$consulta .= 'null';
	}
	$consulta .= ");";
	
	$result = mysqli_query($link,$consulta);
}
	echo 1;

