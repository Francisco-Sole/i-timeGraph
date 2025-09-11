$(function() {
	$(document).tooltip();
});

//variables globales
var identificado = 0;
var idUser = "";
var departamentos = new Array();
var colorNormal = "#006B86";
var colorHover = "#51638E"
var idDepartamento = "";
var idFamilia = "";
var idSubFamilia = "";
var idSubFamilia1 = "";
var idSubFamilia2 = "";
var fila = 0;
var guardar = new Array();
var empleados = new Array();
var pieColors = ["#148AAD","#1AC1F0","#FFD32E","#EA7777","#784A9A","#0D7491","#1AC1F0","#B4D143"];
var grafico1 = "";
var grafico2 = "";
var labels1 = [];
var labels2 = [];


//jquery
$(document).ready(function() {
	//pedimos identificacion del usuario
	//comentado, de uso publico.
	//login();
	cargarDepartamentos();
	cargarEmpleados();
});

function login(){
	if (identificado != 1) {
		$("#sombra").show();
		$("#divLogin").show();		
	}
}

function doLogin(){
	$.ajax({
		data:  $("#formLogin").serialize(),
		url:   'php/valida_user.php',
		type:  'post',
		success:  function (response) {
			if (response.length == 1) { //cambiar por 0
				identificado = 0;
				location.reload();
			}else{
				identificado = 1;
				$("#sombra").hide();
				$("#divLogin").hide();	
				idUser = response[0];
				cargarDepartamentos();
				cargarEmpleados();
			}
		},dataType: 'JSON'
	});
}

function cargarDepartamentos(){
	$.ajax({
		url:   'php/cargar_departamentos.php',
		type:  'post',
		success:  function (response) {
			departamentos = response;
			if (departamentos.length == 0) {

			}else{
				var html = "<p style='font-family: cuerpo; font-weight: 900'>Departamento</p><ul style='list-style: none;'>";
				for (var i = 0; i < departamentos.length; i++) {
					html += "<li onmouseenter='$(this).css(\"background-color\", colorHover);' onmouseleave='$(this).css(\"background-color\", colorNormal);' categoria='1' tipo='seleccionable' style='padding: 15px;background: #006B86;cursor: pointer' seleccionado='0'  name='dep" + departamentos[i][0] + "' id='dep" + departamentos[i][0] + "'>" + departamentos[i][1] + "</li>"
				}
				html += "</ul>";
				$("#departamentos").html(html);
				$("li[categoria='1']").each(function(index, el) {
					$(this).bind({
						click: function() {
							cargarFamilia($(el).attr("id"));
							idDepartamento = $(el).attr("id");
							activa($(this),1);
							$("#familias").html("");
							$("#subfamilias").html("");
							$("#subfamilias1").html("");
							$("#subfamilias2").html("");
						}
					});	
				});
			}
		},dataType: 'JSON'
	});
}

function activa (id, categoria){
	$("li[categoria='"+categoria+"']").each(function(index, el) {
		$(el).css("background-color", colorNormal)
		.attr("onmouseenter", "$(this).css(\"background-color\", colorHover);")
		.attr("onmouseleave", "$(this).css(\"background-color\", colorNormal);")
		.attr("seleccionado", "0");	
	});
	if (id == 'todo') {

	}else{
		$(id).css('background-color', colorHover)
		.attr("seleccionado", "1")
		.attr("onmouseenter", "")
		.attr("onmouseleave", "");	
	}

	if (categoria == 1) {
		 idFamilia = "";
		 idSubFamilia = "";
		 idSubFamilia1 = "";
		 idSubFamilia2 = "";
	}else if (categoria ==2) {
		 idSubFamilia = "";
		 idSubFamilia1 = "";
		 idSubFamilia2 = "";
	}else if (categoria ==3) {
		 idSubFamilia1 = "";
		 idSubFamilia2 = "";
	}else if (categoria ==4) {
		 idSubFamilia2 = "";
	}
	
}

