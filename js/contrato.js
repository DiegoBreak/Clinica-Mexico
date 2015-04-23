
/**	
 * Variable publica para la Generación de un TimeStamp para asegurarnos que es único.
 * @var {String}
**/
var marcaTiempo = new Date().getTime();

/**
 * Variable publica para la Generacion de un ID unico para cada 
 */
var idLlamada = null;

/**
 * Variable public que contiene la respuesta del servidor
 * @var {Object}
 */
var jsonRespuesta = null;

/**
 * Variable publica para crear la peticioin JSON que se enviara al servidor.
 * @var {JSON}
 */
var peticionJSON = null;

/**
 * Variable publica que contiene el mensaje de error de la respuesta JSON recibida del servidor
 */
var jsonContrato = null;

/**
 * Variable publica que contiene el mensaje de error de la respuesta JSON recibida del servidor.
 * @var {String}
 */
var mensajeError = null;

/**
 * Variable publica que contiene un Objeto para enviar al servidor
 * @var {Object}
 */
var objetoContrato = null;

/**
 * Variable publica que contiene el nombre de la ultima accion realizada. 
 * @var {String}
 */ 
var accion = null;

/**
 * Variable publica que contiene el nombre de la ultima acción realizada 
 */
var columnaBusqueda = null;

/**
 * Variable publica que contiene el criterio para las busquedas.
 * @var {String}
 */
var criterioBusqueda = null;

/**
 * Variable publica que indica si recuperamos un listener 
 * @var {Integer}
 */
var recuperadoC=false;

/**
 * Variable publica que indica si recuperamos un listener 
 * @var {Integer}
 */
var recuperadoM=false;

/**
 * Variable publica que contiene el indice recuperado de la lista de listeners.
 * @var {Integer}
 */
var cuentaEscogido=null;

/**
 * Variable publica que contiene el indice recuperado de la lista de listeners.
 * @var {Integer}
 */
var membresiaEscogido=null;
/**
 * Constante publica con la url del GATEWAY que recibe las peticiones al servidor
 * (Si fuera desde un APK o similar, DEBERA incluir la ruta completa...)
 * Si fuera desde windows 0 desktop, necesita cambiar el const por var, ya que windows 8 no soporta const
 * @var [String}
 */
const GATEWAY_CONTRATO = "../zend_gateway/index.php";

/**
 * Constante publica que contiene el nombre de la Clase a invocar al servidor
 * Si fuera desde Windows 8 Desktop, necesita cambiar el const por var, ya que windows 8 no soporta const
 * @var {String}
 */
const CLASE_CONTRATO = 'Contrato';

/**
 * Crear chismoso para el tbody:
 */
$('tbody#tbodyContrato').bind('click', function(event)
{
	if(event.target != "[object HTMLButtonElement]")
	{
		if(event.target.parentElement == "[object HTMLButtonElement]")
		{
			seleccionoRegistro(event.target.parentElement.id);
		}
	}else{
		seleccionoRegistro(event.target.id);
	}
});

/**
 * Funcion para generar un ID aleatorio
 * @returns {String}
 */

function generarID()
{
	idLlamada = (''+Math.random()).substring(2);
	return idLlamada;
}//fin function generarID

/**
 * Funcion para genera sanitizar un codigo HTML nuevo (es para Windows 8 Desktop)
 * @param {String} El codigo HTM a sanitizar
 * @returns {String}
 */

function sanitizarHTML(codigoHTML)
{
	var htmlSanitizado = codigoHTML;
	if(window.toStaticHTML){
		//Estamos en Windows 8 Desktop, hay que sanitizar el HTML:
		htmlSanitizado = window.toStaticHTML(htmlSanitizado);
	}
	return htmlSanitizado;
}//fin function sanitizarHTML

/**
 * Función para listar los Contrato mediante AJAX
 * @returns {void}
 */

function listarContrato()
{
	peticionJSON = JSON.stringify(
			{
				"Id": generarID(),
				"method":"listar",
				"clase":CLASE_CONTRATO,
				"Params":['2']
			});
	accion = "listar";
	$.post(GATEWAY_CONTRATO, peticionJSON, exitoListarContrato);
}//fin funtcion listarContratos

