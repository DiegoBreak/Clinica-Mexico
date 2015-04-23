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
var jsonMedicamentos = null;

/**
 * Variable publica que contiene el mensaje de error de la respuesta JSON recibida del servidor.
 * @var {String}
 */
var mensajeError = null;

/**
 * Variable publica que contiene un Objeto para enviar al servidor
 * @var {Object}
 */
var objetoMedicamento = null;

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
const GATEWAY_MEDICAMENTOS = "../zend_gateway/index.php";

/**
 * Constante publica que contiene el nombre de la Clase a invocar al servidor
 * Si fuera desde Windows 8 Desktop, necesita cambiar el const por var, ya que windows 8 no soporta const
 * @var {String}
 */
const CLASE_MEDICAMENTOS='Medicamentos';

/**
 * Crear chismoso para el tbody:
 */
$('tbody#tbodyMedicamentos').bind('click', function(event)
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
 * Función para listar los Medicamentos mediante AJAX
 * @returns {void}
 */

function listarMedicamentos()
{
	peticionJSON = JSON.stringify(
			{
				"Id": generarID(),
				"method":"listar",
				"clase":CLASE_MEDICAMENTOS,
				"Params":['2']
			});
	accion = "listar";
	$.post(GATEWAY_MEDICAMENTOS, peticionJSON, exitoListarMedicamentos);
}//fin funtcion listarMedicamentos

/**
 * Función Listener para listar los Medicamentos mediante AJAX
 * @param {object} jsonRespuesta Objeto del tipo JSON con la respuesta recibida del Servidor
 * @returns {void}
 */
function exitoListarMedicamentos(jsonRespuesta)
{
	//Checamos si existio un error:
	if(jsonRespuesta.error){
		mostrarError(jsonRespuesta.error);
		return;
	}
	var indice = 0;
	jsonMedicamentos = jsonRespuesta.result;
	$("tbody#tbodyMedicamentos > tr").remove();
	if(jsonMedicamentos.length > 0){
		htmlNuevo = '';
		for(indice=0; indice<jsonMedicamentos.length; indice++){
			objetoMedicamento = jsonMedicamentos[indice];
			idMedicamento = Number(objetoMedicamento.Id_Medicamento);
			nombreRegitrado = String(objetoMedicamento.Nomreg);
			nombreCientifico = String(objetoMedicamento.Nomcien);
			formaMedicamento = String(objetoMedicamento.Forma);
			formulaMedicamento = String(objetoMedicamento.Formula);
			dosisMedicamento = Number(objetoMedicamento.Dosis);
			htmlNuevo += "<tr>";
			htmlNuevo += "<td>";
			htmlNuevo += "<button id='button_editar_"+ indice +"' type='button' class='btn btn-sm btn-warning'><span class='glyphicon glyphicon-pencil'></span></button>";
			htmlNuevo +="&nbsp;";
			htmlNuevo += "<button id='button_borrar_"+ indice +"' type='button' class='btn btn-sm btn-danger'><span class='glyphicon glyphicon-trash'></span></button>";
			htmlNuevo +="&nbsp;";
			htmlNuevo += "<button id='button_ver_"+ indice +"' type='button' class='btn btn-sm btn-success'><span class='glyphicon glyphicon-eye-open'></span></button>";
			htmlNuevo += "</td>";
			
				htmlNuevo += "<td>" + idMedicamento + "</td>";
				htmlNuevo += "<td>"+ nombreRegitrado + "</td>";
				htmlNuevo += "<td>"+ nombreCientifico + "</td>";
				htmlNuevo += "<td>"+ formaMedicamento + "</td>";
				htmlNuevo += "<td>"+ dosisMedicamento + "<small> MG</small></td>";
			htmlNuevo += "</tr>";
		}
		$("tbody#tbodyMedicamentos").append( sanitizarHTML(htmlNuevo));
	}else{
		mostrarVentanaModal('No hay medicamentos');
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
}//fin function exitoListarMedicamentos

/**
 * Funcion para mostrar eescogido de la lista
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
		editarMedicamento(queRegistro);
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
 * Funcion para mostar eescogido de la lista
 * @param {list} indiceEscogido El indice escogido de la lista de los Medicamentos
 * @returns {void}
 */
function editarMedicamento(indiceEscogido)
{
	$('#tabsMenu a[href="#divTabFormularioMedicamento"]').tab('show');
	$("input#idMedicamento").val(jsonMedicamentos[indiceEscogido].Id_Medicamento);
	$("input#nombrer").val(jsonMedicamentos[indiceEscogido].Nomreg);
	$("input#nombrec").val(jsonMedicamentos[indiceEscogido].Nomcien);
	$("select#selectForma").val(jsonMedicamentos[indiceEscogido].Forma);
	$("textarea#formula").val(jsonMedicamentos[indiceEscogido].Formula);
	$("input#dosis").val(jsonMedicamentos[indiceEscogido].Dosis);
	$("h1#h1TituloFormulario").html( sanitizarHTML('Editar Medicamento') );
}//fin function editarMedicamento

/**
 * Funcion para mostrar el formulario del nuev * @returns {void}
 */
function agregarMedicamento()
{
	$('#tabsMenu a[href="#divTabFormularioMedicamento"]').tab('show');
	$("input#idMedicamento").val(0);
	$("input#nombrer").val('');
	$("input#nombrec").val('');
	$("select#selectForma").val('');
	$("textarea#formula").val('');
	$("input#dosis").val(0);
	$("h1#h1TituloFormulario").html( sanitizarHTML('Nuevo Medicamento') );
}//fin function agregarPais

/**
 * Funcion para guardar el pais
 */
function guardarMedicamento()
{
	var idMed=$("input#idMedicamento").val();
	var nombreC=$("input#nombrec").val();
	var nombreR=$("input#nombrer").val();
	var formaM=$("select#selectForma").val();
	var formulaM=$("textarea#formula").val();
	var dosisM=$("input#dosis").val();
	
	objetoMedicamento = { Id_Medicamento:idMed, Nomcien:nombreC, Nomreg:nombreR, Forma:formaM, Formula:formulaM, Dosis:dosisM};
	if(idMed == 0){
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
				"clase": CLASE_MEDICAMENTOS,
				"Params":[objetoMedicamento]
			});
	$.post(GATEWAY_MEDICAMENTOS, peticionJSON, exitoGuardadoMedicamento);
}//fin function guardarPais

/**
 * Función Listener para guardar el medicamento mediante AJAX
 * @param {object} jsonRespuesta Objeto del tipo JSON con la respuesta recibida del Servidor
 * @returns {void}
 */
function exitoGuardadoMedicamento(jsonRespuesta)
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
			 mostrarVentanaModal("Medicamento Insertado con el ID " + jsonRespuesta.result);
		 }else{
			 //no se inserto:
			 mostrarVenatanaModal("No se pudo insertar el Medicamento");
		 }//else
	break;
	case "actualizar":
		if(jsonRespuesta.result == 1){
			//Si se actualizo:
			mostrarVentanaModal("Medicamento Actualizado");
		}else{
			//No se actualizo:
			mostrarVentanaModal("No se pudo actualizar el Medicamento");
		}
	break;
	default:
		//No se que paso:
		mostrarVentanaModal("Tipo de respuesta no definido");
	break;
	}//switch
	mostrarListado();
}//fin function exitoGuardadoPais