function cargarFamilia(id){
	var data = {"id":id.split("dep")[1]};
	$.ajax({
		data : data,
		url:   'php/cargar_familias.php',
		type:  'post',
		success:  function (response) {
			departamentos = response;
			if (departamentos.length == 0) {

			}else{
				var html = "<p style='font-family: cuerpo; font-weight: 900'>Nivel 1</p><ul style='list-style: none;'>";
				for (var i = 0; i < departamentos.length; i++) {
					html += "<li onmouseenter='$(this).css(\"background-color\", colorHover);' onmouseleave='$(this).css(\"background-color\", colorNormal);' tipo='seleccionable' style='padding: 15px;background: #006B86;cursor: pointer' seleccionado='0' categoria='2' id='fam" + departamentos[i][0] + "'>" + departamentos[i][1] + "</li>"
				}
				html += "</ul>";
				$("#familias").html(html);
				$("li[categoria='2']").each(function(index, el) {
					$(el).bind({
						click: function() {
							cargarSubFamilia($(el).attr("id"));
							idFamilia = $(el).attr("id");
							activa($(this),2);
							$("#subfamilias").html("");
							$("#subfamilias1").html("");
							$("#subfamilias2").html("");

						}
					});
				});
			}
		},dataType: 'JSON'
	});
}

function cargarSubFamilia(id){
	var data = {"id":id.split("fam")[1]};
	$.ajax({
		data : data,
		url:   'php/cargar_subfamilias.php',
		type:  'post',
		success:  function (response) {
			departamentos = response;
			if (departamentos.length == 0) {

			}else{
				var html = "<p style='font-family: cuerpo; font-weight: 900'>Nivel 2</p><ul style='list-style: none;'>";
				for (var i = 0; i < departamentos.length; i++) {
					html += "<li onmouseenter='$(this).css(\"background-color\", colorHover);' onmouseleave='$(this).css(\"background-color\", colorNormal);' tipo='seleccionable' style='padding: 15px;background: #006B86;cursor: pointer' seleccionado='0' categoria='3' id='subfam" + departamentos[i][0] + "'>" + departamentos[i][1] + "</li>"
				}
				html += "</ul>";
				$("#subfamilias").html(html);
				$("li[categoria='3']").each(function(index, el) {
					$(el).bind({
						click: function() {
							cargarSubFamilia1($(el).attr("id"));
							idSubFamilia = $(el).attr("id");
							activa($(this),3);
							$("#subfamilias1").html("");
							$("#subfamilias2").html("");
						}
					});
				});
			}
		},dataType: 'JSON'
	});
}


function cargarSubFamilia1(id){
	var data = {"id":id.split("subfam")[1]};
	$.ajax({
		data : data,
		url:   'php/cargar_subfamilias1.php',
		type:  'post',
		success:  function (response) {
			departamentos = response;
			if (departamentos.length == 0) {

			}else{
				var html = "<p style='font-family: cuerpo; font-weight: 900'>Nivel 3</p><ul style='list-style: none;'>";
				for (var i = 0; i < departamentos.length; i++) {
					html += "<li onmouseenter='$(this).css(\"background-color\", colorHover);' onmouseleave='$(this).css(\"background-color\", colorNormal);' tipo='seleccionable' style='padding: 15px;background: #006B86;cursor: pointer' seleccionado='0' categoria='4' id='subfam1" + departamentos[i][0] + "'>" + departamentos[i][1] + "</li>"
				}
				html += "</ul>";
				$("#subfamilias1").html(html);
				$("li[categoria='4']").each(function(index, el) {
					$(el).bind({
						click: function() {
							cargarSubFamilia2($(el).attr("id"));
							idSubFamilia1 = $(el).attr("id");
							activa($(this),4);
							$("#subfamilias2").html("");
						}
					});
				});
			}
		},dataType: 'JSON'
	});
}

