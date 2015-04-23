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
var jsonMembresias = null;

/**
 * Variable publica que contiene el mensaje de error de la respuesta JSON recibida del servidor.
 * @var {String}
 */
var mensajeError = null;

/**
 * Variable publica que contiene un Objeto para enviar al servidor
 * @var {Object}
 */
var objetoMembresia = null;

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
const GATEWAY_MEMBRESIAS = "../zend_gateway/index.php";

/**
 * Constante publica que contiene el nombre de la Clase a invocar al servidor
 * Si fuera desde Windows 8 Desktop, necesita cambiar el const por var, ya que windows 8 no soporta const
 * @var {String}
 */
const CLASE_MEMBRESIAS='Membresias';

/**
 * Crear chismoso para el tbody:
 */
$('tbody#tbodyMembresias').bind('click', function(event)
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
 * Función para listar los Membresias mediante AJAX
 * @returns {void}
 */

function listarMembresias()
{
	peticionJSON = JSON.stringify(
			{
				"Id": generarID(),
				"method":"listar",
				"clase":CLASE_MEMBRESIAS,
				"Params":['2']
			});
	accion = "listar";
	$.post(GATEWAY_MEMBRESIAS, peticionJSON, exitoListarMembresias);
}//fin funtcion listarMembresias

/**
 * Función Listener para listar los Membresias mediante AJAX
 * @param {object} jsonRespuesta Objeto del tipo JSON con la respuesta recibida del Servidor
 * @returns {void}
 */
function exitoListarMembresias(jsonRespuesta)
{
	//Checamos si existio un error:
	if(jsonRespuesta.error){
		mostrarError(jsonRespuesta.error);
		return;
	}
	var indice = 0;
	jsonMembresias = jsonRespuesta.result;
	$("tbody#tbodyMembresias > tr").remove();
	if(jsonMembresias.length > 0){
		htmlNuevo = '';
		for(indice=0; indice<jsonMembresias.length; indice++){
			objetoMembresia = jsonMembresias[indice];
			Id_Membresia = Number(objetoMembresia.Id_Membresia);
			personas = String(objetoMembresia.Personas);
			descripcion = String(objetoMembresia.Descripcion);
			precio = Number(objetoMembresia.Precio);
			
			htmlNuevo += "<tr>";
			htmlNuevo += "<td>";
			htmlNuevo += "<button id='button_editar_"+ indice +"' type='button' class='btn btn-sm btn-warning'><span class='glyphicon glyphicon-pencil'></span></button>";
			htmlNuevo +="&nbsp;";
			htmlNuevo += "<button id='button_borrar_"+ indice +"' type='button' class='btn btn-sm btn-danger'><span class='glyphicon glyphicon-trash'></span></button>";
			htmlNuevo += "</td>";
				htmlNuevo += "<td>" + Id_Membresia + "</td>";
				htmlNuevo += "<td>"+ personas + "</td>";
				htmlNuevo += "<td>"+ descripcion + "</td>";
				htmlNuevo += "<td>"+ precio + "</td>";
			htmlNuevo += "</tr>";
		}
		$("tbody#tbodyMembresias").append( sanitizarHTML(htmlNuevo));
	}else{
		mostrarVentanaModal('No hay Membresias');
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
}//fin function exitoListarMembresias

/**
 * Funcion para mostrar el Membresia escogido de la lista
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
		editarMembresias(queRegistro);
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
 * Funcion para mostar la Membresia escogido de la lista
 * @param {list} indiceEscogido El indice escogido de la lista de los Membresias
 * @returns {void}
 */
function editarMembresias(indiceEscogido)
{
	$('#tabsMenu a[href="#divTabFormularioMembresia"]').tab('show');
	$("input#clavem").val(jsonMembresias[indiceEscogido].Id_Membresia);
	$("input#personas").val(jsonMembresias[indiceEscogido].Personas);
	$("input#descripcion").val(jsonMembresias[indiceEscogido].Descripcion);
	$("input#precio").val(jsonMembresias[indiceEscogido].Precio);
	$("h1#h1TituloFormulario").html( sanitizarHTML('Editar Membresia') );
}//fin function editar

/**
 * Funcion para mostrar el formulario de la nuevo Membresia
 * @returns {void}
 */
function agregarMembresia()
{
	$('#tabsMenu a[href="#divTabFormularioMembresia"]').tab('show');
	$("input#clavem").val(0);
	$("input#personas").val('');
	$("input#descripcion").val('');
	$("input#precio").val('');
	$("h1#h1TituloFormulario").html( sanitizarHTML('Nueva Membresia') );
}//fin function

/**
 * Funcion para guardar el Membresia
 */
function guardarMembresia()
{
	var clavem=$("input#clavem").val();
	var personasm=$("input#personas").val();
	var descripcionm=$("input#descripcion").val();
	var preciom=$("input#precio").val();
	
	objetoMembresia = { Id_Membresia:clavem, Personas:personasm, Descripcion:descripcionm, Precio:preciom};
	if(clavem== 0){
		//insertar 
		accion = "insertar";
	}else{
		//Actualizar 
		accion = "actualizar";
	}
	peticionJSON = JSON.stringify(
			{
				"Id": generarID(),
				"method":accion,
				"clase": CLASE_MEMBRESIAS,
				"Params":[objetoMembresia]
			});
	$.post(GATEWAY_MEMBRESIAS, peticionJSON, exitoGuardadoMembresias);
}//fin function guardar

/**
 * Función Listener para guardar el medicamento mediante AJAX
 * @param {object} jsonRespuesta Objeto del tipo JSON con la respuesta recibida del Servidor
 * @returns {void}
 */
function exitoGuardadoMembresias(jsonRespuesta)
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
			 mostrarVentanaModal("Membresia Insertado con la Id_Membresia " + jsonRespuesta.result);
		 }else{
			 //no se inserto:
			 mostrarVenatanaModal("No se pudo insertar la Membresia");
		 }//else
	break;
	case "actualizar":
		if(jsonRespuesta.result == 1){
			//Si se actualizo:
			mostrarVentanaModal("Membresia Actualizada");
		}else{
			//No se actualizo:
			mostrarVentanaModal("No se pudo actualizar la Membresia");
		}
	break;
	default:
		//No se que paso:
		mostrarVentanaModal("Tipo de respuesta no definido");
	break;
	}//switch
	mostrarListado();
}//fin function exitoGuardadoMembresia

