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
var jsonDoctor = null;

/**
 * Variable publica que contiene el mensaje de error de la respuesta JSON recibida del servidor.
 * @var {String}
 */
var mensajeError = null;

/**
 * Variable publica que contiene un Objeto para enviar al servidor
 * @var {Object}
 */
var objetoDoctor = null;

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
 * Constante publica con la url del GATEWAY que recibe las peticiones al servidor
 * (Si fuera desde un APK o similar, DEBERA incluir la ruta completa...)
 * Si fuera desde windows 0 desktop, necesita cambiar el const por var, ya que windows 8 no soporta const
 * @var [String}
 */
const GATEWAY_DOCTOR = "../zend_gateway/index.php";

/**
 * Constante publica que contiene el nombre de la Clase a invocar al servidor
 * Si fuera desde Windows 8 Desktop, necesita cambiar el const por var, ya que windows 8 no soporta const
 * @var {String}
 */
const CLASE_DOCTOR= 'Doctor';

/**
 * Crear chismoso para el tbody:
 */
$('tbody#tbodyDoctor').bind('click', function(event)
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
 * Función para listar los Cuentahabiente mediante AJAX
 * @returns {void}
 */

function listarDoctor()
{
	peticionJSON = JSON.stringify(
			{
				"Id": generarID(),
				"method":"listar",
				"clase":CLASE_DOCTOR,
				"Params":['2']
			});
	accion = "listar";
	$.post(GATEWAY_DOCTOR, peticionJSON, exitoListarDoctor);
}//fin funtcion listarDoctores

/**
 * Función Listener para listar los Cuentahabiente mediante AJAX
 * @param {object} jsonRespuesta Objeto del tipo JSON con la respuesta recibida del Servidor
 * @returns {void}
 */
function exitoListarDoctor(jsonRespuesta)
{
	//Checamos si existio un error:
	if(jsonRespuesta.error){
		mostrarError(jsonRespuesta.error);
		return;
	}
	var indice = 0;
	jsonDoctor = jsonRespuesta.result;
	$("tbody#tbodyDoctor> tr").remove();
	if(jsonDoctor.length > 0){
		htmlNuevo = '';
		for(indice=0; indice<jsonDoctor.length; indice++){
			objetoDoctor = jsonDoctor[indice];
			jsIdDoctor = Number(objetoDoctor.Id_Doctor);
			jsCurp = String(objetoDoctor.Curp);
			jsNombre = String(objetoDoctor.Nombre);
			jsApellidoP = String(objetoDoctor.Apellidop);
			jsApellidoM = String(objetoDoctor.Apellidom);
			jsSexo = String(objetoDoctor.Sexo);
			jsMail = String(objetoDoctor.Email);
			jsTelefono = String(objetoDoctor.Telefono1);
			jsCedula = String(objetoDoctor.Cedula);
			htmlNuevo += "<tr>";
			htmlNuevo += "<td>";
			htmlNuevo += "<button id='button_editar_"+ indice +"' type='button' class='btn btn-sm btn-warning'><span class='glyphicon glyphicon-pencil'></span></button>";
			htmlNuevo +="&nbsp;";
			htmlNuevo += "<button id='button_borrar_"+ indice +"' type='button' class='btn btn-sm btn-danger'><span class='glyphicon glyphicon-trash'></span></button>";
			htmlNuevo +="&nbsp;";
			htmlNuevo += "<button id='button_ver_"+ indice +"' type='button' class='btn btn-sm btn-success'><span class='glyphicon glyphicon-eye-open'></span></button>";
			htmlNuevo += "</td>";
				htmlNuevo += "<td>" + jsIdDoctor + "</td>";
				htmlNuevo += "<td>"+ jsCurp + "</td>";
				htmlNuevo += "<td>"+ jsNombre + "</td>";
				htmlNuevo += "<td>"+ jsApellidoP + "</td>";
				htmlNuevo += "<td>"+ jsApellidoM + "</td>";
				htmlNuevo += "<td>"+ jsSexo + "</td>";
				htmlNuevo += "<td>"+ jsMail + "</td>";
				htmlNuevo += "<td>"+ jsTelefono + "</td>";
				htmlNuevo += "<td>"+ jsCedula+ "</td>";
			htmlNuevo += "</tr>";
		}
		$("tbody#tbodyDoctor").append( sanitizarHTML(htmlNuevo));
	}else{
		mostrarVentanaModal('No hay Doctor');
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
}//fin function exitoListarDoctor

/**
 * Funcion para mostrar el Doctor escogido de la lista
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
		editarDoctor(queRegistro);
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
 * Funcion para mostar el Cuentahabiente escogido de la lista
 * @param {list} indiceEscogido El indice escogido de la lista de los Doctores
 * @returns {void}
 */
function editarDoctor(indiceEscogido)
{
	$('#tabsMenu a[href="#divTabFormularioDoctor"]').tab('show');
	$("input#idDoctor").val(jsonDoctor[indiceEscogido].Id_Doctor);
	$("input#curp").val(jsonDoctor[indiceEscogido].Curp);
	$("input#nombre").val(jsonDoctor[indiceEscogido].Nombre);
	$("input#apellidoP").val(jsonDoctor[indiceEscogido].Apellidop);
	$("input#apellidoM").val(jsonDoctor[indiceEscogido].Apellidom);
	$("select#selectSexo").val(jsonDoctor[indiceEscogido].Sexo);
	$("input#eMail").val(jsonDoctor[indiceEscogido].Email);
	$("input#cp").val(jsonDoctor[indiceEscogido].Cpostal);
	$("input#Estado").val(jsonDoctor[indiceEscogido].Estado);
	$("input#Municipio").val(jsonDoctor[indiceEscogido].Municipio);
	$("input#Calle").val(jsonDoctor[indiceEscogido].Calle);
	$("input#telefono").val(jsonDoctor[indiceEscogido].Telefono1);
	$("input#cedula").val(jsonDoctor[indiceEscogido].Cedula);
	$("input#estatus").val(jsonDoctor[indiceEscogido].Estatus);
	$("h1#h1TituloFormulario").html( sanitizarHTML('Editar Doctor') );
}//fin function editarCuentahabiente

/**
 * Funcion para mostrar el formulario del nuevo Doctor
 * @returns {void}
 */
function agregarDoctor()
{
	$('#tabsMenu a[href="#divTabFormularioDoctor"]').tab('show');
	$("input#idDoctor").val(0);
	$("input#curp").val('');
	$("input#nombre").val('');
	$("input#apellidoP").val('');
	$("input#apellidoM").val('');
	$("select#selectSexo").val('');
	$("input#eMail").val('');
	$("input#cp").val('');
	$("input#Estado").val('');
	$("input#Municipio").val('');
	$("input#Calle").val('');
	$("input#telefono").val('');
	$("input#cedula").val('');
	$("input#estatus").val('');
	$("h1#h1TituloFormulario").html( sanitizarHTML('Nuevo Doctor') );
}//fin function agregarDoctor

/**
 * Funcion para guardar el Doctor
 */
function guardarDoctor()
{
	var idD = $("input#idDoctor").val();
	var curpD = $("input#curp").val();
	var nomD = $("input#nombre").val();
	var apD = $("input#apellidoP").val();
	var amD = $("input#apellidoM").val();
	var sexoD = $("select#selectSexo").val();
	var mailD = $("input#eMail").val();
	var cpD=$("input#cp").val();
	var estadoD=$("input#Estado").val();
	var muniD=$("input#Municipio").val();
	var calleD=$("input#Calle").val();
	var telD = $("input#telefono").val();
	var cedD = $("input#cedula").val();
	var estD = $("input#estatus").val();
	objetoDoctor = { Id_Doctor:idD, Curp:curpD, Nombre:nomD, Apellidop:apD, Apellidom:amD, Sexo:sexoD, Email:mailD, Cpostal:cpD, Estado:estadoD, Municipio:muniD, Calle:calleD, Telefono1:telD, Cedula:cedD, Estatus:estD};
	if(idD == 0){
		//insertar Doctor
		accion = "insertar";
	}else{
		//Actualizar Doctor
		accion = "actualizar";
	}
	peticionJSON = JSON.stringify(
			{
				"Id": generarID(),
				"method":accion,
				"clase": CLASE_DOCTOR,
				"Params":[objetoDoctor]
			});
	$.post(GATEWAY_DOCTOR, peticionJSON, exitoGuardadoDoctor);
}//fin function guardarDoctor

/**
 * Función Listener para guardar el Doctor mediante AJAX
 * @param {object} jsonRespuesta Objeto del tipo JSON con la respuesta recibida del Servidor
 * @returns {void}
 */
function exitoGuardadoDoctor(jsonRespuesta)
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
			 mostrarVentanaModal("Cuentahabiente Insertado con el ID " + jsonRespuesta.result);
		 }else{
			 //no se inserto:
			 mostrarVenatanaModal("No se pudo insertar el Doctor");
		 }//else
	break;
	case "actualizar":
		if(jsonRespuesta.result == 1){
			//Si se actualizo:
			mostrarVentanaModal("Doctor Actualizado");
		}else{
			//No se actualizo:
			mostrarVentanaModal("No se pudo actualizar el Doctor");
		}
	break;
	default:
		//No se que paso:
		mostrarVentanaModal("Tipo de respuesta no definido");
	break;
	}//switch
	mostrarListado();
}//fin function exitoGuardadoCuentahabiente