function cargarSubFamilia2(id){
	var data = {"id":id.split("subfam1")[1]};
	$.ajax({
		data : data,
		url:   'php/cargar_subfamilias2.php',
		type:  'post',
		success:  function (response) {
			departamentos = response;
			if (departamentos.length == 0) {

			}else{
				var html = "<p style='font-family: cuerpo; font-weight: 900'>Nivel 4</p><ul style='list-style: none;'>";
				for (var i = 0; i < departamentos.length; i++) {
					html += "<li onmouseenter='$(this).css(\"background-color\", colorHover);' onmouseleave='$(this).css(\"background-color\", colorNormal);' tipo='seleccionable' style='padding: 15px;background: #006B86;cursor: pointer' seleccionado='0' categoria='5' id='subfam2" + departamentos[i][0] + "'>" + departamentos[i][1] + "</li>"
				}
				html += "</ul>";
				$("#subfamilias2").html(html);
				$("li[categoria='5']").each(function(index, el) {
					$(el).bind({
						click: function() {
							//cargarSubFamilia3($(el).attr("id"));
							idSubFamilia2 = $(el).attr("id");
							activa($(this),5);
						}
					});
				});
			}
		},dataType: 'JSON'
	});
}

function previsualizacion (){
	if (idDepartamento != '') {
		try
		{
			idDepartamento = idDepartamento.split("dep")[1];
			idFamilia = idFamilia.split("fam")[1];
			idSubFamilia = idSubFamilia.split("subfam")[1];
			idSubFamilia1 = idSubFamilia1.split("subfam1")[1];
			idSubFamilia2 = idSubFamilia2.split("subfam2")[1];
		}
		catch(err) {
			console.log(err.message);
		}

		var html = "";

		html += "<div id='fila" + fila + "'>";

		$("li[seleccionado='1']").each(function(index, el) {
			html += $(el).html();
			html += " &#8658 ";
		});
		var tempHtml;
		tempHtml = html.substring(0, html.length-7);
		html = tempHtml;
		html += " <span style='color: red; font-size: 24px;cursor: pointer' onclick='borrarFila(" + fila + ")'><img height='25px;' style='position:relative; top: 6px;' src='media/img/equis.png'/></span><hr style='border: 1px solid white;'>";
		html += "</div>";

		$("#descripcion").append(html);

		$("li[tipo='seleccionable']").each(function(index, els) {
			$(els).attr("seleccionado", "0");
		});

		$("#departamentos").html("");
		$("#familias").html("");
		$("#subfamilias").html("");
		$("#subfamilias1").html("");
		$("#subfamilias2").html("");

		fila++;

		var temp = new Array();
		temp.push(idDepartamento);
		temp.push(idFamilia);
		temp.push(idSubFamilia);
		temp.push(idSubFamilia1);
		temp.push(idSubFamilia2);
		guardar.push(temp);
		idDepartamento="";
		idFamilia="";
		idSubFamilia="";
		idSubFamilia1="";
		idSubFamilia2="";
		cargarDepartamentos();

	}
	else
	{
		alert("Seleccione minimo un departamento.")
	}
}

function borrarFila(id){
	guardar.splice(id, 1);
	$("#fila"+id).remove();
	labels1 = [];
}