/**
 * Función Listener para listar los Contrato mediante AJAX
 * @param {object} jsonRespuesta Objeto del tipo JSON con la respuesta recibida del Servidor
 * @returns {void}
 */
function exitoListarContrato(jsonRespuesta)
{
	//Checamos si existio un error:
	if(jsonRespuesta.error){
		mostrarError(jsonRespuesta.error);
		return;
	}
	var indice = 0;
	jsonContrato = jsonRespuesta.result;
	$("tbody#tbodyContrato > tr").remove();
	if(jsonContrato.length > 0){
		htmlNuevo = '';
		for(indice=0; indice<jsonContrato.length; indice++){
			objetoContrato = jsonContrato[indice];
			idContrato = Number(objetoContrato.Id_Contrato);
			nombrec = String(objetoContrato.nombrec);
			idCuenta = Number(objetoContrato.Id_Cuenta);
			nombrep = String(objetoContrato.nombrep);
			idMembresia = Number(objetoContrato.Id_Membresia);
			fechaInicio = String(objetoContrato.FechaInicio);
			fechaFin = String(objetoContrato.FechaFin);
			htmlNuevo += "<tr>";
			htmlNuevo += "<td>";
			htmlNuevo += "<button id='button_editar_"+ indice +"' type='button' class='btn btn-sm btn-warning'><span class='glyphicon glyphicon-pencil'></span></button>";
			htmlNuevo +="&nbsp;";
			htmlNuevo += "<button id='button_borrar_"+ indice +"' type='button' class='btn btn-sm btn-danger'><span class='glyphicon glyphicon-trash'></span></button>";
			htmlNuevo += "</td>";
				htmlNuevo += "<td>" + idContrato + "</td>";
				htmlNuevo += "<td>ID " +idCuenta+':  '+ nombrep + "</td>";
				htmlNuevo += "<td>"+ nombrec + "</td>";
				htmlNuevo += "<td>"+ fechaInicio + "</td>";
				htmlNuevo += "<td>"+ fechaFin + "</td>";
			htmlNuevo += "</tr>";
		}
		$("tbody#tbodyContrato").append( sanitizarHTML(htmlNuevo));
	}else{
		mostrarVentanaModal('No hay Contrato');
	}
	switch (accion){
		case 'buscar':
			//Mostramos el boton de listar todos:
			$("button#buttonListarTodos").show();
		break;
		case 'listar':
			//Ocultamos el boton de listar todos:
			$("button#buttonListarTodos").hide();
			break;
	}//switch
}//fin function exitoListarContrato

/**
 * Funcion para mostrar el Contrato escogido de la lista
 * @param {int} idBoton el ID del boton pulsado en el tbody
 * @returns {void}
 */
function seleccionoRegistro(idBoton)
{
	//Partiendo de que llega: button_editar_1, button_editar_2, etc... button_borar_1, button_borrar_2, etc..
	var arraycitoIDS = idBoton.split("_");
	var queAccion = arraycitoIDS[1];// es editar o borrar
	var queRegistro = Number(arraycitoIDS[2]);//Un numero desde CERO (posicion del array, no el id del registro)...
	switch(queAccion){
	case 'editar':
		editarContrato(queRegistro);
	break;
	case 'borrar':
		confirmarBorrado(queRegistro);
	break;
	default: 
		mostrarVentanaModal('No hay acción seleccionada');
	break;
	}
}//fin function seleccionoRegistro

/**
 * Funcion para mostar el Contrato escogido de la lista
 * @param {list} indiceEscogido El indice escogido de la lista de los Contratos
 * @returns {void}
 */
function editarContrato(indiceEscogido)
{
	recuperadoC=true;
	recuperadoM=true;
	cuentaEscogido=jsonContrato[indiceEscogido].Id_Cuenta-1;
	membresiaEscogido=jsonContrato[indiceEscogido].Id_Membresia-1;
	$('#tabsMenu a[href="#divTabFormularioContrato"]').tab('show');
	$("input#idContrato").val(jsonContrato[indiceEscogido].Id_Contrato);
	$("input#fechaInicio").val(jsonContrato[indiceEscogido].FechaInicio);
	$("input#fechaFin").val(jsonContrato[indiceEscogido].FechaFin);
	comboCuenta();
	comboMembresia();
	$("h1#h1TituloFormulario").html( sanitizarHTML('Editar Contrato') );
}//fin function editarContrato

