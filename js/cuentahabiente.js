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
var jsonCuentahabiente = null;

/**
 * Variable publica que contiene el mensaje de error de la respuesta JSON recibida del servidor.
 * @var {String}
 */
var mensajeError = null;

/**
 * Variable publica que contiene un Objeto para enviar al servidor
 * @var {Object}
 */
var objetoCuentahabiente = null;

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
const GATEWAY_CUENTAHABIENTE = "../zend_gateway/index.php";

/**
 * Constante publica que contiene el nombre de la Clase a invocar al servidor
 * Si fuera desde Windows 8 Desktop, necesita cambiar el const por var, ya que windows 8 no soporta const
 * @var {String}
 */
const CLASE_CUENTAHABIENTE = 'Cuentahabiente';

/**
 * Crear chismoso para el tbody:
 */
$('tbody#tbodyCuentahabiente').bind('click', function(event)
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

function listarCuentahabiente()
{
	peticionJSON = JSON.stringify(
			{
				"Id": generarID(),
				"method":"listar",
				"clase":CLASE_CUENTAHABIENTE,
				"Params":['2']
			});
	accion = "listar";
	$.post(GATEWAY_CUENTAHABIENTE, peticionJSON, exitoListarCuentahabiente);
}//fin funtcion listarCuentahabientes

/**
 * Función Listener para listar los Cuentahabiente mediante AJAX
 * @param {object} jsonRespuesta Objeto del tipo JSON con la respuesta recibida del Servidor
 * @returns {void}
 */
function exitoListarCuentahabiente(jsonRespuesta)
{
	//Checamos si existio un error:
	if(jsonRespuesta.error){
		mostrarError(jsonRespuesta.error);
		return;
	}
	var indice = 0;
	jsonCuentahabiente = jsonRespuesta.result;
	$("tbody#tbodyCuentahabiente > tr").remove();
	if(jsonCuentahabiente.length > 0){
		htmlNuevo = '';
		for(indice=0; indice<jsonCuentahabiente.length; indice++){
			objetoCuentahabiente = jsonCuentahabiente[indice];
			jsIdCuentahabiente = Number(objetoCuentahabiente.Id_Cuenta);
			jsCurp = String(objetoCuentahabiente.Curp);
			jsNombre = String(objetoCuentahabiente.Nombre);
			jsApellidoP = String(objetoCuentahabiente.Apellidop);
			jsApellidoM = String(objetoCuentahabiente.Apellidom);
			jsSexo = String(objetoCuentahabiente.Sexo);
			jsCivil = String(objetoCuentahabiente.Ecivil);
			jsMail = String(objetoCuentahabiente.Email);
			jsTelefono = String(objetoCuentahabiente.Telefono1);
			htmlNuevo += "<tr>";
				htmlNuevo += "<td>";
					htmlNuevo += "<button id='button_editar_"+ indice +"' type='button' class='btn btn-sm btn-warning'><span class='glyphicon glyphicon-pencil'></span></button>";
					htmlNuevo +="&nbsp;";
					htmlNuevo += "<button id='button_borrar_"+ indice +"' type='button' class='btn btn-sm btn-danger'><span class='glyphicon glyphicon-trash'></span></button>";
					htmlNuevo +="&nbsp;";
					htmlNuevo += "<button id='button_ver_"+ indice +"' type='button' class='btn btn-sm btn-success'><span class='glyphicon glyphicon-eye-open'></span></button>";
				htmlNuevo += "</td>";
				htmlNuevo += "<td>" + jsIdCuentahabiente + "</td>";
				htmlNuevo += "<td>"+ jsCurp + "</td>";
				htmlNuevo += "<td>"+ jsNombre + "</td>";
				htmlNuevo += "<td>"+ jsApellidoP + "</td>";
				htmlNuevo += "<td>"+ jsApellidoM + "</td>";
				htmlNuevo += "<td>"+ jsSexo + "</td>";
				htmlNuevo += "<td>"+ jsCivil + "</td>";
				htmlNuevo += "<td>"+ jsMail + "</td>";
			htmlNuevo += "</tr>";
		}
		$("tbody#tbodyCuentahabiente").append( sanitizarHTML(htmlNuevo));
	}else{
		mostrarVentanaModal('No hay Cuentahabiente');
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
}//fin function exitoListarCuentahabiente

/**
 * Funcion para mostrar el Cuentahabiente escogido de la lista
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
		editarCuentahabiente(queRegistro);
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
 * @param {list} indiceEscogido El indice escogido de la lista de los Cuentahabientes
 * @returns {void}
 */
function editarCuentahabiente(indiceEscogido)
{
	$('#tabsMenu a[href="#divTabFormularioCuentahabiente"]').tab('show');
	$("input#idCuentahabiente").val(jsonCuentahabiente[indiceEscogido].Id_Cuenta);
	$("input#curp").val(jsonCuentahabiente[indiceEscogido].Curp);
	$("input#nombre").val(jsonCuentahabiente[indiceEscogido].Nombre);
	$("input#apellidoP").val(jsonCuentahabiente[indiceEscogido].Apellidop);
	$("input#apellidoM").val(jsonCuentahabiente[indiceEscogido].Apellidom);
	$("select#selectSexo").val(jsonCuentahabiente[indiceEscogido].Sexo);
	$("input#eCivil").val(jsonCuentahabiente[indiceEscogido].Ecivil);
	$("input#eMail").val(jsonCuentahabiente[indiceEscogido].Email);
	$("input#telefono").val(jsonCuentahabiente[indiceEscogido].Telefono);
	$("input#cp").val(jsonCuentahabiente[indiceEscogido].Cpostal);
	$("input#Estado").val(jsonCuentahabiente[indiceEscogido].Estado);
	$("input#Municipio").val(jsonCuentahabiente[indiceEscogido].Municipio);
	$("input#Calle").val(jsonCuentahabiente[indiceEscogido].Calle);
	$("input#telefono").val(jsonCuentahabiente[indiceEscogido].Telefono1);
	$("h1#h1TituloFormulario").html( sanitizarHTML('Editar Cuentahabiente') );
}//fin function editarCuentahabiente

/**
 * Funcion para mostrar el formulario del nuevo Cuentahabiente
 * @returns {void}
 */
function agregarCuentahabiente()
{
	$('#tabsMenu a[href="#divTabFormularioCuentahabiente"]').tab('show');
	$("input#idCuentahabiente").val(0);
	$("input#curp").val('');
	$("input#nombre").val('');
	$("input#apellidoP").val('');
	$("input#apellidoM").val('');
	$("select#selectSexo").val('');
	$("input#eCivil").val('');
	$("input#eMail").val('');
	$("input#eMail").val('');
	$("input#telefono").val('');
	$("input#cp").val('');
	$("input#Estado").val('');
	$("input#Municipio").val('');
	$("input#Calle").val('');
	$("h1#h1TituloFormulario").html( sanitizarHTML('Nuevo Cuentahabiente') );
}//fin function agregarCuentahabiente

/**
 * Funcion para guardar el Cuentahabiente
 */
function guardarCuentahabiente()
{
	var idC = $("input#idCuentahabiente").val();
	var curpC = $("input#curp").val();
	var nomC = $("input#nombre").val();
	var apC = $("input#apellidoP").val();
	var amC = $("input#apellidoM").val();
	var sexoC = $("select#selectSexo").val();
	var civilC = $("input#eCivil").val();
	var mailC = $("input#eMail").val();
	var telC = $("input#telefono").val();
	var cpC=$("input#cp").val();
	var estadoC=$("input#Estado").val();
	var muniC=$("input#Municipio").val();
	var calleC=$("input#Calle").val();
	
	objetoCuentahabiente = { Id_Cuenta:idC, Curp:curpC, Nombre:nomC, Apellidop:apC, Apellidom:amC, Sexo:sexoC, Ecivil:civilC, Email:mailC, Telefono1:telC,	Cpostal:cpC, Estado:estadoC, Municipio:muniC, Calle:calleC  };
	if(idC == 0){
		//insertar Cuentahabiente
		accion = "insertar";
	}else{
		//Actualizar Cuentahabiente:
		accion = "actualizar";
	}
	peticionJSON = JSON.stringify(
			{
				"Id": generarID(),
				"method":accion,
				"clase": CLASE_CUENTAHABIENTE,
				"Params":[objetoCuentahabiente]
			});
	$.post(GATEWAY_CUENTAHABIENTE, peticionJSON, exitoGuardadoCuentahabiente);
}//fin function guardarCuentahabiente

/**
 * Función Listener para guardar el Cuentahabiente mediante AJAX
 * @param {object} jsonRespuesta Objeto del tipo JSON con la respuesta recibida del Servidor
 * @returns {void}
 */
function exitoGuardadoCuentahabiente(jsonRespuesta)
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
			 mostrarVenatanaModal("No se pudo insertar el Cuentahabiente");
		 }//else
	break;
	case "actualizar":
		if(jsonRespuesta.result == 1){
			//Si se actualizo:
			mostrarVentanaModal("Cuentahabiente Actualizado");
		}else{
			//No se actualizo:
			mostrarVentanaModal("No se pudo actualizar el Cuentahabiente");
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
	var idC = jsonCuentahabiente[indiceEscogido].Id_Cuenta;
	var curpC = jsonCuentahabiente[indiceEscogido].Curp;
	var nomC = jsonCuentahabiente[indiceEscogido].Nombre;
	var apC = jsonCuentahabiente[indiceEscogido].Apellidop;
	var amC = jsonCuentahabiente[indiceEscogido].Apellidom;
	var sexoC = sexo(jsonCuentahabiente[indiceEscogido].Sexo);
	var civilC = jsonCuentahabiente[indiceEscogido].Ecivil;
	var mailC = jsonCuentahabiente[indiceEscogido].Email;
	var postal= jsonCuentahabiente[indiceEscogido].Cpostal;
	var municipio= jsonCuentahabiente[indiceEscogido].Municipio;
	var estado= jsonCuentahabiente[indiceEscogido].Estado;
	var calle= jsonCuentahabiente[indiceEscogido].Calle;
	var telC = jsonCuentahabiente[indiceEscogido].Telefono1;

	mostrarVentanaModal2('ID de Cuentahabiente: <strong>'+ idC+ '</strong><br />Curp: <strong>'+curpC+'</strong><br/>Nombre completo: <strong>'+nomC+' '+apC+' '+amC+'</strong><br/>Sexo: <strong>'+sexoC+'</strong><br/>Estado Civil: <strong>'+civilC+'</strong><br/>Email: <strong>'+mailC+'</strong><br/>Dirección: <strong>Calle '+calle+' Municipio '+municipio+', '+estado+' CP. '+postal+'</strong><br/>Telefono: <strong>'+telC+'</strong>');
}
//fin function ver Info


/**
 * Funcion para solicitar confirmar el borrado del Cuentahabiente
 * @param {int} indiceEscogido indice escogido del array de Cuentahabiente
 * @returns {void}
 */
function confirmarBorrado(indiceEscogido)
{
	$('#tabsMenu a[href="#divTabBorrarCuentahabiente"]').tab('show');
	var idC = jsonCuentahabiente[indiceEscogido].Id_Cuenta;
	var curpC = jsonCuentahabiente[indiceEscogido].Curp;
	var nomC = jsonCuentahabiente[indiceEscogido].Nombre;
	var apC = jsonCuentahabiente[indiceEscogido].Apellidop;
	var amC = jsonCuentahabiente[indiceEscogido].Apellidom;
	var sexoC = jsonCuentahabiente[indiceEscogido].Sexo;
	var civilC = jsonCuentahabiente[indiceEscogido].Ecivil;
	var mailC = jsonCuentahabiente[indiceEscogido].Email;
	var telC = jsonCuentahabiente[indiceEscogido].Telefono1;
	htmlNuevo = 'ID de Cuentahabiente: <strong>'+ idC + '</strong><br />Nombre: <strong>'+nomC+' '+apC+' '+amC+'</strong><br />CURP: <strong>'+curpC+'</strong>';
	objetoMedicamento = { Id_Cuenta:idC };
	$("p#pDatosCuentahabiente").html( sanitizarHTML(htmlNuevo) );
}
//fin function confirmarBorrado

/**
 * Funcion para borrar el Cuentahabiente mediante AJAX
 * @returns {void}
 */
function borrarCuentahabiente()
{
	peticionJSON = JSON.stringify(
			{
				"Id": generarID(),
				"method":"borrar",
				"clase": CLASE_CUENTAHABIENTE,
				"Params": [objetoCuentahabiente]
			});
	$.post(GATEWAY_CUENTAHABIENTE, peticionJSON, exitoBorradoCuentahabiente);
}//fin function borrarCuentahabiente

/**
 * Funcion Listener para borrar el Cuentahabiente mediante AJAX
 * @param {object} jsonRespuesta Objeto del tipo JSON con la respuesta recibida del Servidor
 * @returns {void}
 */
function exitoBorradoCuentahabiente(jsonRespuesta)
{
	//Checamos si existio un error:
	if(jsonRespuesta.error){
		mostrarError(jsonRespuesta.error);
		return;
	}
	if(jsonRespuesta.result == 1){
		//Si se borro
		mostrarVentanaModal("Cuentahabiente Borrado <br />(Recuerde: Este borrado no se puede deshacer).");
		
	}else{
		//No se borro
		mostrarVentanaModal("El Cuentahabiente NO pudo ser borrado.");
	}
	mostrarListado();
}//fin function exitoBorradoCuentahabiente

/**
 * Funcion para mostrar la pantalla de listado de Cuentahabientes
 * @returns {void}
 */
function mostrarListado()
{
	$('#tabsMenu a[href="#divTabListarCuentahabiente"]').tab('show');
	listarCuentahabiente();
}//fin function mostrarListado

/**
 * Función para mostrar la pantalla de Busquedas
 * @returns {void}
 */
function mostrarBusqueda()
{
	$('#tabsMenu a[href="#divTabBuscarCuentahabiente"]').tab('show');
}//fin function mostrarBusqueda

/**
 * Funcion para buscar los Cuentahabiente mediante AJAX
 * @returns {void}
 */
function buscarCuentahabiente()
{
	columnaBusqueda = $("select#selectColumna").val();
	criterioBusqueda = $("input#inputCriterio").val();
	accion = 'buscar';
	peticionJSON = JSON.stringify(
			{
				"Id": generarID(),
				"method":"buscar",
				"clase": CLASE_CUENTAHABIENTE,
				"Params": [criterioBusqueda, columnaBusqueda, '2']
			});
	$.post(GATEWAY_CUENTAHABIENTE, peticionJSON, exitoListarCuentahabiente);
	$('#tabsMenu a[href="#divTabListarCuentahabiente"]').tab('show');
}//fin function buscarCuentahabiente

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
				"clase":CLASE_CUENTAHABIENTE,
				"Params":[accion, criterioBusqueda, columnaBusqueda]
			});
	$.post(GATEWAY_CUENTAHABIENTE, peticionJSON, exitoCrearPDF);
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