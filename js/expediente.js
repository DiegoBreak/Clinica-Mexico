
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
var jsonExpediente = null;

/**
 * Variable publica que contiene el mensaje de error de la respuesta JSON recibida del servidor.
 * @var {String}
 */
var mensajeErExpediente = null;
/**
 * Variable publica que contiene un Objeto para enviar al servidor
 * @var {Object}
 */
var objetoExpediente = null;

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

const GATEWAY_EXPEDIENTES = "../zend_gateway/index.php";

/**
 * Constante publica que contiene el nombre de la Clase a invocar al servidor
 * Si fuera desde Windows 8 Desktop, necesita cambiar el const por var, ya que windows 8 no soporta const
 * @var {String}
 */
const CLASE_EXPEDIENTES='Expediente';

/**
 * Crear chismoso para el tbody:
 */
$('tbody#tbodyExpediente').bind('click', function(event)
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
 * Función para listar los Expedientes mediante AJAX
 * @returns {void}
 */

function listarExpediente()
{
	peticionJSON = JSON.stringify(
			{
				"Id": generarID(),
				"method":"listar",
				"clase":CLASE_EXPEDIENTES,
				"Params":['2']
			});
	accion = "listar";
	$.post(GATEWAY_EXPEDIENTES, peticionJSON, exitoListarExpediente);
}//fin funtcion listarExpedientes

/**
 * Función Listener para listar los Expedientes mediante AJAX
 * @param {object} jsonRespuesta Objeto del tipo JSON con la respuesta recibida del Servidor
 * @returns {void}
 */
function exitoListarExpediente(jsonRespuesta)
{
	//Checamos si existio un error:
	if(jsonRespuesta.error){
		mostrarError(jsonRespuesta.error);
		return;
	}
	var indice = 0;
	jsonExpediente = jsonRespuesta.result;
	$("tbody#tbodyExpediente> tr").remove();
	if(jsonExpediente.length > 0){
		htmlNuevo = '';
		for(indice=0; indice<jsonExpediente.length; indice++){
			objetoExpediente = jsonExpediente[indice];
			idExp= Number(objetoExpediente.Id_Expediente);
			idCita = Number(objetoExpediente.Id_Cita);
			paciente= String(objetoExpediente.nombrep);
			doctor= String(objetoExpediente.nombred);
			diagnostico = String(objetoExpediente.Diagnostico);
			fecha = String(objetoExpediente.Fecha);
			htmlNuevo += "<tr>";
			htmlNuevo += "<td>";
			htmlNuevo += "<button id='button_editar_"+ indice +"' type='button' class='btn btn-sm btn-warning'><span class='glyphicon glyphicon-pencil'></span></button>";
			htmlNuevo +="&nbsp;";
			htmlNuevo += "<button id='button_borrar_"+ indice +"' type='button' class='btn btn-sm btn-danger'><span class='glyphicon glyphicon-trash'></span></button>";
			htmlNuevo +="&nbsp;";
			htmlNuevo += "<button id='button_ver_"+ indice +"' type='button' class='btn btn-sm btn-success'><span class='glyphicon glyphicon-eye-open'></span></button>";
						htmlNuevo += "</td>";
				htmlNuevo += "<td>" + idExp + "</td>";
				htmlNuevo += "<td>"+ idCita + "</td>";
				htmlNuevo += "<td>"+ paciente + "</td>";
				htmlNuevo += "<td>"+ doctor + "</td>";
				htmlNuevo += "<td>"+ diagnostico + "</td>";
				htmlNuevo += "<td>"+ fecha + "</td>";
			htmlNuevo += "</tr>";
		}
		$("tbody#tbodyExpediente").append( sanitizarHTML(htmlNuevo));
	}else{
		mostrarVentanaModal('No hay Expediente');
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
}//fin function exitoListarExpedientes

/**
 * Funcion para mostrar el Expedientes escogido de la lista
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
		editarExpediente(queRegistro);
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
*Funcion que manda los parametros para la consulta del combo
*
*/
function comboCita()
{
	peticionJSON=JSON.stringify(
	{
		"Id":generarID(),
		"method":"comboCita",
		"clase":CLASE_EXPEDIENTES,
		"Params":['2']
	});
	$.post(GATEWAY_EXPEDIENTES, peticionJSON, exitoLlamarComboCita);
}
function comboCita2()
{
	peticionJSON=JSON.stringify(
	{
		"Id":generarID(),
		"method":"comboCita2",
		"clase":CLASE_EXPEDIENTES,
		"Params":['2']
	});
	$.post(GATEWAY_EXPEDIENTES, peticionJSON, exitoLlamarComboCita);
}

/**
 * Funcion para listar los Expedientes mediante AJAX y llenar un combo de los datos.
 * @param onject jsonRespuesta Objeto del tipo JSON con la respuesta recibida del Servidor
 * @return {void}
 */
function exitoLlamarComboCita(jsonRespuesta)
{
//	checamos sis existio un error
	if(jsonRespuesta.error)
	{
		mostrarError(jsonRespuesta.error);
		return;
	}
	var indice=0;
	jsonExpediente=jsonRespuesta.result;
	$("select#idCita>option").remove();
	if(jsonExpediente.length>0)
	{
		for(indice=0;indice<jsonExpediente.length;indice++)
		{
			objetoExpediente=jsonExpediente[indice];
			$("select#idCita").append("<option value='"+ objetoExpediente.dataa +"'>Cita "+ objetoExpediente.dataa+"    "+ objetoExpediente.nom+" "+ objetoExpediente.app+" "+objetoExpediente.apm+"("+objetoExpediente.idp+")</option>");
		}

	}
	else
	{
		$("select#idCita").append("<option value='X'>No hay Citas para hoy</option>");
	}
	if(recuperado)
	{
		$("select#idCita").val(jsonExpediente[cuentaEscogido].dataa).attr('selected','selected');

	}
}


/**
 * Funcion para mostar el Expedientes escogido de la lista
 * @param {list} indiceEscogido El indice escogido de la lista de los Expedientes
 * @returns {void}
 */
function editarExpediente(indiceEscogido)
{
	recuperado=true;
	cuentaEscogido=jsonExpediente[indiceEscogido].Id_Cita-1;
	$('#tabsMenu a[href="#divTabFormularioExpediente"]').tab('show');
	$("input#idExpe").val(jsonExpediente[indiceEscogido].Id_Expediente);
	$("textarea#diagnostico").val(jsonExpediente[indiceEscogido].Diagnostico);
	$("textarea#receta").val(jsonExpediente[indiceEscogido].Receta);
	$("textarea#indicaciones").val(jsonExpediente[indiceEscogido].Indicaciones);
	comboCita2();
	$("h1#h1TituloFormulario").html( sanitizarHTML('Editar Consulta') );
}//fin function editarMedicamento

/**
 * Funcion para mostrar el formulario del nuevo Expedientes
 * @returns {void}
 */
function agregarExpediente()
{
	recuperado=false;
	$('#tabsMenu a[href="#divTabFormularioExpediente"]').tab('show');
	$("input#idExpe").val(0);
	$("textarea#diagnostico").val('');
	$("textarea#receta").val('');
	$("textarea#indicaciones").val('');
	$("input#fecha").val('');
	$("h1#h1TituloFormulario").html( sanitizarHTML('Nueva Consulta') );
	comboCita();
}//fin function agregar

/**
 * Funcion para guardar 
 */
function guardarExpediente()
{
	var idExp=$("input#idExpe").val();
	var idCita=$("select#idCita").val();
	var diagnostico=$("textarea#diagnostico").val();
	var receta=$("textarea#receta").val();
	var indicaciones=$("textarea#indicaciones").val();
	var fecha=$("input#fecha").val();
	
	objetoExpediente = {Id_Expediente:idExp,Id_Cita:idCita,Diagnostico:diagnostico, Receta:receta, Indicaciones:indicaciones, Fecha:fecha};
	if(idExp == 0){
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
				"clase": CLASE_EXPEDIENTES,
				"Params":[objetoExpediente]
			});
	$.post(GATEWAY_EXPEDIENTES, peticionJSON, exitoGuardadoExpediente);
}//fin function guardar

/**
 * Función Listener para guardar el medicamento mediante AJAX
 * @param {object} jsonRespuesta Objeto del tipo JSON con la respuesta recibida del Servidor
 * @returns {void}
 */
function exitoGuardadoExpediente(jsonRespuesta)
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
			 mostrarVentanaModal(" Insertado con el ID " + jsonRespuesta.result);
		 }
		 else{
			 //no se inserto:
			 mostrarVentanaModal("No se pudo insertar la Consulta");

		 }//else
	break;
	case "actualizar":
		if(jsonRespuesta.result == 1){
			//Si se actualizo:
			mostrarVentanaModal("Consulta Actualizado");
		}else{
			//No se actualizo:
			mostrarVentanaModal("No se pudo actualizar la Consulta");
		}
	break;
	default:
		//No se que paso:
		mostrarVentanaModal("Tipo de respuesta no definido");
	break;
	}//switch
	mostrarListado();
}//fin function exitoGuardado8