/**
 * Funcion para listar los Contratos mediate AJAX
 * @return {void}
 */
function comboCuenta()
{
	peticionJSON=JSON.stringify(
	{
		"Id":generarID(),
		"method":"comboCuenta",
		"clase":CLASE_CONTRATO,
		"Params":['2']
	});
	$.post(GATEWAY_CONTRATO, peticionJSON, exitoLlamarComboCuenta);
}

/**
 * Funcion para listar los Contratos mediante AJAX y llenar un combo de los datos.
 * @param onject jsonRespuesta Objeto del tipo JSON con la respuesta recibida del Servidor
 * @return {void}
 */
function exitoLlamarComboCuenta(jsonRespuesta)
{
//	checamos sis existio un error
	if(jsonRespuesta.error)
	{
		mostrarError(jsonRespuesta.error);
		return;
	}
	var indice=0;
	jsonContrato=jsonRespuesta.result;
	$("select#idCuenta>option").remove();
	if(jsonContrato.length>0)
	{

		for(indice=0;indice<jsonContrato.length;indice++)
		{
			objetoContrato=jsonContrato[indice];
			$("select#idCuenta").append("<option value='"+ objetoContrato.data +"'>"+ objetoContrato.data+'  '+objetoContrato.labelA +" "+ objetoContrato.labelC+" "+ objetoContrato.labelB+"</option>");
		}
	}
	else
	{
		$("select#idCuenta").append("<option value='X'>No hay cuentahabientes</option>");
	}
	if(recuperadoC)
	{
		$("select#idCuenta").val(jsonContrato[cuentaEscogido].data).attr('selected','selected');

	}
}

/**
 * Funcion para listar los Contratos mediate AJAX
 * @return {void}
 */
function comboMembresia()
{
	peticionJSON=JSON.stringify(
	{
		"Id":generarID(),
		"method":"comboMembresia",
		"clase":CLASE_CONTRATO,
		"Params":['2']
	});
	$.post(GATEWAY_CONTRATO, peticionJSON, exitoLlamarComboMembresia);
}

/**
 * Funcion para listar los Contratos mediante AJAX y llenar un combo de los datos.
 * @param onject jsonRespuesta Objeto del tipo JSON con la respuesta recibida del Servidor
 * @return {void}
 */
function exitoLlamarComboMembresia(jsonRespuesta)
{
//	checamos sis existio un error
	if(jsonRespuesta.error)
	{
		mostrarError(jsonRespuesta.error);
		return;
	}
	var indice=0;
	jsonContrato=jsonRespuesta.result;
	$("select#idMembresia>option").remove();
	if(jsonContrato.length>0)
	{
		
		for(indice=0;indice<jsonContrato.length;indice++)
		{
			objetoContrato=jsonContrato[indice];
			$("select#idMembresia").append("<option value='"+ objetoContrato.data +"'>"+ objetoContrato.labelA +" "+ objetoContrato.labelB +" "+ objetoContrato.labelC +"</option>");
		}
	}
	else
	{
		$("select#idMembresia").append("<option value='X'>No hay membresia</option>");
	}
	if(recuperadoM)
	{
		$("select#idMembresia").val(jsonContrato[membresiaEscogido].data).attr('selected','selected');

	}
}

/**
 * Funcion para mostrar el formulario del nuevo Contrato
 * @returns {void}
 */
function agregarContrato()
{
	$('#tabsMenu a[href="#divTabFormularioContrato"]').tab('show');
	$("input#idContrato").val(0);
	$("input#fechaInicio").val('');
	$("input#fechaFin").val('');
	comboCuenta();
	comboMembresia();
	$("h1#h1TituloFormulario").html( sanitizarHTML('Nuevo Contrato') );
}//fin function agregarContrato

/**
 * Funcion para guardar el Contrato
 */
