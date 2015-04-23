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
var jsonPaquete = null;

/**
 * Variable publica que contiene el mensaje de error de la respuesta JSON recibida del servidor.
 * @var {String}
 */
var mensajeError = null;

/**
 * Variable publica que contiene un Objeto para enviar al servidor
 * @var {Object}
 */
var objetoPaquete = null;

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
const GATEWAY_PAQUETE = "../zend_gateway/index.php";

/**
 * Constante publica que contiene el nombre de la Clase a invocar al servidor
 * Si fuera desde Windows 8 Desktop, necesita cambiar el const por var, ya que windows 8 no soporta const
 * @var {String}
 */
const CLASE_PAQUETE = 'Paquete';

/**
 * Crear chismoso para el tbody:
 */
$('tbody#tbodyPaquete').bind('click', function(event)
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
 * Función para listar los Paquete mediante AJAX
 * @returns {void}
 */

function listarPaquete()
{
	peticionJSON = JSON.stringify(
			{
				"Id": generarID(),
				"method":"listar",
				"clase":CLASE_PAQUETE,
				"Params":['2']
			});
	accion = "listar";
	$.post(GATEWAY_PAQUETE, peticionJSON, exitoListarPaquete);
}//fin funtcion listarPaquetes

/**
 * Función Listener para listar los Paquete mediante AJAX
 * @param {object} jsonRespuesta Objeto del tipo JSON con la respuesta recibida del Servidor
 * @returns {void}
 */
function exitoListarPaquete(jsonRespuesta)
{
	//Checamos si existio un error:
	if(jsonRespuesta.error){
		mostrarError(jsonRespuesta.error);
		return;
	}
	var indice = 0;
	jsonPaquete = jsonRespuesta.result;
	$("tbody#tbodyPaquete > tr").remove();
	if(jsonPaquete.length > 0){
		htmlNuevo = '';
		for(indice=0; indice<jsonPaquete.length; indice++){
			objetoPaquete = jsonPaquete[indice];
			jsclavePaquete = Number(objetoPaquete.Clave_Paquete);
			jsDescripcion = String(objetoPaquete.Descripcion);
			jsPrecio = Number(objetoPaquete.Precio);
			jsNombre = String(objetoPaquete.Nombre);
			htmlNuevo += "<tr>";
			htmlNuevo += "<td>";
			htmlNuevo += "<button id='button_editar_"+ indice +"' type='button' class='btn btn-sm btn-warning'><span class='glyphicon glyphicon-pencil'></span></button>";
			htmlNuevo +="&nbsp;";
			htmlNuevo += "<button id='button_borrar_"+ indice +"' type='button' class='btn btn-sm btn-danger'><span class='glyphicon glyphicon-trash'></span></button>";
			htmlNuevo += "</td>";
				htmlNuevo += "<td>" + jsclavePaquete + "</td>";
				htmlNuevo += "<td>"+ jsDescripcion + "</td>";
				htmlNuevo += "<td>"+ jsPrecio + "</td>";
				htmlNuevo += "<td>"+ jsNombre + "</td>";
			htmlNuevo += "</tr>";
		}
		$("tbody#tbodyPaquete").append( sanitizarHTML(htmlNuevo));
	}else{
		mostrarVentanaModal('No hay Paquete');
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
}//fin function exitoListarPaquete

/**
 * Funcion para mostrar el Paquete escogido de la lista
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
		editarPaquete(queRegistro);
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
 * Funcion para mostar el Paquete escogido de la lista
 * @param {list} indiceEscogido El indice escogido de la lista de los paquetes
 * @returns {void}
 */
function editarPaquete(indiceEscogido)
{
	$('#tabsMenu a[href="#divTabFormularioPaquete"]').tab('show');
	$("input#clavePaquete").val(jsonPaquete[indiceEscogido].Clave_Paquete);
	$("input#descripcion").val(jsonPaquete[indiceEscogido].Descripcion);
	$("input#precio").val(jsonPaquete[indiceEscogido].Precio);
	$("input#nombre").val(jsonPaquete[indiceEscogido].Nombre);
	$("h1#h1TituloFormulario").html( sanitizarHTML('Editar Paquete') );
}//fin function editarPaquete

/**
 * Funcion para mostrar el formulario del nuevo Paquete
 * @returns {void}
 */
function agregarPaquete()
{
	$('#tabsMenu a[href="#divTabFormularioPaquete"]').tab('show');
	$("input#clavePaquete").val(0);
	$("input#descripcion").val('');
	$("input#precio").val('');
	$("input#nombre").val('');
	$("h1#h1TituloFormulario").html( sanitizarHTML('Nuevo Paquete') );
}//fin function agregarPaquete

/**
 * Funcion para guardar el Paquete
 */
function guardarPaquete()
{
	var claveP = $("input#clavePaquete").val();
	var descP = $("input#descripcion").val();
	var preP = $("input#precio").val();
	var nomP = $("input#nombre").val();
	
	objetoPaquete = { Clave_Paquete:claveP, Descripcion:descP, Precio:preP, Nombre:nomP  };
	if(claveP == 0){
		//insertar Paquete
		accion = "insertar";
	}else{
		//Actualizar Paquete:
		accion = "actualizar";
	}
	peticionJSON = JSON.stringify(
			{
				"Id": generarID(),
				"method":accion,
				"clase": CLASE_PAQUETE,
				"Params":[objetoPaquete]
			});
	$.post(GATEWAY_PAQUETE, peticionJSON, exitoGuardadoPaquete);
}//fin function guardarPaquete

/**
 * Función Listener para guardar el Paquete mediante AJAX
 * @param {object} jsonRespuesta Objeto del tipo JSON con la respuesta recibida del Servidor
 * @returns {void}
 */
function exitoGuardadoPaquete(jsonRespuesta)
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
			 mostrarVentanaModal("Paquete Insertado con el ID " + jsonRespuesta.result);
		 }else{
			 //no se inserto:
			 mostrarVenatanaModal("No se pudo insertar el Paquete");
		 }//else
	break;
	case "actualizar":
		if(jsonRespuesta.result == 1){
			//Si se actualizo:
			mostrarVentanaModal("Paquete Actualizado");
		}else{
			//No se actualizo:
			mostrarVentanaModal("No se pudo actualizar el Paquete");
		}
	break;
	default:
		//No se que paso:
		mostrarVentanaModal("Tipo de respuesta no definido");
	break;
	}//switch
	mostrarListado();
}//fin function exitoGuardadoPaquete