function enviarDatos(){
	
	if (guardar.length == 0 || todoVacio()) 
	{
		alert("No hay datos para enviar!");
	}
	else
	{

		//aqui grafico1
		var data = {"datos": JSON.stringify(guardar), "empleados": JSON.stringify(empleados), "desde": $("#desde").val(), "hasta":$("#hasta").val() };
		$.ajax({
			data : data,
			url:   'php/dame_datos_grafico.php',
			type:  'post',
			success:  function (response) {
				try 
				{
					grafico1.clear();
					$("#contenedorGrafico1").html("");
					$("#contenedorGrafico1").html("<canvas id='visionGeneral' style='width:100;'></canvas>");
					$("#legendGraficovisionGeneral").html("");				
					var totalH = 0;
					var totalM = 0;
					var media = 0;
					var data = [];
				}
				catch(err) 
				{
					console.log(err.message);
					console.log("Error controlado:");
					console.log("imposible clear");
				}
				var totalH = 0;
				var totalM = 0;
				var media = 0;
				var total_horas = response[response.length-1][0] * response[response.length-1][1] * response[response.length-1][2];
				var total_horas_empleado = response[response.length-1][1] * response[response.length-1][2];
				var empleados = response[response.length-1][0];
				var restoTotal = total_horas;
				labels1 = [];
				var data = [];
				
				totalH = 0;
				var num = 0;
				var label = "";		
				for (var i = 0; i < response.length-1; i++) {
					totalH = 0;
					totalM = 0;
					num = 0;
					media = 0;
					for (var j = 0; j < response[i].length; j++) {
						num = 0;
						totalH += parseInt(response[i][j][0]);

						if (response[i][j][1] == '30') {
							media++;
						}

						num += parseFloat(totalM);
						num += totalH;
					}
					num += parseInt(media/2);
					if (media%2 == 0) 
					{
						//totalM = 0;
					}
					else
					{
						num += 0.5;
					}
					restoTotal -= num;
					data.push(num.toFixed(2));
					label = "";
					labels1 = Array();
					$("div[id^='fila']").each(function(index, el) {
						label = $(el).html().split(" <span")[0];
						labels1.push(label);
					});
				}
				labels1.push("Resto horas");
				data.push(restoTotal.toFixed(2));
				var config = {
					type: 'doughnut',
					data: {
						datasets: [{
							data: data,
							backgroundColor: pieColors,
							hoverBorderWidth: 3,
							backgroundColor: pieColors,
							hoverBackgroundColor: pieColors,
							hoverBorderColor: ['white','white','white','white','white','white','white','white','white','white'],
							borderColor: ['black','black','black','black','black','black','black','black','black','black']
						}],
						labels: labels1
					},
					options: {
						legend:{
							display: false
						},
						maintainAspectRatio: false,
						responsive: true,
						cutoutPercentage: 80, 
						tooltips: {
							callbacks: {
								label: function(tooltipItem, data) {
									var value = data.datasets[0].data[tooltipItem.index];
									var label = data.labels[tooltipItem.index];
									var valor = (value / total_horas) * 100;
									return  [valor.toFixed(2) + '%  ' + value + ' hrs'];
								}
							}
						}   
					}
				};

				var ctx = document.getElementById('visionGeneral').getContext('2d');				
				
				//creamos el grafico vacio.
				grafico1 = new Chart(ctx,config);
				grafico1.update();
				$("#legendGraficovisionGeneral").html(grafico1.generateLegend());
				var html = "Horas totales: <span style='font-weight:900; font-size: 20px'>";
				html += total_horas;
				html += "</span> Dias: ";
				html += "<span style='font-weight:900; font-size: 20px'>";
				html += total_horas_empleado/8;
				html += "</span>";
				html += "<br/>";
				html += "Horas por empleado: <span style='font-weight:900; font-size: 20px'>";
				html += total_horas_empleado;
				html += "</span>";
				html += "<br/>";
				html += "Numero empleados: <span style='font-weight:900; font-size: 20px'>";
				html += empleados;
				html += "</span>";
				$("#infoGraficoVisionGeneral").html(html);	
			},dataType: 'JSON'
		});




		//aqui grafico2
		var datoss = {"datos": JSON.stringify(guardar), "empleados": JSON.stringify(empleados), "desde": $("#desde").val(), "hasta":$("#hasta").val() };
		$.ajax({
			data : datoss,
			url:   'php/dame_datos_grafico_empleado_tarea.php',
			type:  'post',
			success:  function (response) {
				try 
				{
					grafico2.clear();
					$("#contenedorGrafico2").html("");
					$("#contenedorGrafico2").html("<canvas id='visionPorEmpleado' style='width:100;'></canvas>");
					$("#legendGraficovisionPorEmpleado").html("");				
					var totalH = 0;
					var totalM = 0;
					var media = 0;
					var labels = [];
					var data = [];
				}
				catch(err) 
				{
					console.log(err.message);
					console.log("Error controlado:");
					console.log("imposible clear");
				}
				var labels2 = [];
				var data = [];
				var tempDats = {};
				var datasetss = [];
				var tempDataset = {};

				for (var i = 0; i < response.empleados.length; i++) {
					labels2.push(response.empleados[i][0]);
				}
				
				for (var i = 0; i < response.tareas.length; i++) {
					tempDataset = {};
					tempDataset.backgroundColor = pieColors[i];
					tempDataset.borderColor = 'black';
					tempDataset.pointRadius = '0';
					tempDataset.label = response.tareas[i];
					tempDataset.borderWidth = 1;
					var temp = [];

					var largo = response[response.tareas[i]].length;
					for (var ii = 0; ii < largo; ii++) {
						temp.push(response[response.tareas[i]][ii][0]);
					}
					tempDataset.data = temp;
					datasetss.push(tempDataset);
				}
				
				var config = {
					type: 'bar',
					data: {
						datasets:datasetss,
						labels: labels2
					},
					options: {
						maintainAspectRatio: false,
						legend:{
							display: false
						},
						scales: {
							xAxes: [{
								stacked: false,
								beginAtZero: true,
								ticks: {
									stepSize: 1,
									min: 0,
									autoSkip: false
								},
								gridLines: {
									display:false
								}   
							}],
							yAxes: [{
								ticks: {
									beginAtZero: true
								}
							}]
						},tooltips: {
							callbacks: {
								title: function (tooltipItem, data) { 
									
									return  data.datasets[tooltipItem[0].datasetIndex].label+ " " + data.labels[tooltipItem[0].index]; 
								},
								label: function(tooltipItem, data) {
									var value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
									var label = data.labels[tooltipItem.index];
									var valor = (value / (response.datos.dias*response.datos.horas_jornada)) * 100;
									return  [valor.toFixed(2) + '%  ' + value + ' hrs'];
								}
							}
						}   
					}
				};

				var ctx = document.getElementById('visionPorEmpleado').getContext('2d');				
				
				//creamos el grafico vacio.
				grafico2 = new Chart(ctx,config);
				grafico2.update();
				$("#legendGraficovisionPorEmpleado").html(grafico2.generateLegend());
			},dataType: 'JSON'
		});
	}
}