function guardarContrato()
{
	var idContrato = $("input#idContrato").val();
	var idCuenta = $("select#idCuenta").val();
	var idMembresia = $("select#idMembresia").val();
	var fechaInicio = $("input#fechaInicio").val();
	var fechaFin = $("input#fechaFin").val();
	
	objetoContrato = {  Id_Contrato:idContrato, Id_Cuenta:idCuenta, Id_Membresia:idMembresia, FechaInicio:fechaInicio, FechaFin:fechaFin  };
	if(idContrato == 0){
		//insertar Contrato
		accion = "insertar";
	}else{
		//Actualizar Contrato:
		accion = "actualizar";
	}
	peticionJSON = JSON.stringify(
			{
				"Id": generarID(),
				"method":accion,
				"clase": CLASE_CONTRATO,
				"Params":[objetoContrato]
			});
	$.post(GATEWAY_CONTRATO, peticionJSON, exitoGuardadoContrato);
}//fin function guardarContrato

/**
 * Función Listener para guardar el Contrato mediante AJAX
 * @param {object} jsonRespuesta Objeto del tipo JSON con la respuesta recibida del Servidor
 * @returns {void}
 */
function exitoGuardadoContrato(jsonRespuesta)
{
	//Checamos si existio un error:
	if(jsonRespuesta.error){
		mostrarError(jsonRespuesta.error);
		return;
	}
	switch(accion){
	case "insertar":
		 if(jsonRespuesta.result > 0){
			 //Si se inserto:
			 mostrarVentanaModal("Contrato Insertado con el ID " + jsonRespuesta.result);
		 }else{
			 //no se inserto:
			 mostrarVenatanaModal("No se pudo insertar el Contrato");
		 }//else
	break;
	case "actualizar":
		if(jsonRespuesta.result == 1){
			//Si se actualizo:
			mostrarVentanaModal("Contrato Actualizado");
		}else{
			//No se actualizo:
			mostrarVentanaModal("No se pudo actualizar el Contrato");
		}
	break;
	default:
		//No se que paso:
		mostrarVentanaModal("Tipo de respuesta no definido");
	break;
	}//switch
	mostrarListado();
}//fin function exitoGuardadoContrato

/**
 * Funcion para solicitar confirmar el borrado del Contrato
 * @param {int} indiceEscogido indice escogido del array de Contrato
 * @returns {void}
 */
function confirmarBorrado(indiceEscogido)
{
	$('#tabsMenu a[href="#divTabBorrarContrato"]').tab('show');
	var idContrato = jsonContrato[indiceEscogido].Id_Contrato;
	var idCuenta = jsonContrato[indiceEscogido].nombrep;
	var idMembresia = jsonContrato[indiceEscogido].nombrec;
	var fechaInicio = jsonContrato[indiceEscogido].FechaInicio;
	var fechaFin = jsonContrato[indiceEscogido].FechaFin;
	htmlNuevo = 'ID: <strong>'+ idContrato + '</strong><br />Nombre: <strong>'+idCuenta+'</strong><br />Membresia: <strong>'+idMembresia+'</strong>';
	objetoContrato = { Id_Contrato:idContrato };
	$("p#pDatosContrato").html( sanitizarHTML(htmlNuevo) );
}
//fin function confirmarBorrado

/**
 * Funcion para borrar el Contrato mediante AJAX
 * @returns {void}
 */
function borrarContrato()
{
	peticionJSON = JSON.stringify(
			{
				"Id": generarID(),
				"method":"borrar",
				"clase": CLASE_CONTRATO,
				"Params": [objetoContrato]
			});
	$.post(GATEWAY_CONTRATO, peticionJSON, exitoBorradoContrato);
}//fin function borrarContrato

/**
 * Funcion Listener para borrar el Contrato mediante AJAX
 * @param {object} jsonRespuesta Objeto del tipo JSON con la respuesta recibida del Servidor
 * @returns {void}
 */
