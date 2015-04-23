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
var jsonCita = null;

/**
 * Variable publica que contiene el mensaje de error de la respuesta JSON recibida del servidor.
 * @var {String}
 */
var mensajeError = null;

/**
 * Variable publica que contiene un Objeto para enviar al servidor
 * @var {Object}
 */
var objetoCita = null;

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
var recuperadoP=false;

/**
 * Variable publica que indica si recuperamos un listener 
 * @var {Integer}
 */
var recuperadoD=false;

/**
 * Variable publica que contiene el indice recuperado de la lista de listeners.
 * @var {Integer}
 */
var pacienteEscogido=null;

/**
 * Variable publica que contiene el indice recuperado de la lista de listeners.
 * @var {Integer}
 */
var doctorEscogido=null;
/**
 * Constante publica con la url del GATEWAY que recibe las peticiones al servidor
 * (Si fuera desde un APK o similar, DEBERA incluir la ruta completa...)
 * Si fuera desde windows 0 desktop, necesita cambiar el const por var, ya que windows 8 no soporta const
 * @var [String}
 */
const GATEWAY_CITA = "../zend_gateway/index.php";

/**
 * Constante publica que contiene el nombre de la Clase a invocar al servidor
 * Si fuera desde Windows 8 Desktop, necesita cambiar el const por var, ya que windows 8 no soporta const
 * @var {String}
 */
const CLASE_CITA = 'Cita';

/**
 * Crear chismoso para el tbody:
 */
