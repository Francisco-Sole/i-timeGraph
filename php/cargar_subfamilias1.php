<?php
require_once 'dbConnect.php';
$id = $_POST["id"];
$elementoLista = Array();
$consulta = "SELECT
a.id,
a.nombre
FROM
`subcategoria1` a
WHERE id_subfamilia = $id
ORDER BY 2 ASC";

//var_dump($consulta);
$result = mysqli_query($link, $consulta);

while (($res = mysqli_fetch_row($result)) != null) {
	array_push($elementoLista, $res);
}
$resultado = json_encode($elementoLista);
echo $resultado;