function exitoBorradoContrato(jsonRespuesta)
{
	//Checamos si existio un error:
	if(jsonRespuesta.error){
		mostrarError(jsonRespuesta.error);
		return;
	}
	if(jsonRespuesta.result == 1){
		//Si se borro
		mostrarVentanaModal("Contrato Borrado <br />(Recuerde: Este borrado no se puede deshacer).");
		
	}else{
		//No se borro
		mostrarVentanaModal("El Contrato NO pudo ser borrado.");
	}
	mostrarListado();
}//fin function exitoBorradoContrato

/**
 * Funcion para mostrar la pantalla de listado de Contratos
 * @returns {void}
 */
function mostrarListado()
{
	$('#tabsMenu a[href="#divTabListarContrato"]').tab('show');
	listarContrato();
}//fin function mostrarListado

/**
 * Función para mostrar la pantalla de Busquedas
 * @returns {void}
 */
function mostrarBusqueda()
{
	$('#tabsMenu a[href="#divTabBuscarContrato"]').tab('show');
}//fin function mostrarBusqueda

/**
 * Funcion para buscar los Contrato mediante AJAX
 * @returns {void}
 */
function buscarContrato()
{
	columnaBusqueda = $("select#selectColumna").val();
	criterioBusqueda = $("input#inputCriterio").val();
	accion = 'buscar';
	peticionJSON = JSON.stringify(
			{
				"Id": generarID(),
				"method":"buscar",
				"clase": CLASE_CONTRATO,
				"Params": [criterioBusqueda, columnaBusqueda, '2']
			});
	$.post(GATEWAY_CONTRATO, peticionJSON, exitoListarContrato);
	$('#tabsMenu a[href="#divTabListarContrato"]').tab('show');
}//fin function buscarContrato

/**
 * Funcion para mandar a crear los PDFs, mediante AJAX
 * @returns {void}
 */
function crearPDF()
{
	peticionJSON = JSON.stringify(
			{
				"Id": generarID(),
				"method":"reportePDF",
				"clase":CLASE_CONTRATO,
				"Params":[accion, criterioBusqueda, columnaBusqueda]
			});
	$.post(GATEWAY_CONTRATO, peticionJSON, exitoCrearPDF);
}//fin function crearPDF


/**
 * Funcion Listener para los PDFs mediante AJAX
 * @param {object} jsonRespuesta Objeto del tipo JSON con la respuesta recibida del servidor
 * @returns {void}
 */
function exitoCrearPDF(jsonRespuesta)
{
	//Checamos si existio un error:
	if(jsonRespuesta.error){
		mostrarError(jsonRespuesta.error);
		return;
	}
	if(jsonRespuesta.result !='' && (jsonRespuesta.result.substr(jsonRespuesta.result.length - 4) == '.pdf')){
		//Revisar.. pendiente en Windows 8...
		window.location.assign('../pdfs/'+jsonRespuesta.result);
	}else{
		//No se pudo crear el pdf:
		mostrarVentanaModal("El PDF, no pudo ser creado.");
	} 
}//fin function exitoCrearPDF

/**
 * Funcion para mostrar los Errores
 * @param {object} elError Objeto del tipo JSON con el error recibido del Servidor
 * @returns {void}
 */
function mostrarError(elError)
{
	switch(elError.code){
		case 1451:
		
			mensajeError ="Este registro no puede ser eliminado ya que es lleve foranea en otra tabla" ;
		break;
		case -32000:

			mensajeError = elError.message;
		break;
		case -32600:
			mensajeError = elError.message;
		break;
		case -32601:
			mensajeError = elError.message;
		break;
		case -32602:
			mensajeError = elError.message;
		break;
		case -32603:
			mensajeError = elError.message;
		break;
		case -32700:
			mensajeError = elError.message;
		break;
		default:
			mensajeError = "Error "+ elError.code + ":<br />" + elError.message;
		break;
	}//switch
	mostrarVentanaModal(mensajeError);
}//fin function mostrarError

/**
 * Funcion para mostrar la ventana Modal
 * @param {String} El codigo html a mostrar en el mensaje
 * @returns {void}
 */  
function mostrarVentanaModal(codigoHTML)
{
	$("div#divAvisos").html( sanitizarHTML(codigoHTML) );
	$("div#modalAvisos").modal('show');
}//fin function mostrarVEntanModal