/**
*Funcion que arma la informacion que se va a mostrar con el boton ver
*@param {int} indiceEscogido indice escogido del array de pacientes
* @returns {void}
*
*/
function verInfo(indiceEscogido)
{
	var idD = jsonDoctor[indiceEscogido].Id_Doctor;
	var curpD = jsonDoctor[indiceEscogido].Curp;
	var nomD = jsonDoctor[indiceEscogido].Nombre;
	var apD = jsonDoctor[indiceEscogido].Apellidop;
	var amD = jsonDoctor[indiceEscogido].Apellidom;
	var sexoD = sexo(jsonDoctor[indiceEscogido].Sexo);
	var mailD = jsonDoctor[indiceEscogido].Email;
	var postalD = jsonDoctor[indiceEscogido].Cpostal;
	var estadoD = jsonDoctor[indiceEscogido].Estado;
	var municipioD = jsonDoctor[indiceEscogido].Municipio;
	var calleD = jsonDoctor[indiceEscogido].Calle;
	var telD = jsonDoctor[indiceEscogido].Telefono1;
	var cedula = jsonDoctor[indiceEscogido].Cedula;
	mostrarVentanaModal2('ID Doctor: <strong>'+ idD + '</strong><br />Nombre completo: <strong>'+nomD+' '+apD+' '+amD+'</strong><br/>Curp: <strong>'+curpD+'</strong><br/>Sexo: <strong>'+sexoD+'</strong><br/>Email: <strong>'+mailD+'</strong><br/>Direción: <strong>Calle '+calleD+' Municipio '+municipioD+', '+estadoD+' CP. '+postalD+'</strong><br/>Telefono: <strong>'+telD+'</strong><br/>Cedula profesional: <strong>'+cedula+'</strong>');
}
//fin function ver Info