$('tbody#tbodyCita').bind('click', function(event)
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
 * Función para listar los Cita mediante AJAX
 * @returns {void}
 */

function listarCita()
{
	peticionJSON = JSON.stringify(
			{
				"Id": generarID(),
				"method":"listar",
				"clase":CLASE_CITA,
				"Params":['2']
			});
	accion = "listar";
	$.post(GATEWAY_CITA, peticionJSON, exitoListarCita);
}//fin funtcion listarCitas

/**
 * Función Listener para listar los Cita mediante AJAX
 * @param {object} jsonRespuesta Objeto del tipo JSON con la respuesta recibida del Servidor
 * @returns {void}
 */
function exitoListarCita(jsonRespuesta)
{
	//Checamos si existio un error:
	if(jsonRespuesta.error){
		mostrarError(jsonRespuesta.error);
		return;
	}
	var indice = 0;
	jsonCita = jsonRespuesta.result;
	$("tbody#tbodyCita > tr").remove();
	if(jsonCita.length > 0){
		htmlNuevo = '';
		for(indice=0; indice<jsonCita.length; indice++){
			objetoCita = jsonCita[indice];
			idCita = Number(objetoCita.Id_Cita);
			dia = String(objetoCita.Dia);
			hora = String(objetoCita.Hora);
			idPaciente = Number(objetoCita.Id_Paciente);
			nombrep = String(objetoCita.nombrep);
			nombred = String(objetoCita.nombred);
			idDoctor = Number(objetoCita.Id_Doctor);
			estatus = String(objetoCita.Estatus);
			htmlNuevo += "<tr>";
			htmlNuevo += "<td>";
			htmlNuevo += "<button id='button_editar_"+ indice +"' type='button' class='btn btn-sm btn-warning'><span class='glyphicon glyphicon-pencil'></span></button>";
			htmlNuevo +="&nbsp;";
			htmlNuevo += "<button id='button_borrar_"+ indice +"' type='button' class='btn btn-sm btn-danger'><span class='glyphicon glyphicon-trash'></span></button>";
			htmlNuevo += "</td>";
				htmlNuevo += "<td>" + idCita + "</td>";
				htmlNuevo += "<td><small>ID "+ idPaciente + ":</small> "+nombrep+"</td>";
				htmlNuevo += "<td><small>ID "+ idDoctor + ":</small> "+nombred+"</td>";
				htmlNuevo += "<td>" + dia + "</td>";
				htmlNuevo += "<td>"+ hora + "</td>";
				htmlNuevo += "<td>"+ estatus + "</td>";
			htmlNuevo += "</tr>";
		}
		$("tbody#tbodyCita").append( sanitizarHTML(htmlNuevo));
	}else{
		mostrarVentanaModal('No hay Cita');
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
}//fin function exitoListarCita

/**
 * Funcion para mostrar el Cita escogido de la lista
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
		editarCita(queRegistro);
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
 * Funcion para mostar el Cita escogido de la lista
 * @param {list} indiceEscogido El indice escogido de la lista de los Citas
 * @returns {void}
 */
function editarCita(indiceEscogido)
{
	recuperadoP=true;
	recuperadoD=true;
	pacienteEscogido=jsonCita[indiceEscogido].Id_Paciente-1;
	doctorEscogido=jsonCita[indiceEscogido].Id_Doctor-1;
	$('#tabsMenu a[href="#divTabFormularioCita"]').tab('show');
	$("input#idCita").val(jsonCita[indiceEscogido].Id_Cita);
	$("input#dia").val(jsonCita[indiceEscogido].Dia);
	$("input#hora").val(jsonCita[indiceEscogido].Hora);
	$("select#selectEstatus").val(jsonCita[indiceEscogido].Estatus);
	comboPaciente();
	comboDoctor();
	$("h1#h1TituloFormulario").html( sanitizarHTML('Editar Cita') );
}//fin function editarCita

/**
 * Funcion para listar los Citas mediate AJAX
 * @return {void}
 */
function comboPaciente()
{
	peticionJSON=JSON.stringify(
	{
		"Id":generarID(),
		"method":"comboPaciente",
		"clase":CLASE_CITA,
		"Params":['2']
	});
	$.post(GATEWAY_CITA, peticionJSON, exitoLlamarComboPaciente);
}

/**
 * Funcion para listar los Citas mediante AJAX y llenar un combo de los datos.
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
	jsonCita=jsonRespuesta.result;
	$("select#idPaciente>option").remove();
	if(jsonCita.length>0)
	{

		for(indice=0;indice<jsonCita.length;indice++)
		{
			objetoCita=jsonCita[indice];
			$("select#idPaciente").append("<option value='"+ objetoCita.data +"'>"+ objetoCita.labelA +" "+ objetoCita.labelB +" "+ objetoCita.labelC +"</option>");
		}
	}
	else
	{
		$("select#idPaciente").append("<option value='X'>No hay Pacientes</option>");
	}
	if(recuperadoP)
	{
		$("select#idPaciente").val(jsonCita[pacienteEscogido].data).attr('selected','selected');

	}
}

/**
 * Funcion para listar los Citas mediate AJAX
 * @return {void}
 */
function comboDoctor()
{
	peticionJSON=JSON.stringify(
	{
		"Id":generarID(),
		"method":"comboDoctor",
		"clase":CLASE_CITA,
		"Params":['2']
	});
	$.post(GATEWAY_CITA, peticionJSON, exitoLlamarComboDoctor);
}

/**
 * Funcion para listar los Citas mediante AJAX y llenar un combo de los datos.
 * @param onject jsonRespuesta Objeto del tipo JSON con la respuesta recibida del Servidor
 * @return {void}
 */
function exitoLlamarComboDoctor(jsonRespuesta)
{
//	checamos sis existio un error
	if(jsonRespuesta.error)
	{
		mostrarError(jsonRespuesta.error);
		return;
	}
	var indice=0;
	jsonCita=jsonRespuesta.result;
	$("select#idDoctor>option").remove();
	if(jsonCita.length>0)
	{
		
		for(indice=0;indice<jsonCita.length;indice++)
		{
			objetoCita=jsonCita[indice];
			$("select#idDoctor").append("<option value='"+ objetoCita.data +"'>"+ objetoCita.labelA +" "+ objetoCita.labelB +" "+ objetoCita.labelC +"</option>");
		}
	}
	else
	{
		$("select#idDoctor").append("<option value='X'>No hay Doctores</option>");
	}
	if(recuperadoD)
	{
		$("select#idDoctor").val(jsonCita[doctorEscogido].data).attr('selected','selected');

	}
}

/**
 * Funcion para mostrar el formulario del nuevo Cita
 * @returns {void}
 */
function agregarCita()
{
	$('#tabsMenu a[href="#divTabFormularioCita"]').tab('show');
	$("input#idCita").val(0);
	$("input#dia").val('');
	$("input#hora").val('');
	$("select#estatus").val('');
	comboPaciente();
	comboDoctor();
	$("h1#h1TituloFormulario").html( sanitizarHTML('Nuevo Cita') );
}//fin function agregarCita

/**
 * Funcion para guardar el Cita
 */
function guardarCita()
{
	var idCita = $("input#idCita").val();
	var dia = $("input#dia").val();
	var hora = $("input#hora").val();
	var idPaciente = $("select#idPaciente").val();
	var idDoctor = $("select#idDoctor").val();
	var estatus = $("select#selectEstatus").val();
	
	objetoCita = {  Id_Cita:idCita, Dia:dia, Hora:hora, Id_Paciente:idPaciente, Id_Doctor:idDoctor, Estatus:estatus };
	if(idCita == 0){
		//insertar Cita
		accion = "insertar";
	}else{
		//Actualizar Cita:
		accion = "actualizar";
	}
	peticionJSON = JSON.stringify(
			{
				"Id": generarID(),
				"method":accion,
				"clase": CLASE_CITA,
				"Params":[objetoCita]
			});
	$.post(GATEWAY_CITA, peticionJSON, exitoGuardadoCita);
}//fin function guardarCita

/**
 * Función Listener para guardar el Cita mediante AJAX
 * @param {object} jsonRespuesta Objeto del tipo JSON con la respuesta recibida del Servidor
 * @returns {void}
 */
function exitoGuardadoCita(jsonRespuesta)
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
			 mostrarVentanaModal("Cita Insertado con el ID " + jsonRespuesta.result);
		 }else{
			 //no se inserto:
			 mostrarVenatanaModal("No se pudo insertar el Cita");
		 }//else
	break;
	case "actualizar":
		if(jsonRespuesta.result == 1){
			//Si se actualizo:
			mostrarVentanaModal("Cita Actualizado");
		}else{
			//No se actualizo:
			mostrarVentanaModal("No se pudo actualizar el Cita");
		}
	break;
	default:
		//No se que paso:
		mostrarVentanaModal("Tipo de respuesta no definido");
	break;
	}//switch
	mostrarListado();
}//fin function exitoGuardadoCita

