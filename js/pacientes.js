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
const CLASE_PACIENTES='Pacientes';

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
 * Función para listar los pacientes mediante AJAX
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
}//fin funtcion listarPacientes

/**
 * Función Listener para listar los pacientes mediante AJAX
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
			idPaciente = Number(objetoPaciente.Id_Paciente);
			idCuenta = String(objetoPaciente.nombreC);
			nombrePaciente = String(objetoPaciente.Nombre);
			apellidoUno = String(objetoPaciente.Apellidop);
			apellidoDos = String(objetoPaciente.Apellidom);
			fechaNacimiento = String(objetoPaciente.Fnacimiento);
			sexoPaciente = String(objetoPaciente.Sexo);
			htmlNuevo += "<tr>";
			htmlNuevo += "<td>";
			htmlNuevo += "<button id='button_editar_"+ indice +"' type='button' class='btn btn-sm btn-warning'><span class='glyphicon glyphicon-pencil'></span></button>";
			htmlNuevo +="&nbsp;";
			htmlNuevo += "<button id='button_borrar_"+ indice +"' type='button' class='btn btn-sm btn-danger'><span class='glyphicon glyphicon-trash'></span></button>";
			htmlNuevo +="&nbsp;";
			htmlNuevo += "<button id='button_ver_"+ indice +"' type='button' class='btn btn-sm btn-success'><span class='glyphicon glyphicon-eye-open'></span></button>";
			htmlNuevo += "</td>";
				htmlNuevo += "<td>" + idPaciente + "</td>";
				htmlNuevo += "<td>"+ idCuenta + "</td>";
				htmlNuevo += "<td>"+ nombrePaciente + "</td>";
				htmlNuevo += "<td>"+ apellidoUno + "</td>";
				htmlNuevo += "<td>"+ apellidoDos + "</td>";
				htmlNuevo += "<td>"+ fechaNacimiento + "</td>";
				htmlNuevo += "<td>"+ sexoPaciente + "</td>";
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
}//fin function exitoListarPacientes

/**
 * Funcion para mostrar el paciente escogido de la lista
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
	case 'ver':
		verInfo(queRegistro);
	break;
	default: 
		mostrarVentanaModal('No hay acción seleccionada');
	break;
	}
}//fin function seleccionoRegistro

/**
 * Funcion para mostar el paciente escogido de la lista
 * @param {list} indiceEscogido El indice escogido de la lista de los pacientes
 * @returns {void}
 */
function editarPaciente(indiceEscogido)
{
	recuperado=true;
	cuentaEscogido=jsonPacientes[indiceEscogido].Id_Cuenta-1;
	$('#tabsMenu a[href="#divTabFormularioPacientes"]').tab('show');
	$("input#idPaciente").val(jsonPacientes[indiceEscogido].Id_Paciente);
	$("input#nombre").val(jsonPacientes[indiceEscogido].Nombre);
	$("input#apellidop").val(jsonPacientes[indiceEscogido].Apellidop);
	$("input#apellidom").val(jsonPacientes[indiceEscogido].Apellidom);
	$("input#fecha").val(jsonPacientes[indiceEscogido].Fnacimiento);
	$("select#selectSexo").val(jsonPacientes[indiceEscogido].Sexo);
	comboCuenta();

	$("h1#h1TituloFormulario").html( sanitizarHTML('Editar Paciente') );
}//fin function editarMedicamento

/**
 * Funcion para listar los pacientes mediate AJAX
 * @return {void}
 */
function comboCuenta()
{
	peticionJSON=JSON.stringify(
	{
		"Id":generarID(),
		"method":"comboCuenta",
		"clase":CLASE_PACIENTES,
		"Params":['2']
	});
	$.post(GATEWAY_PACIENTES, peticionJSON, exitoLlamarComboPacientes);
}

/**
 * Funcion para listar los pacientes mediante AJAX y llenar un combo de los datos.
 * @param onject jsonRespuesta Objeto del tipo JSON con la respuesta recibida del Servidor
 * @return {void}
 */
function exitoLlamarComboPacientes(jsonRespuesta)
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
			$("select#idCuenta").append("<option value='"+ objetoPaciente.data +"'>"+ objetoPaciente.labelA +" "+ objetoPaciente.labelB +" "+ objetoPaciente.labelC +"</option>");
		}
	}
	else
	{
		$("select#idCuenta").append("<option value='X'>No hay cuentahabientes</option>");
	}
	if(recuperado)
	{
		$("select#idCuenta").val(jsonPacientes[cuentaEscogido].data).attr('selected','selected');

	}
}
/**
 * Funcion para mostrar el formulario del nuevo Paciente
 * @returns {void}
 */
function agregarPaciente()
{
	recuperado=false;
	$('#tabsMenu a[href="#divTabFormularioPacientes"]').tab('show');
	$("input#idPaciente").val(0);
	$("input#nombre").val('');
	$("input#apellidop").val('');
	$("input#apellidom").val('');
	$("select#selectSexo").val('');
	comboCuenta();
	$("h1#h1TituloFormulario").html( sanitizarHTML('Nuevo Paciente') );
}//fin function agregar

/**
 * Funcion para guardar 
 */
