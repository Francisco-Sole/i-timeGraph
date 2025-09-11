<?php
require_once 'dbConnect.php';
$elementoLista = Array();
$consulta = "SELECT
`id`,
`nombre`
FROM
`categoria`
ORDER BY nombre ASC";

$result = mysqli_query($link, $consulta);

while (($res = mysqli_fetch_row($result)) != null) {
	array_push($elementoLista, $res);
}
$resultado = json_encode($elementoLista);
echo $resultado;