/**
 * Funcion para solicitar confirmar el borrado del Cita
 * @param {int} indiceEscogido indice escogido del array de Cita
 * @returns {void}
 */
function confirmarBorrado(indiceEscogido)
{
	$('#tabsMenu a[href="#divTabBorrarCita"]').tab('show');
	var idCita = jsonCita[indiceEscogido].Id_Cita;
	var dia = jsonCita[indiceEscogido].Dia;
	var hora = jsonCita[indiceEscogido].Hora;
	var idPaciente = jsonCita[indiceEscogido].nombrep;
	htmlNuevo = 'Cita: <strong>'+ idCita + '</strong><br />Reservada por: <strong>'+nombrep+'</strong><br />Para el dia: <strong>'+dia+' a las '+hora+' hrs.</strong>';
	$("p#pDatosCita").html( sanitizarHTML(htmlNuevo) );
}
//fin function confirmarBorrado

/**
 * Funcion para borrar el Cita mediante AJAX
 * @returns {void}
 */
function borrarCita()
{
	peticionJSON = JSON.stringify(
			{
				"Id": generarID(),
				"method":"borrar",
				"clase": CLASE_CITA,
				"Params": [objetoCita]
			});
	$.post(GATEWAY_CITA, peticionJSON, exitoBorradoCita);
}//fin function borrarCita

/**
 * Funcion Listener para borrar el Cita mediante AJAX
 * @param {object} jsonRespuesta Objeto del tipo JSON con la respuesta recibida del Servidor
 * @returns {void}
 */
function exitoBorradoCita(jsonRespuesta)
{
	//Checamos si existio un error:
	if(jsonRespuesta.error){
		mostrarError(jsonRespuesta.error);
		return;
	}
	if(jsonRespuesta.result == 1){
		//Si se borro
		mostrarVentanaModal("Cita Borrado <br />(Recuerde: Este borrado no se puede deshacer).");
		
	}else{
		//No se borro
		mostrarVentanaModal("El Cita NO pudo ser borrado.");
	}
	mostrarListado();
}//fin function exitoBorradoCita

/**
 * Funcion para mostrar la pantalla de listado de Citas
 * @returns {void}
 */
function mostrarListado()
{
	$('#tabsMenu a[href="#divTabListarCita"]').tab('show');
	listarCita();
}//fin function mostrarListado

/**
 * Función para mostrar la pantalla de Busquedas
 * @returns {void}
 */
function mostrarBusqueda()
{
	$('#tabsMenu a[href="#divTabBuscarCita"]').tab('show');
}//fin function mostrarBusqueda

/**
 * Funcion para buscar los Cita mediante AJAX
 * @returns {void}
 */
function buscarCita()
{
	columnaBusqueda = $("select#selectColumna").val();
	criterioBusqueda = $("input#inputCriterio").val();
	accion = 'buscar';
	peticionJSON = JSON.stringify(
			{
				"Id": generarID(),
				"method":"buscar",
				"clase": CLASE_CITA,
				"Params": [criterioBusqueda, columnaBusqueda, '2']
			});
	$.post(GATEWAY_CITA, peticionJSON, exitoListarCita);
	$('#tabsMenu a[href="#divTabListarCita"]').tab('show');
}//fin function buscarCita

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
				"clase":CLASE_CITA,
				"Params":[accion, criterioBusqueda, columnaBusqueda]
			});
	$.post(GATEWAY_CITA, peticionJSON, exitoCrearPDF);
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