/**
*Funcion que arma la informacion que se va a mostrar con el boton ver
*@param {int} indiceEscogido indice escogido del array de medicamentos
* @returns {void}
*
*/
function verInfo(indiceEscogido)
{
	var idMed=jsonMedicamentos[indiceEscogido].Id_Medicamento;
	var nombreC=jsonMedicamentos[indiceEscogido].Nomcien;
	var nombreR=jsonMedicamentos[indiceEscogido].Nomreg
	var formaM=jsonMedicamentos[indiceEscogido].Forma;
	var formulaM=jsonMedicamentos[indiceEscogido].Formula;
	var dosisM=jsonMedicamentos[indiceEscogido].Dosis;
	
	mostrarVentanaModal2('ID medicamento: <strong>'+ idMed + '</strong><br />Nombre: <strong>'+nombreR+'</strong><br/>Nombre Cientifico: <strong>'+nombreC+'</strong><br/>Forma: <strong>'+formaM+'</strong><br/>Dosis: <strong>'+dosisM+'<small> MG.</small></strong><br/>Descripción: <strong>'+formulaM+'</strong>');
}
//fin function ver Info



/**
 * Funcion para solicitar confirmar el borrado del pais
 * @param {int} indiceEscogido indice escogido del array de Medicamentos
 * @returns {void}
 */
