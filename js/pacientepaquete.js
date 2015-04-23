/**	
 * Variable publica para la Generación de un TimeStamp para asegurarnos que es único.
 * @var {String}
**/
var marcaTiempo = new Date().getTime();

/**
 * Variable publica para la Generacion de un ID unico para cada peticion al servidor
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
var jsonPacientes = null;

/**
 * Variable publica que contiene el mensaje de error de la respuesta JSON recibida del servidor.
 * @var {String}
 */
var mensajeErPaciente
/**
 * Variable publica que contiene un Objeto para enviar al servidor
 * @var {Object}
 */
var objetoPaciente = null;

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
var recuperado=false;

/**
 * Variable publica que contiene el indice recuperado de la lista de listeners.
 * @var {Integer}
 */
var cuentaEscogido=null;

/**
 * Constante publica con la url del GATEWAY que recibe las peticiones al servidor
 * (Si fuera desde un APK o similar, DEBERA incluir la ruta completa...)
 * Si fuera desde windows 0 desktop, necesita cambiar el const por var, ya que windows 8 no soporta const
 * @var [String}
 */

const GATEWAY_PACIENTES = "../zend_gateway/index.php";

/**
 * Constante publica que contiene el nombre de la Clase a invocar al servidor
 * Si fuera desde Windows 8 Desktop, necesita cambiar el const por var, ya que windows 8 no soporta const
 * @var {String}
 */
const CLASE_PACIENTES='PacientePaquete';

/**
 * Crear chismoso para el tbody:
 */