/**
 * Funcion para solicitar confirmar el borrado del Cuentahabiente
 * @param {int} indiceEscogido indice escogido del array de Cuentahabiente
 * @returns {void}
 */
function confirmarBorrado(indiceEscogido)
{
	$('#tabsMenu a[href="#divTabBorrarDoctor"]').tab('show');
	var idD = jsonDoctor[indiceEscogido].Id_Doctor;
	var curpD = jsonDoctor[indiceEscogido].Curp;
	var nomD = jsonDoctor[indiceEscogido].Nombre;
	var apD = jsonDoctor[indiceEscogido].Apellidop;
	var amD = jsonDoctor[indiceEscogido].Apellidom;
	var sexoD = jsonDoctor[indiceEscogido].Sexo;
	var mailD = jsonDoctor[indiceEscogido].Email;
	var postalD = jsonDoctor[indiceEscogido].Cpostal;
	var estadoD = jsonDoctor[indiceEscogido].Estado;
	var municipioD = jsonDoctor[indiceEscogido].Municipio;
	var calleD = jsonDoctor[indiceEscogido].Calle;
	var telD = jsonDoctor[indiceEscogido].Telefono1;
	htmlNuevo = 'ID Doctor: <strong>'+ idD+ '</strong><br />Nombre: <strong>'+nomD+' '+apD+' '+amD+'</strong><br />CURP: <strong>'+curpD+'</strong>';
	objetoDoctor = { Id_Doctor:idD };
	$("p#pDatosDoctor").html( sanitizarHTML(htmlNuevo) );
}
//fin function confirmarBorrado