function confirmarBorrado(indiceEscogido)
{
	$('#tabsMenu a[href="#divTabBorrarMedicamento"]').tab('show');
	var idMed=jsonMedicamentos[indiceEscogido].Id_Medicamento;
	var nombreC=jsonMedicamentos[indiceEscogido].Nomcien;
	var nombreR=jsonMedicamentos[indiceEscogido].Nomreg
	var formaM=jsonMedicamentos[indiceEscogido].Forma;
	var formulaM=jsonMedicamentos[indiceEscogido].Formula;
	var dosisM=jsonMedicamentos[indiceEscogido].Dosis;
	htmlNuevo = 'ID: <strong>'+ idMed + '</strong><br />Nombre: <strong>'+nombreR+'</strong><br />Dosis <strong>'+dosisM+' <small>MG.</small></strong>';
	objetoMedicamento = {Id_Medicamento:idMed };
	$("p#pDatosMedicamento").html( sanitizarHTML(htmlNuevo) );
}
//fin function confirmarBorrado

/**
 * Funcion para borrar el pais mediante AJAX
 * @returns {void}
 */
function borrarMedicamento()
{
	peticionJSON = JSON.stringify(
			{
				"Id": generarID(),
				"method":"borrar",
				"clase": CLASE_MEDICAMENTOS,
				"Params": [objetoMedicamento]
			});
	$.post(GATEWAY_MEDICAMENTOS, peticionJSON, exitoBorradoMedicamento);
}//fin function borrarPais

/**
 * Funcion Listener para borrar el pais mediante AJAX
 * @param {object} jsonRespuesta Objeto del tipo JSON con la respuesta recibida del Servidor
 * @returns {void}
 */
function exitoBorradoMedicamento(jsonRespuesta)
{
	//Checamos si existio un error:
	if(jsonRespuesta.error){
		mostrarError(jsonRespuesta.error);
		return;
	}
	if(jsonRespuesta.result == 1){
		//Si se borro
		mostrarVentanaModal("Medicamento Borrado <br />(Recuerde: Este borrado no se puede deshacer).");
		
	}else{
		//No se borro
		mostrarVentanaModal("El Medicamento NO pudo ser borrado.");
	}
	mostrarListado();
}//fin function exitoBorradoPais

/**
 * Funcion para mostrar la pantalla de listado de Medicamentos
 * @returns {void}
 */
function mostrarListado()
{
	$('#tabsMenu a[href="#divTabListarMedicamento"]').tab('show');
	listarMedicamentos();
}//fin function mostrarListado

/**
 * Función para mostrar la pantalla de Busquedas
 * @returns {void}
 */
function mostrarBusqueda()
{
	$('#tabsMenu a[href="#divTabBuscarMedicamento"]').tab('show');
}//fin function mostrarBusqueda

/**
 * Funcion para buscar los Medicamentos mediante AJAX
 * @returns {void}
 */
function buscarMedicamento()
{
	columnaBusqueda = $("select#selectColumna").val();
	criterioBusqueda = $("input#inputCriterio").val();
	accion = 'buscar';
	peticionJSON = JSON.stringify(
			{
				"Id": generarID(),
				"method":"buscar",
				"clase": CLASE_MEDICAMENTOS,
				"Params": [criterioBusqueda, columnaBusqueda, '2']
			});
	$.post(GATEWAY_MEDICAMENTOS, peticionJSON, exitoListarMedicamentos);
	$('#tabsMenu a[href="#divTabListarMedicamento"]').tab('show');
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
				"clase":CLASE_MEDICAMENTOS,
				"Params":[accion, criterioBusqueda, columnaBusqueda]
			});
	$.post(GATEWAY_MEDICAMENTOS, peticionJSON, exitoCrearPDF);
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