/**
 * Funcion para solicitar confirmar el borrado del Paquete
 * @param {int} indiceEscogido indice escogido del array de Paquete
 * @returns {void}
 */
function confirmarBorrado(indiceEscogido)
{
	$('#tabsMenu a[href="#divTabBorrarPaquete"]').tab('show');
	var claveP = jsonPaquete[indiceEscogido].Clave_Paquete;
	var desP = jsonPaquete[indiceEscogido].Descripcion;
	var preP = jsonPaquete[indiceEscogido].Precio;
	var nomP = jsonPaquete[indiceEscogido].Nombre;
	htmlNuevo = 'Paquete: <strong>'+ claveP + '</strong><br />Nombre: <strong>'+nomP+'</strong>';
	$("p#pDatosPaquete").html( sanitizarHTML(htmlNuevo) );
}
//fin function confirmarBorrado

/**
 * Funcion para borrar el Paquete mediante AJAX
 * @returns {void}
 */
function borrarPaquete()
{
	peticionJSON = JSON.stringify(
			{
				"Id": generarID(),
				"method":"borrar",
				"clase": CLASE_PAQUETE,
				"Params": [objetoPaquete]
			});
	$.post(GATEWAY_PAQUETE, peticionJSON, exitoBorradoPaquete);
}//fin function borrarPais

/**
 * Funcion Listener para borrar el Paquete mediante AJAX
 * @param {object} jsonRespuesta Objeto del tipo JSON con la respuesta recibida del Servidor
 * @returns {void}
 */
function exitoBorradoPaquete(jsonRespuesta)
{
	//Checamos si existio un error:
	if(jsonRespuesta.error){
		mostrarError(jsonRespuesta.error);
		return;
	}
	if(jsonRespuesta.result == 1){
		//Si se borro
		mostrarVentanaModal("Paquete Borrado <br />(Recuerde: Este borrado no se puede deshacer).");
		
	}else{
		//No se borro
		mostrarVentanaModal("El Paquete NO pudo ser borrado.");
	}
	mostrarListado();
}//fin function exitoBorradoPais

/**
 * Funcion para mostrar la pantalla de listado de Paquetes
 * @returns {void}
 */
function mostrarListado()
{
	$('#tabsMenu a[href="#divTabListarPaquete"]').tab('show');
	listarPaquete();
}//fin function mostrarListado

/**
 * Función para mostrar la pantalla de Busquedas
 * @returns {void}
 */
function mostrarBusqueda()
{
	$('#tabsMenu a[href="#divTabBuscarPaquete"]').tab('show');
}//fin function mostrarBusqueda

/**
 * Funcion para buscar los Paquete mediante AJAX
 * @returns {void}
 */
function buscarPaquete()
{
	columnaBusqueda = $("select#selectColumna").val();
	criterioBusqueda = $("input#inputCriterio").val();
	accion = 'buscar';
	peticionJSON = JSON.stringify(
			{
				"Id": generarID(),
				"method":"buscar",
				"clase": CLASE_PAQUETE,
				"Params": [criterioBusqueda, columnaBusqueda, '2']
			});
	$.post(GATEWAY_PAQUETE, peticionJSON, exitoListarPaquete);
	$('#tabsMenu a[href="#divTabListarPaquete"]').tab('show');
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
				"clase":CLASE_PAQUETE,
				"Params":[accion, criterioBusqueda, columnaBusqueda]
			});
	$.post(GATEWAY_PAQUETE, peticionJSON, exitoCrearPDF);
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