/**
 * Funcion para borrar el Doctor mediante AJAX
 * @returns {void}
 */
function borrarDoctor()
{
	peticionJSON = JSON.stringify(
			{
				"Id": generarID(),
				"method":"borrar",
				"clase": CLASE_DOCTOR,
				"Params": [objetoDoctor]
			});
	$.post(GATEWAY_DOCTOR, peticionJSON, exitoBorradoDoctor);
}//fin function borrarDoctor

/**
 * Funcion Listener para borrar el Doctormediante AJAX
 * @param {object} jsonRespuesta Objeto del tipo JSON con la respuesta recibida del Servidor
 * @returns {void}
 */
function exitoBorradoDoctor(jsonRespuesta)
{
	//Checamos si existio un error:
	if(jsonRespuesta.error){
		mostrarError(jsonRespuesta.error);
		return;
	}
	if(jsonRespuesta.result == 1){
		//Si se borro
		mostrarVentanaModal("Doctor Borrado <br />(Recuerde: Este borrado no se puede deshacer).");
		
	}else{
		//No se borro
		mostrarVentanaModal("El Doctor NO pudo ser borrado.");
	}
	mostrarListado();
}//fin function exitoBorradoDoctor

/**
 * Funcion para mostrar la pantalla de listado de Doctores
 * @returns {void}
 */
function mostrarListado()
{
	$('#tabsMenu a[href="#divTabListarDoctor"]').tab('show');
	listarDoctor();
}//fin function mostrarListado

/**
 * Función para mostrar la pantalla de Busquedas
 * @returns {void}
 */
function mostrarBusqueda()
{
	$('#tabsMenu a[href="#divTabBuscarDoctor"]').tab('show');
}//fin function mostrarBusqueda

/**
 * Funcion para buscar los Doctor mediante AJAX
 * @returns {void}
 */
function buscarDoctor()
{
	columnaBusqueda = $("select#selectColumna").val();
	criterioBusqueda = $("input#inputCriterio").val();
	accion = 'buscar';
	peticionJSON = JSON.stringify(
			{
				"Id": generarID(),
				"method":"buscar",
				"clase": CLASE_DOCTOR,
				"Params": [criterioBusqueda, columnaBusqueda, '2']
			});
	$.post(GATEWAY_DOCTOR, peticionJSON, exitoListarDoctor);
	$('#tabsMenu a[href="#divTabListarDoctor"]').tab('show');
}//fin function buscarExpediente

/**
*Funcion para mostrar el sexo completo del doctor
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
 * Funcion para mandar a crear los PDFs, mediante AJAX
 * @returns {void}
 */
function crearPDF()
{
	peticionJSON = JSON.stringify(
			{
				"Id": generarID(),
				"method":"reportePDF",
				"clase":CLASE_DOCTOR,
				"Params":[accion, criterioBusqueda, columnaBusqueda]
			});
	$.post(GATEWAY_DOCTOR, peticionJSON, exitoCrearPDF);
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