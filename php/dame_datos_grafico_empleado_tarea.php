<?php
require_once 'dbConnect.php';

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

$array = json_decode($_POST["datos"], true);
$empleados = json_decode($_POST["empleados"], true);
$cadenaEmpleados = implode(",", $empleados);
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

//consulto el nombre de las tareas seleccionadas.
$temppp = [];
for ($i = 0; $i < count($array); $i++) {
	$consultaaa = "SELECT 
 	c.nombre n1,
 	ap.nombre n2,
 	sf.nombre n3,
 	sc1.nombre n4,
 	sc2.nombre n5
 	FROM categoria c 
 	LEFT JOIN asuntoproduccion ap ON c.id = ap.idCategoria
 	LEFT JOIN subfamilia sf ON ap.id = sf.id_familia
 	LEFT JOIN subcategoria1 sc1 ON sf.id = sc1.id_subfamilia
 	LEFT JOIN subcategoria2 sc2 ON sc1.id = sc2.id_subcategoria1
 	WHERE c.id = " . $array[$i][0];

	if ($array[$i][1] == "") {
		//no hay mas se acaba la cadena de SQL.
		$limit = 1;
	} else {
		$consultaaa .= " AND ap.id =" . $array[$i][1];
		if ($array[$i][2] == "") {
			//no hay mas se acaba la cadena de SQL.
			$limit = 2;
		} else {
			$consultaaa .= " AND sf.id =" . $array[$i][2];
			if ($array[$i][3] == "") {
				//no hay mas se acaba la cadena de SQL.
				$limit = 3;
			} else {
				$consultaaa .= " AND sc1.id =" . $array[$i][3];
				if ($array[$i][4] == "") {
					//no hay mas se acaba la cadena de SQL.
					$limit = 4;
				} else {
					$consultaaa .= " AND sc2.id =" . $array[$i][4];
					$limit = 5;
				}
			}
		}
	}
	$consultaaa .= " limit 1";
	$resultado = mysqli_query($link, $consultaaa);

	$trozo = "";
	//corto los resutlados para tener el nombre correcto.
	while (($res = mysqli_fetch_row($resultado)) != null) {
		for ($ii = 0; $ii < $limit; $ii++) {
			$trozo .= $res[$ii];
			if ($ii == ($limit - 1)) {
				//nada
			} else {
				$trozo .= "⇒";
			}
		}
		array_push($temppp, $trozo);
		$trozo = "";
	}
}
//lo subo al array de response.
$elementoLista["tareas"] = $temppp;

$num_empleados = 0;
//consultamos los empleados seleccionados.
if (count($empleados) == 0) {
	$consulta = "SELECT
 	DISTINCT(nombreCompleto), id
 	FROM
 	empleados order by 1";
} else {
	$consulta = "SELECT
 	nombreCompleto,  id
 	FROM
 	empleados
 	WHERE 
 	id IN ($cadenaEmpleados) order by 1;";
}
$resultt = mysqli_query($link, $consulta);

$tempp = [];
while (($ress = mysqli_fetch_row($resultt)) != null) {
	$t = [$ress[0], $ress[1]];
	array_push($tempp, $t);
	$num_empleados += 1;
}

$elementoLista["empleados"] = $tempp;


//consulto el acumulado de hora y minutos por empleado consultado.
for ($i = 0; $i < count($array); $i++) {
	if ($array[$i][0] == "-1") {
		continue;
	}

	$consulta = "SELECT 
 	SUM(e.`horas` -1) horas,
 	SUM(e.`minutos` -1) minutos,
 	u.nombreCompleto
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
		$consulta .= $empleados[count($empleados) - 1] . ")";
	}
	$consulta .= "group by u.nombreCompleto order by 3;";
	$result = mysqli_query($link, $consulta);

	$temp = [];
	while (($res = mysqli_fetch_row($result)) != null) {
		array_push($temp, $res);
	}
	$arrayFinal = [];

	//arreglo el array para que si un empleado no tiene datos ponga 0.
	for ($ii = 0; $ii < count($elementoLista["empleados"]); $ii++) {
		$salida = 0;
		$j = 0;

		while ($salida == 0 && $j < count($temp)) {
			if ($elementoLista["empleados"][$ii][0] == $temp[$j][2]) {

				//son iguales, de paso calculo las hora con lo minutos.
				$horatemp = $temp[$j][0];
				$mins = $temp[$j][1];
				$paridad = $mins % 2;

				//si es par solo se suma la mitad de los minutos.
				if ($paridad == 0) {
					$horatemp += ($mins / 2);
				} else {
					$mins--;
					$horatemp += ($mins / 2);
					$horatemp += 0.5;
				}

				$arrayFake = [$horatemp, '0', $temp[$j][2]];
				array_push($arrayFinal, $arrayFake);
				$salida = 1;
			}
			$j++;
		}

		if ($salida == 0) {
			$arrayFake = ['0', '0', $elementoLista["empleados"][$ii][0]];
			array_push($arrayFinal, $arrayFake);
		}
	}


	$elementoLista[$elementoLista["tareas"][$i]] = $arrayFinal;
}

$horas_jornada = 8;

$dias = 0;
$diasA = bussiness_days($desde, $hasta, "SUM");
foreach ($diasA as &$valor) {
	$dias += $valor;
}

if ($dias == 0) {
	$dias = 1;
}

$temp = ["numero_empleados" => $num_empleados, "horas_jornada" => $horas_jornada, "dias" => intval($dias)];
$elementoLista["datos"] = $temp;


$resultado = json_encode($elementoLista);
echo $resultado;