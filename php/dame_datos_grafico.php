<?php
require_once 'dbConnect.php';
$array = json_decode($_POST["datos"], true);
$empleados = json_decode($_POST["empleados"], true);
$desde = $_POST["desde"];
$hasta = $_POST["hasta"];

if ($desde == "") {
	$desde = date("Y-m-d");
}
;

if ($hasta == "") {
	$hasta = date("Y-m-d");
}
;


/*
 normas:
 - si empleado viene con 0, significa todos.
 - si desde o hasta vienen con "" significa que no rellenaron el formulario.
 - array siempre viene lleno, por lo menos con 1 elemento.
*/

$elementoLista = array();


for ($i = 0; $i < count($array); $i++) {
	if ($array[$i][0] == "-1") {
		continue;
	}

	$consulta = "SELECT e.horas,
 	e.minutos,
 	u.nombreCompleto,
 	c.nombre n1,
 	ap.nombre n2,
 	sf.nombre n3,
 	sc1.nombre n4,
 	sc2.nombre n5
 	FROM empleado_asuntoproduccion e
 	JOIN empleados u ON e.idEmpleado = u.id
 	JOIN categoria c ON c.id = e.id_departamento
 	LEFT JOIN asuntoproduccion ap ON ap.id = e.id_familia
 	LEFT JOIN subfamilia sf ON sf.id = e.id_subfamilia
 	LEFT JOIN subcategoria1 sc1 ON sc1.id = e.id_subfamilia1
 	LEFT JOIN subcategoria2 sc2 ON sc2.id = e.id_subfamilia2
 	WHERE e.id_departamento = " . $array[$i][0];

	if ($array[$i][1] == "") {
		//no hay mas se acaba la cadena de SQL.
	} else {
		$consulta .= " AND e.id_familia =" . $array[$i][1];
		if ($array[$i][2] == "") {
			//no hay mas se acaba la cadena de SQL.
		} else {
			$consulta .= " AND e.id_subfamilia =" . $array[$i][2];
			if ($array[$i][3] == "") {
				//no hay mas se acaba la cadena de SQL.
			} else {
				$consulta .= " AND e.id_subfamilia1 =" . $array[$i][3];
				if ($array[$i][4] == "") {
					//no hay mas se acaba la cadena de SQL.
				} else {
					$consulta .= " AND e.id_subfamilia2 =" . $array[$i][4];
				}
			}
		}
	}
	$consulta .= " AND e.`fechaGrabacion` BETWEEN '" . $desde . " 00:00:00' AND '" . $hasta . " 23:59:59'";
	if (count($empleados) == 0) {
		//no hago seleccion de empleados
	} else {
		$consulta .= " AND e.idEmpleado IN (";
		for ($ii = 0; $ii < count($empleados) - 1; $ii++) {
			$consulta .= $empleados[$ii] . ",";
		}
		$consulta .= $empleados[count($empleados) - 1] . ");";
	}
	//var_dump($consulta);
	$result = mysqli_query($link, $consulta);

	$temp = [];
	while (($res = mysqli_fetch_row($result)) != null) {
		array_push($temp, $res);
	}
	array_push($elementoLista, $temp);

}

$num_empleados = 0;
if (count($empleados) == 0) {
	$num_empleados = 6;
} else {
	$num_empleados = count($empleados);
}

$horas_jornada = 8;

// $datetime1 = date_create($desde);
// $datetime2 = date_create($hasta);
// $interval = date_diff($datetime1, $datetime2);

// $dias = $interval->format('%a');
$dias = 0;
$diasA = bussiness_days($desde, $hasta, "SUM");
foreach ($diasA as &$valor) {
	$dias += $valor;
}
if ($dias == 0) {
	$dias = 1;
}

$temp = [$num_empleados, $horas_jornada, intval($dias)];
array_push($elementoLista, $temp);
$resultado = json_encode($elementoLista);
echo $resultado;


function bussiness_days($begin_date, $end_date, $type = 'array')
{
	$date_1 = date_create($begin_date);
	$date_2 = date_create($end_date);
	if ($date_1 > $date_2)
		return FALSE;
	$bussiness_days = array();
	while ($date_1 <= $date_2) {
		$day_week = $date_1->format('w');
		if ($day_week > 0 && $day_week < 6) {
			$bussiness_days[$date_1->format('Y-m')][] = $date_1->format('d');
		}
		date_add($date_1, date_interval_create_from_date_string('1 day'));
	}
	if (strtolower($type) === 'sum') {
		array_map(function ($k) use (&$bussiness_days) {
			$bussiness_days[$k] = count($bussiness_days[$k]);
		}, array_keys($bussiness_days));
	}
	return $bussiness_days;
}