function cargarEmpleados(){
	$.ajax({
		url:   'php/cargar_empleados.php',
		type:  'post',
		success:  function (response) {
			var html = "<p style='font-family: cuerpo; font-weight: 900'>Empleados</p><ul style='list-style: none;'>";
			for (var i = 0; i < response.length; i++) {
				html += "<li onmouseenter='$(this).css(\"background-color\", colorHover);' onmouseleave='$(this).css(\"background-color\", colorNormal);' tipo='empleado' style='padding: 15px;background: #006B86;cursor: pointer' seleccionad='0' categoria='e' idempleado='" + response[i][0] + "' id='emp" + response[i][0] + "'>" + response[i][1] + "</li>"
			}
			html += "</ul>";
			$("#empleados").html(html);
			$("li[categoria='e']").each(function(index, el) {
				$(el).bind({
					click: function() {
						activaEmpleado($(this),'e');
					}
				});
			});
		},dataType: 'JSON'
	});
}

function activaEmpleado(elemento, categoria){
	
	if ($(elemento).attr("seleccionad") == "0") {
		empleados.push($(elemento).attr("idempleado"));
		$(elemento).attr("seleccionad","1")
		.css("background-color", colorHover)
		.attr("onmouseenter", "")
		.attr("onmouseleave", "");
	}else{
		$(elemento).attr("seleccionad","0")
		.css("background-color", colorNormal)
		.attr("onmouseenter", "$(this).css(\"background-color\", colorHover);")
		.attr("onmouseleave", "$(this).css(\"background-color\", colorNormal);");
		borraEmpleado(elemento);
	}
}

function borraEmpleado(elemento){
	var id = $(elemento).attr("idempleado");
	for (var i = 0; i < empleados.length; i++) {
		if(empleados[i] == id){
			empleados.splice(i,1);
		}
	}
}

function miraTeclas(e){
	if (e.keyCode == 13) {
		doLogin();
	}
}

function todoVacio(){
	var found = 0;
	for (var i = 0; i < guardar.length; i++) {
		if (guardar[i][0] == "-1"){
			//nada;
		}else{
			found++;
		}
	}
	if (found == 0) 
	{
		return true;
	}else{
		return false;
	}
}