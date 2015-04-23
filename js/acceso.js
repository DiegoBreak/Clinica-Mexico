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
 * Variable publica para guardar el numbre de usuario que desea ingresar
 * @var {String}
 */
var usuario = null;
/**
 * Variable publica para guardar la contraseña del usuario que desea ingresar
 * @var {String}
 */
var contrasena = null;
/**
 * Variable publica para guarda el tipo de rol con el que se desea entrar al sistema
 * @var {Integer}
 */
var tipo=null;
/**
 * Variable publica para crear la peticioin JSON que se enviara al servidor.
 * @var {JSON}
 */
var peticionJSON = null;
/**
 * Variable publica que contiene el mensaje de error de la respuesta JSON recibida del servidor.
 * @var {String}
 */
var mensajeError = null;
/**
 * Variable publica que contiene el tipo de rol.
 * @var {String}
 */
var metodo=null;
/**
 * Variable publica que guarda el id del usuario que ingreso al sistema
 * @var {String}
 */
var idP=null;
/**
 * Variable publica que guarda el nombre del usuario que ingreso al sistema
 * @var {String}
 */
var nombre=null;
/**
 * Constante publica con la url del GATEWAY que recibe las peticiones al servidor
 * (Si fuera desde un APK o similar, DEBERA incluir la ruta completa...)
 * Si fuera desde windows 0 desktop, necesita cambiar el const por var, ya que windows 8 no soporta const
 * @var [String}
 */
var gatewayAccesoJS = "../zend_gateway/index.php";

/**
 * Constante publica que contiene el nombre de la Clase a invocar al servidor
 * Si fuera desde Windows 8 Desktop, necesita cambiar el const por var, ya que windows 8 no soporta const
 * @var {String}
 */
var nombreClase = 'acceso';
/**
 * Funcion para generar un ID aleatorio
 * @returns {String}
 */

function generarID()
{
	idLlamada = ('' + Math.random()).substring(2);
	return idLlamada;
}
/**
 * Funcion que valida que exitan datos en los inputs los convierte a String y les quita los espacios en blanco
 *tambien valida que el tipo de sol con el que se desea entrar
 * @returns {String}
 */

function verificarDatos()
{
	usuario = $("input#inputUsuario").val().toString().trim();
	contrasena = $("input#inputContrasena").val().toString().trim();
	tipo= $("select#rol").val().toString();
	if(usuario.length > 0 && contrasena.length > 0){ 
		if(tipo=='0')
		{
			metodo=0;
		}
		else
		{
			metodo=1;
		}

		validar();
		$("div#divAvisos").html("Enviando<br />Usuario: "+ usuario +"<br />Contraseña: " + contrasena+"  "+metodo);
		$("div#modalAvisos").modal('show');	
	}else{
		$("div#divAvisos").html("Revisa tus datos antes de enviar.");
		$("div#modalAvisos").modal('show');
	}
}
/**
 * Función para verificar el accceso y crear la sesión mediante AJAX
 * @returns {void}
 */
function validar()
{
	peticionJSON = JSON.stringify(
		{
			"Id": generarID(),
			"method":"verificarAcceso",
			"clase":nombreClase,
			"Params":[usuario, contrasena, metodo]
		});
	$.post(gatewayAccesoJS, peticionJSON, exitoValidar);
}
/**
 * Función Listener para logear mediante AJAX
 * @param {object} jsonRespuesta Objeto del tipo JSON con la respuesta recibida del Servidor
 * @returns {void}
 */
function exitoValidar(jsonRespuesta)
{
//	checamos si existio un error
	if(jsonRespuesta.error){
		$("input#inputUsuario").val('');
		$("input#inputContrasena").val('');
		mostrarError(jsonRespuesta.error);
		return;
	}
	if((jsonRespuesta.result).toString().length == 40){
//		Si se pugo logear, nos vamos al menu
		if(metodo==0)
		{
			document.location="menu.html";	
		}
		else
		{
			document.location="expediente.html";	
		}
		
		return;
	}else{
//		No recibimos lo que esperabamos...
		$("div#divAvisos").html("La respuesta no es de confianza.");
		$('div#modalAvisos').modal('show');
	}
}
/**
 * Funcion para recibir el dostos de usuario mediante AJAX
 * @param {int} el tipo de rol con el que se ingreso
 * @returns {void}
 */
function datos(num)
{
	tipo=num;
	peticionJSON = JSON.stringify(
		{
			"Id": generarID(),
			"method":"recogerDatos",
			"clase":nombreClase,
			"Params":[tipo]
		});
	$.post(gatewayAccesoJS, peticionJSON, recogerDatos);
}

/**
 * Funcion para obtener el nombre del usuario
 * @param {object} jsonRespuesta Objeto del tipo JSON con la respuesta recibida del Servidor
 * @returns {void}
 */
function recogerDatos(jsonRespuesta)
{
	if(jsonRespuesta.error)
	{
		mostrarError(jsonRespuesta.error);
		return;
	}
	var jsonDato = jsonRespuesta.result;

	if(tipo==1)
	{
		idP=jsonDato[0].Id_Doctor;
		nombre=jsonDato[0].Nombre+' '+jsonDato[0].Apellidop+' ' +jsonDato[0].Apellidom;

		var htmlNuevo = 'Dr. <strong>'+nombre+'</strong>';

	}
	else if(tipo==0)
	{
		idP=jsonDato[0].Id_Administrador;
		nombre=jsonDato[0].Nombre;

		var htmlNuevo = 'Administrador <strong>'+nombre+'</strong>';

	}
	
	$("p#dato").html( sanitizarHTML(htmlNuevo) );
}


/**
 * Funcion para terminar la sesion del usuario
 * @returns {void}
 */
function cerrarSesion()
{
	peticionJSON = JSON.stringify(
		{
			"Id": generarID(),
			"method":"terminarSesion",
			"clase":nombreClase
		});
	$.post(gatewayAccesoJS, peticionJSON, exitoCerrarSesion);
}

function exitoCerrarSesion(jsonRespuesta)
{
//	Checamos si existio un error
	if(jsonRespuesta.error)
	{
		
		mostrarError(jsonRespuesta.error);
		return;
	}
	document.location = "login.html";
}
/**
 * Funcion para mostrar el error si lo hubo
 * @returns {void}
 */
function mostrarError(elError)
{
	switch(elError.code){
		case -32000:
			mensajeError = elError.message;
			break;
		case -32600:
			mensajeError = "Petici�n invalida.";
			break;
		case -32601:
			mensajeError = "El metodo no se encontro.";
			break;
		case -32602:
			mensajeError = "Parametros invalidos.";
			break;
		case -32603:
			mensajeError = "Error Interno."
			break;
		case -32700:
			mensajeError = "Error de sintaxis.";
			break;
		default:
			mensajeError = "Error " + elError.code + ":<br />" + elError.message;
			break;
		}
		$("div#divAvisos").html(mensajeError);
		$("div#modalAvisos").modal('show');
	}