/**
*Funcion que arma la informacion que se va a mostrar con el boton ver
*@param {int} indiceEscogido indice escogido del array del expediente
* @returns {void}
*
*/
function verInfo(indiceEscogido)
{
	var idExp=jsonExpediente[indiceEscogido].Id_Expediente;
	var nombred=jsonExpediente[indiceEscogido].nombred;
	var receta=jsonExpediente[indiceEscogido].Receta;
	var indicaciones=jsonExpediente[indiceEscogido].Indicaciones;
	var diagnostico=jsonExpediente[indiceEscogido].Diagnostico;
	var idCita=jsonExpediente[indiceEscogido].Id_Cita;
	var nombrep=jsonExpediente[indiceEscogido].nombrep;
	var fecha=cfecha(jsonExpediente[indiceEscogido].Fecha);

	mostrarVentanaModal2('Expediente : <strong>'+ idExp + '</strong><br />	Cita: <strong>'+idCita+'</strong><br/>consulta realizada el : <strong>'+fecha+'</strong><br/>Paciente : <strong>'+nombrep+'</strong><br/>Atendio: <strong> <small>Dr. </small>'+nombred+'</strong><br/>Diagnostico : <strong>'+diagnostico+'</strong><br/>Medicamento recetado : <strong>'+receta+'</strong><br/>Indicaciones : <strong>'+indicaciones+'</strong><br/>');
}
//fin function ver Info