/**
 * Funcion para solicitar confirmar el borrado del Membresia
 * @param {int} indiceEscogido indice escogido del array de Membresias
 * @returns {void}
 */
function confirmarBorrado(indiceEscogido)
{
	$('#tabsMenu a[href="#divTabBorrarMembresia"]').tab('show');
	var clavem=jsonMembresias[indiceEscogido].Id_Membresia;
	var personasm=jsonMembresias[indiceEscogido].Personas;
	var descripcionm=jsonMembresias[indiceEscogido].Descripcion;
	var preciom=jsonMembresias[indiceEscogido].Precio;
	htmlNuevo = 'Id Membresia: <strong>'+ clavem + '</strong><br />Descripción: <strong>'+descripcion+'</strong><br />Precio: <strong>$'+precio+'</strong>';
	objetoMembresia = {Id_Membresia:clavem };
	$("p#pDatosMembresia").html( sanitizarHTML(htmlNuevo) );
}
//fin function confirmarBorrado

/**
 * Funcion para borrar el Membresia mediante AJAX
 * @returns {void}
 */
function borrarMembresia()
{
	peticionJSON = JSON.stringify(
			{
				"Id": generarID(),
				"method":"borrar",
				"clase": CLASE_MEMBRESIAS,
				"Params": [objetoMembresia]
			});
	$.post(GATEWAY_MEMBRESIAS, peticionJSON, exitoBorradoMembresia);
}//fin function borrarPais

/**
 * Funcion Listener para borrar el pais mediante AJAX
 * @param {object} jsonRespuesta Objeto del tipo JSON con la respuesta recibida del Servidor
 * @returns {void}
 */
function exitoBorradoMembresia(jsonRespuesta)
{
	//Checamos si existio un error:
	if(jsonRespuesta.error){
		mostrarError(jsonRespuesta.error);
		return;
	}
	if(jsonRespuesta.result == 1){
		//Si se borro
		mostrarVentanaModal("Membresia Borrada <br />(Recuerde: Este borrado no se puede deshacer).");
		
	}else{
		//No se borro
		mostrarVentanaModal("La Membresia NO pudo ser borrado.");
	}
	mostrarListado();
}//fin function exitoBorradoPais

/**
 * Funcion para mostrar la pantalla de listado de Membresias
 * @returns {void}
 */
function mostrarListado()
{
	$('#tabsMenu a[href="#divTabListarMembresia"]').tab('show');
	listarMembresias();
}//fin function mostrarListado

/**
 * Función para mostrar la pantalla de Busquedas
 * @returns {void}
 */
function mostrarBusqueda()
{
	$('#tabsMenu a[href="#divTabBuscarMembresia"]').tab('show');
}//fin function mostrarBusqueda

/**
 * Funcion para buscar los Membresias mediante AJAX
 * @returns {void}
 */
function buscarMembresia()
{
	columnaBusqueda = $("select#selectColumna").val();
	criterioBusqueda = $("input#inputCriterio").val();
	accion = 'buscar';
	peticionJSON = JSON.stringify(
			{
				"Id": generarID(),
				"method":"buscar",
				"clase": CLASE_MEMBRESIAS,
				"Params": [criterioBusqueda, columnaBusqueda, '2']
			});
	$.post(GATEWAY_MEMBRESIAS, peticionJSON, exitoListarMembresias);
	$('#tabsMenu a[href="#divTabListarMembresia"]').tab('show');
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
				"clase":CLASE_MEMBRESIAS,
				"Params":[accion, criterioBusqueda, columnaBusqueda]
			});
	$.post(GATEWAY_MEMBRESIAS, peticionJSON, exitoCrearPDF);
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