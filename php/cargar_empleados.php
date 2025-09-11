<?php
require_once 'dbConnect.php';
$elementoLista = Array();
$consulta = "SELECT
`id`,
`nombrecompleto`
FROM
`empleados`
ORDER BY nombrecompleto ASC";

$result = mysqli_query($link, $consulta);

while (($res = mysqli_fetch_row($result)) != null) {
	array_push($elementoLista, $res);
}
$resultado = json_encode($elementoLista);
echo $resultado;