/**
 * Funcion para solicitar confirmar el borrado del Expedientes
 * @param {int} indiceEscogido indice escogido del array de Expedientes
 * @returns {void}
 */
function confirmarBorrado(indiceEscogido)
{
	$('#tabsMenu a[href="#divTabBorrarExpediente"]').tab('show');
	var idExp=jsonExpediente[indiceEscogido].Id_Expediente;
	var idCita=jsonExpediente[indiceEscogido].Id_Cita;
	var nombrep=jsonExpediente[indiceEscogido].nombrep;
	var fecha=jsonExpediente[indiceEscogido].Fecha;


	htmlNuevo = 'Expediente: <strong>'+ idExp + '</strong><br />Paciente: <strong>'+nombrep+'</strong><br />Fecha: <strong>'+fecha+'</strong>';
	objetoCita = {Id_Cita:idCita };
	$("p#pExpediente").html( sanitizarHTML(htmlNuevo) );
}
//fin function confirmarBorrado

/**
 * Funcion para borrar el Expedientes mediante AJAX
 * @returns {void}
 */
function borrarExpediente()
{
	peticionJSON = JSON.stringify(
			{
				"Id": generarID(),
				"method":"borrar",
				"clase": CLASE_EXPEDIENTES,
				"Params": [objetoExpediente]
			});
	$.post(GATEWAY_EXPEDIENTES, peticionJSON, exitoBorradoExpediente);
}//fin function borrarExpedientes

/**
 * Funcion Listener para borrar el Expedientes mediante AJAX
 * @param {object} jsonRespuesta Objeto del tipo JSON con la respuesta recibida del Servidor
 * @returns {void}
 */
function exitoBorradoExpediente(jsonRespuesta)
{
	//Checamos si existio un error:
	if(jsonRespuesta.error){
		mostrarError(jsonRespuesta.error);
		return;
	}
	if(jsonRespuesta.result == 1){
		//Si se borro
		mostrarVentanaModal("Consulta Borrada <br />(Recuerde: Este borrado no se puede deshacer).");
		
	}else{
		//No se borro
		mostrarVentanaModal("La Consulta NO pudo ser borrada.");
	}
	mostrarListado();
}//fin function exitoBorradoExpedientes

/**
 * Funcion para mostrar la pantalla de listado de Expedientes
 * @returns {void}
 */
function mostrarListado()
{
	$('#tabsMenu a[href="#divTabListarExpediente"]').tab('show');
	listarExpediente();
}//fin function mostrarListado

/**
 * Función para mostrar la pantalla de Busquedas
 * @returns {void}
 */
function mostrarBusqueda()
{
	$('#tabsMenu a[href="#divTabBuscarExpediente"]').tab('show');
}//fin function mostrarBusqueda

/**
 * Funcion para buscar los Expedientes mediante AJAX
 * @returns {void}
 */
function buscarExpediente()
{
	columnaBusqueda = $("select#selectColumna").val();
	criterioBusqueda = $("input#inputCriterio").val();
	accion = 'buscar';
	peticionJSON = JSON.stringify(
			{
				"Id": generarID(),
				"method":"buscar",
				"clase": CLASE_EXPEDIENTES,
				"Params": [criterioBusqueda, columnaBusqueda, '2']
			});
	$.post(GATEWAY_EXPEDIENTES, peticionJSON, exitoListarExpediente);
	$('#tabsMenu a[href="#divTabListarExpediente"]').tab('show');
}//fin function buscarExpedientes

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
				"clase":CLASE_EXPEDIENTES,
				"Params":[accion, criterioBusqueda, columnaBusqueda]
			});
	$.post(GATEWAY_EXPEDIENTES, peticionJSON, exitoCrearPDF);
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
function cfecha(fecha)
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