$('tbody#tbodyPacientes').bind('click', function(event)
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
 * Función para listar los PacientesPaquetes mediante AJAX
 * @returns {void}
 */

function listarPacientes()
{
	peticionJSON = JSON.stringify(
			{
				"Id": generarID(),
				"method":"listar",
				"clase":CLASE_PACIENTES,
				"Params":['2']
			});
	accion = "listar";
	$.post(GATEWAY_PACIENTES, peticionJSON, exitoListarPacientes);
}//fin funtcion listarPacientesPaquetes

/**
 * Función Listener para listar los PacientesPaquetes mediante AJAX
 * @param {object} jsonRespuesta Objeto del tipo JSON con la respuesta recibida del Servidor
 * @returns {void}
 */
function exitoListarPacientes(jsonRespuesta)
{
	//Checamos si existio un error:
	if(jsonRespuesta.error){
		mostrarError(jsonRespuesta.error);
		return;
	}
	var indice = 0;
	jsonPacientes = jsonRespuesta.result;
	$("tbody#tbodyPacientes> tr").remove();
	if(jsonPacientes.length > 0){
		htmlNuevo = '';
		for(indice=0; indice<jsonPacientes.length; indice++){
			objetoPaciente = jsonPacientes[indice];
			idPaciente = Number(objetoPaciente.ClavePP);
			idCuenta = String(objetoPaciente.nombre)+" "+String(objetoPaciente.ap1)+" "+String(objetoPaciente.ap2);
			idPaquete = String(objetoPaciente.nombre_Paquete);
			fecha = String(objetoPaciente.Fecha);
			hora = String(objetoPaciente.Hora);
			htmlNuevo += "<tr>";
			htmlNuevo += "<td>";
			htmlNuevo += "<button id='button_editar_"+ indice +"' type='button' class='btn btn-sm btn-warning'><span class='glyphicon glyphicon-pencil'></span></button>";
			htmlNuevo +="&nbsp;";
			htmlNuevo += "<button id='button_borrar_"+ indice +"' type='button' class='btn btn-sm btn-danger'><span class='glyphicon glyphicon-trash'></span></button>";
			htmlNuevo +="&nbsp;";
			
			htmlNuevo += "</td>";
				htmlNuevo += "<td>" + idPaciente + "</td>";
				htmlNuevo += "<td>"+ idCuenta + "</td>";
				htmlNuevo += "<td>"+ idPaquete + "</td>";
				htmlNuevo += "<td>"+ fecha + "</td>";
				htmlNuevo += "<td>"+ hora + " <small>hrs.</small></td>";
			htmlNuevo += "</tr>";
		}
		$("tbody#tbodyPacientes").append( sanitizarHTML(htmlNuevo));
	}else{
		mostrarVentanaModal('No hay Pacientes');
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
}//fin function exitoListarPacientesPaquetes

/**
 * Funcion para mostrar el pais escogido de la lista
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
		editarPaciente(queRegistro);
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
 * Funcion para mostar el pais escogido de la lista
 * @param {list} indiceEscogido El indice escogido de la lista de los PacientesPaquetes
 * @returns {void}
 */
function editarPaciente(indiceEscogido)
{
	recuperado=true;
	cuentaEscogido=jsonPacientes[indiceEscogido].Id_Paciente-1;
	$('#tabsMenu a[href="#divTabFormularioPacientes"]').tab('show');
	$("input#idPaciente").val(jsonPacientes[indiceEscogido].ClavePP);
	$("input#fecha").val(jsonPacientes[indiceEscogido].Fecha);
	$("input#hora").val(jsonPacientes[indiceEscogido].Hora);
	comboPaciente();
	comboPaquete();

	$("h1#h1TituloFormulario").html( sanitizarHTML('Editar Paciente') );
}//fin function editarMedicamento

/**
 * Funcion para listar los PacientesPaquetes mediate AJAX
 * @return {void}
 */
function comboPaciente()
{
	peticionJSON=JSON.stringify(
	{
		"Id":generarID(),
		"method":"comboPaciente",
		"clase":CLASE_PACIENTES,
		"Params":['2']
	});
	$.post(GATEWAY_PACIENTES, peticionJSON, exitoLlamarComboPaciente);
}

/**
 * Funcion para listar los PacientesPaquetes mediate AJAX
 * @return {void}
 */
function comboPaquete()
{
	peticionJSON=JSON.stringify(
	{
		"Id":generarID(),
		"method":"comboPaquete",
		"clase":CLASE_PACIENTES,
		"Params":['2']
	});
	$.post(GATEWAY_PACIENTES, peticionJSON, exitoLlamarComboPaquete);
}
/**
 * Funcion para listar los PacientesPaquetes mediante AJAX y llenar un combo de los datos.
 * @param onject jsonRespuesta Objeto del tipo JSON con la respuesta recibida del Servidor
 * @return {void}
 */
function exitoLlamarComboPaquete(jsonRespuesta)
{
//	checamos sis existio un error
	if(jsonRespuesta.error)
	{
		mostrarError(jsonRespuesta.error);
		return;
	}
	var indice=0;
	jsonPacientes=jsonRespuesta.result;
	$("select#idPaquete>option").remove();
	if(jsonPacientes.length>0)
	{
		for(indice=0;indice<jsonPacientes.length;indice++)
		{
			objetoPaciente=jsonPacientes[indice];
			$("select#idPaquete").append("<option value='"+ objetoPaciente.data +"'>"+objetoPaciente.labelA+"</option>");
		}
	}
	else
	{
		$("select#idPaquete").append("<option value='x'>No hay PacientesPaquetes</option>");
	}
	if(recuperado)
	{
		$("select#idPaquete").val(jsonPacientes[cuentaEscogido].data).attr('selected','selected');

	}
}
/**
 * Funcion para listar los PacientesPaquetes mediante AJAX y llenar un combo de los datos.
 * @param onject jsonRespuesta Objeto del tipo JSON con la respuesta recibida del Servidor
 * @return {void}
 */
function exitoLlamarComboPaciente(jsonRespuesta)
{
//	checamos sis existio un error
	if(jsonRespuesta.error)
	{
		mostrarError(jsonRespuesta.error);
		return;
	}
	var indice=0;
	jsonPacientes=jsonRespuesta.result;
	$("select#idCuenta>option").remove();
	if(jsonPacientes.length>0)
	{
		for(indice=0;indice<jsonPacientes.length;indice++)
		{
			objetoPaciente=jsonPacientes[indice];
			$("select#idCuenta").append("<option value='"+ objetoPaciente.data +"'>"+ objetoPaciente.labelC +" "+ objetoPaciente.labelA +" "+ objetoPaciente.labelB +"</option>");
		}
	}
	else
	{
		$("select#idCuenta").append("<option value='x'>No hay Pacientes</option>");
	}
	if(recuperado)
	{
		$("select#idCuenta").val(jsonPacientes[cuentaEscogido].data).attr('selected','selected');

	}
}
/**
 * Funcion para mostrar el formulario del nuevo Pais
 * @returns {void}
 */
function agregarPaciente()
{
	recuperado=false;
	$('#tabsMenu a[href="#divTabFormularioPacientes"]').tab('show');
	$("input#idPaciente").val(0);
	$("input#fecha").val('');
	$("input#hora").val('');
	comboPaquete();
	comboPaciente();
	$("h1#h1TituloFormulario").html( sanitizarHTML('Nueva Compra de paquete') );
}//fin function agregar

/**
 * Funcion para guardar 
 */
function guardarPaciente()
{
	var id=$("input#idPaciente").val();
	var pac=$("select#idCuenta").val();
	var paq=$("select#idPaquete").val();
	var fecha=$("input#fecha").val();
	var hora=$("input#hora").val();
	
	objetoPaciente = { ClavePP:id, Fecha:fecha, Hora:hora, Clave_Paquete:paq, Id_Paciente:pac };
	if(id == 0){
		//insertar Medicamento:
		accion = "insertar";
	}else{
		//Actualizar Medicamento:
		accion = "actualizar";
	}
	peticionJSON = JSON.stringify(
			{
				"Id": generarID(),
				"method":accion,
				"clase": CLASE_PACIENTES,
				"Params":[objetoPaciente]
			});
	$.post(GATEWAY_PACIENTES, peticionJSON, exitoGuardadoPaciente);
}//fin function guardar

/**
 * Función Listener para guardar el medicamento mediante AJAX
 * @param {object} jsonRespuesta Objeto del tipo JSON con la respuesta recibida del Servidor
 * @returns {void}
 */
function exitoGuardadoPaciente(jsonRespuesta)
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
			 mostrarVentanaModal("Compra de paquete insertado con el ID " + jsonRespuesta.result);
		 }else{
			 //no se inserto:
			 mostrarVenatanaModal("No se pudo insertar el Paciente");
		 }//else
	break;
	case "actualizar":
		if(jsonRespuesta.result == 1){
			//Si se actualizo:
			mostrarVentanaModal("Compar de paquete Actualizado");
		}else{
			//No se actualizo:
			mostrarVentanaModal("No se pudo actualizar la compra");
		}
	break;
	default:
		//No se que paso:
		mostrarVentanaModal("Tipo de respuesta no definido");
	break;
	}//switch
	mostrarListado();
}//fin function exitoGuardado