function guardarPaciente()
{
	var id=$("input#idPaciente").val();
	var cuenta=$("select#idCuenta").val();
	var nombrep=$("input#nombre").val();
	var apellidoUno=$("input#apellidop").val();
	var apellidoDos=$("input#apellidom").val();
	var nacimientop=$("input#fecha").val();
	var sexop=$("select#selectSexo").val();
	
	objetoPaciente = { Id_Paciente:id, Id_Cuenta:cuenta, Nombre:nombrep, Apellidop:apellidoUno, Apellidom:apellidoDos, Fnacimiento:nacimientop, Sexo:sexop};
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
			 mostrarVentanaModal("Paciente insertado con el ID " + jsonRespuesta.result);
		 }else{
			 //no se inserto:
			 mostrarVenatanaModal("No se pudo insertar el Paciente");
		 }//else
	break;
	case "actualizar":
		if(jsonRespuesta.result == 1){
			//Si se actualizo:
			mostrarVentanaModal("Paciente Actualizado");
		}else{
			//No se actualizo:
			mostrarVentanaModal("No se pudo actualizar el Paciente");
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
*Funcion que arma la informacion que se va a mostrar con el boton ver
*@param {int} indiceEscogido indice escogido del array de pacientes
* @returns {void}
*
*/
function verInfo(indiceEscogido)
{
	var curpp=jsonPacientes[indiceEscogido].Curp;
	var idPacientes=jsonPacientes[indiceEscogido].Id_Paciente;
	var nombrePacientes=jsonPacientes[indiceEscogido].Nombre;
	var apellidoPrimero=jsonPacientes[indiceEscogido].Apellidop;
	var apellidoSegundo=jsonPacientes[indiceEscogido].Apellidom;
	var nacimientoPacientes=fecha(jsonPacientes[indiceEscogido].Fnacimiento);
	var sexoPacientes=sexo(jsonPacientes[indiceEscogido].Sexo);
	mostrarVentanaModal2('ID paciente: <strong>'+ idPacientes + '</strong><br />Nombre completo: <strong>'+nombrePacientes+' '+apellidoPrimero+' '+apellidoSegundo+'</strong><br/>Sexo: <strong>'+sexoPacientes+'</strong><br/>Fecha de Nacimiento: <strong>'+nacimientoPacientes+'</strong>');
}
//fin function ver Info


/**
 * Funcion para solicitar confirmar el borrado del paciente
 * @param {int} indiceEscogido indice escogido del array de pacientes
 * @returns {void}
 */
function confirmarBorrado(indiceEscogido)
{
	$('#tabsMenu a[href="#divTabBorrarPaciente"]').tab('show');
	var idPacientes=jsonPacientes[indiceEscogido].Id_Paciente;
	var nombrePacientes=jsonPacientes[indiceEscogido].Nombre;
	var apellidoPrimero=jsonPacientes[indiceEscogido].Apellidop;
	var apellidoSegundo=jsonPacientes[indiceEscogido].Apellidom;
	var nacimientoPacientes=jsonPacientes[indiceEscogido].Fnacimiento;
	var sexoPacientes=jsonPacientes[indiceEscogido].Sexo;

	objetoPaciente = {Id_Paciente:idPacientes, Nombre:nombrePacientes, Apellidop:apellidoPrimero, Apellidom:apellidoSegundo };
	htmlNuevo = 'ID: <strong>'+ idPacientes + '</strong><br />Nombre: <strong>'+objetoPaciente.Nombre+' '+objetoPaciente.Apellidop+' '+objetoPaciente.Apellidom+'</strong>';
	
	$("p#pDatosPaciente").html( sanitizarHTML(htmlNuevo) );
}
//fin function confirmarBorrado

/**
 * Funcion para borrar el paciente mediante AJAX
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
}//fin function borrarPaciente

/**
 * Funcion Listener para borrar el paciente mediante AJAX
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
		mostrarVentanaModal("Paciente Borrado <br />(Recuerde: Este borrado no se puede deshacer).");
		
	}else{
		//No se borro
		mostrarVentanaModal("El Paciente NO pudo ser borrado.");
	}
	mostrarListado();
}//fin function exitoBorradoPaciente

/**
 * Funcion para mostrar la pantalla de listado de Pacientes
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
 * Funcion para buscar los pacientes mediante AJAX
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
}//fin function buscarPaciente

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

/**
*Funcion para convertir el fotmato de la fecha que se va a mostrar
*@para {object} la fecha de nacimiento recibido del servidor
*@return {String}
*/
function fecha(fecha)
{
	var arrayFecha=fecha.split("-");
	var mes=null;
	var arrayMes=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
	for(var i=0;i<arrayMes.length;i++)
	{
		//var compara="0"+(i+1);
		if(arrayFecha[1]==i+1)
		{
			mes=arrayMes[i];
		}
	}

	return arrayFecha[2]+" de "+mes+" de "+arrayFecha[0];
}//fin funcion fecha


/**
*Funcion para mostrar el sexo completo del paciente
*@para {String} el sexo M o F
*@return {String}
*/
function sexo(sexo)
{
	if(sexo=='M')
	{
		return "Masculino";
	}
	else
	{
		return "Femenino";
	}
}//Fin funcion Sexo

/**
 * Funcion para mostrar la ventana Modal2
 * @param {String} El codigo html a mostrar en el mensaje
 * @returns {void}
 */
 function mostrarVentanaModal2(codigoHTML)
{
	$("div#divAvisos2").html( sanitizarHTML(codigoHTML) );
	$("div#modalAvisos2").modal('show');
	
		
}//fin function mostrarVEntanModal2
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