/**
 * Funcion para solicitar confirmar el borrado del pais
 * @param {int} indiceEscogido indice escogido del array de PacientesPaquetes
 * @returns {void}
 */
function confirmarBorrado(indiceEscogido)
{
	$('#tabsMenu a[href="#divTabBorrarPaciente"]').tab('show');
	var idPP=jsonPacientes[indiceEscogido].ClavePP;
	var ap1=jsonPacientes[indiceEscogido].ap1;
	var ap2=jsonPacientes[indiceEscogido].ap2;
	var nombre=jsonPacientes[indiceEscogido].nombre;

	objetoPaciente = {ClavePP:idPP, Id_Paciente:idPaciente, Clave_Paquete:idPaquete};
	htmlNuevo = 'Paquete: <strong>'+ idPP + '</strong><br />A nombre del Paciente <strong>'+nombre+' '+ap1+' '+ap2+'</strong>';
	
	$("p#pDatosPacientep").html( sanitizarHTML(htmlNuevo) );
}
//fin function confirmarBorrado

/**
 * Funcion para borrar el pais mediante AJAX
 * @returns {void}
 */
function borrarPaciente()
{
	peticionJSON = JSON.stringify(
			{
				"Id": generarID(),
				"method":"borrar",
				"clase": CLASE_PACIENTES,
				"Params": [objetoPaciente]
			});
	$.post(GATEWAY_PACIENTES, peticionJSON, exitoBorradoPaciente);
}//fin function borrarPais

/**
 * Funcion Listener para borrar el pais mediante AJAX
 * @param {object} jsonRespuesta Objeto del tipo JSON con la respuesta recibida del Servidor
 * @returns {void}
 */
function exitoBorradoPaciente(jsonRespuesta)
{
	//Checamos si existio un error:
	if(jsonRespuesta.error){
		mostrarError(jsonRespuesta.error);
		return;
	}
	if(jsonRespuesta.result == 1){
		//Si se borro
		mostrarVentanaModal("Compra Borrada <br />(Recuerde: Este borrado no se puede deshacer).");
		
	}else{
		//No se borro
		mostrarVentanaModal("La compra NO pudo ser borrado.");
	}
	mostrarListado();
}//fin function exitoBorradoPais

/**
 * Funcion para mostrar la pantalla de listado de PacientesPaquetes
 * @returns {void}
 */
function mostrarListado()
{
	$('#tabsMenu a[href="#divTabListarPacientes"]').tab('show');
	listarPacientes();
}//fin function mostrarListado

/**
 * Función para mostrar la pantalla de Busquedas
 * @returns {void}
 */
function mostrarBusqueda()
{
	$('#tabsMenu a[href="#divTabBuscarPaciente"]').tab('show');
}//fin function mostrarBusqueda

/**
 * Funcion para buscar los PacientesPaquetes mediante AJAX
 * @returns {void}
 */
function buscarPaciente()
{
	columnaBusqueda = $("select#selectColumna").val();
	criterioBusqueda = $("input#inputCriterio").val();
	accion = 'buscar';
	peticionJSON = JSON.stringify(
			{
				"Id": generarID(),
				"method":"buscar",
				"clase": CLASE_PACIENTES,
				"Params": [criterioBusqueda, columnaBusqueda, '2']
			});
	$.post(GATEWAY_PACIENTES, peticionJSON, exitoListarPacientes);
	$('#tabsMenu a[href="#divTabListarPacientes"]').tab('show');
}//fin function buscarPais

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
				"clase":CLASE_PACIENTES,
				"Params":[accion, criterioBusqueda, columnaBusqueda]
			});
	$.post(GATEWAY_PACIENTES, peticionJSON, exitoCrearPDF);
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
 
function mostrarVentanaModal(codigoHTML)
{
	$("div#divAvisos").html( sanitizarHTML(codigoHTML) );
	$("div#modalAvisos").modal('show');
}//fin function mostrarVEntanModal