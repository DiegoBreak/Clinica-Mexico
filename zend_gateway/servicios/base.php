<?php
/**
 * Clase Base, para tener funcionalidades con la base de datos.
 * @author  Diego Giovanni Vega.
 */

abstract Class Base
{

	/**
	 * Array para los nombres de Dias completos
	 * @access public
	 * @var Array
	 */
	public $arrayDias = array('Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado');

	/**
	 * Array para los nombres de Meses completos
	 * @access public
	 * @var Array
	*/
	public $arrayMes = array('', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre');

	/**
	 * Array para los nombres de Meses cortos
	 * @access public
	 * @var Array
	*/
	public $arrayMesCorto = array('', 'ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC');

	/**
	 * Objeto de Conexion.
	 * @access protected
	 * @var Object
	*/
	protected $conexion;

	/**
	 * Apuntador de la Base.
	 * @access protected
	 * @var Object
	 */
	protected $base;

	/**
	 * Objeto con los datos a enviar a la base.
	 * @access private
	 * @var Object
	 */
	private $_elDato;

	/**
	 * Objeto con el tipo de dato a enviar a la Base.
	 * @access private
	 * @var Object
	 */
	private $_elTipo;

	/**
	 * Constructor de la clase que crea el objeto de Conexion.
	 * @access public
	 * @return void
	 */
	public function __construct()
	{
		error_reporting(E_ERROR & ~E_WARNING); //Si no muestra errores intentar con esta //error_reporting(E_ALL);
		$this->conexion = new mysqli(SERVIDOR, USUARIO, CONTRASENA, BASE);
		//$this->conexion = new mysqli("localhost", "root", "", "clinicamexico");
		if (mysqli_connect_error()) {
			if(PRODUCCION) {
				throw new Exception('Error No. C001'); // Produccion
			} else {
				throw new Exception('Error: ' . mysqli_connect_errno() . '<br />Mensaje: ' . mysqli_connect_error()); // Desarrollo
			}
			return;
		}
	}

	/**
	 * Permite formatear los datos conforme se reciben.
	 * @access protected
	 * @param object $elDato El dato a formatear.
	 * @param string $elTipo El Tipo de dato para formatear.
	 * @return object El dato ya formateado.
	 */
	protected function formatear($elDato, $elTipo)
	{
		$this->_elDato = utf8_decode($elDato);
		if($this->_elDato != '') {
			$this->_elDato = $this->conexion->real_escape_string($this->_elDato);
			$this->_elTipo = strval(trim($elTipo));
			switch ($this->_elTipo) {
				case "Cadena":
					$this->_elDato = "'" . strval(trim($this->_elDato)) . "'";
					break;
				case "CadenaBusqueda":
					$this->_elDato = "'%" . strval(trim($this->_elDato)) . "%'";
					break;
				case "Entero":
					$this->_elDato = intval($this->_elDato);
					break;
				case "Flotante":
					$this->_elDato = floatval($this->_elDato);
					break;
				case "Flotante2Decimales":
					$this->_elDato = number_format(floatval($this->_elDato), 2, '.', '');
					break;
				case "Fecha":
					$this->_elDato = "'" . $this->fecha($this->_elDato) . "'";
					break;
				case "HoraConSegundos":
					$this->_elDato = "'" . $this->hora($this->_elDato) . "'";
					break;
				case "HoraSinSegundos":
					$this->_elDato = "'" . $this->hora($this->_elDato, 'S') . "'";
					break;
				case "Encriptalo":
					$this->_elDato = "'" . md5(trim($this->_elDato)) . "'";
					break;
				default:
					throw new Exception('Falta el tipo de dato para la consulta.'); // Produccion
					//$this->_elDato = "NULL";
					break;
			}
			return $this->_elDato;
		} else {
			throw new Exception('Existe un valor vacio en la consultaPHP:' . $tipo); // Produccion
		}
	}

	/**
	 * Formatea una Hora en: HH:MM:SS.
	 * @access protected
	 * @param object $lahora La hora a formatear.
	 * @param string $sinSegundos Indica si la hora recibida esta sin segundos = S.
	 * @return string La Hora ya formateada.
	 */
	protected function hora($laHora, $sinSegundos='')
	{
		$_laHora = explode(':', $laHora);
		if($sinSegundos == 'S') {
			if( (count($_laHora) == 3) and
					($_laHora[0]<24 and $_laHora[0]>=0) and ($_laHora[1]<60 and $_laHora[1]>=0)) {
				return $laHora . ':00';
			} else {
				return '00:00:00';
			}
		} else {
			if( (count($_laHora) == 3) and
					($_laHora[0]<24 and $_laHora[0]>=0) and ($_laHora[1]<60 and $_laHora[1]>=0) and ($_laHora[2]<60 and $_laHora[2]>=0) ) {
				return $laHora;
			} else {
				return '00:00:00';
			}
		}
	}

	/**
	 * Formatea una Fecha en: AAAA-MM-DD.
	 * @access protected
	 * @param object $lafecha La hora a formatear.
	 * @return string La Fecha ya formateada.
	 */
	protected function fecha($laFecha)
	{
		$_laFecha = strval($laFecha);
		$_laFecha = explode('-', $_laFecha);
		if( (count($_laFecha) == 3) and
				(checkdate($_laFecha[1], $_laFecha[2], $_laFecha[0])) ) {
			return $laFecha;
		} else {
			return '0000-00-00';
		}
	}

	/**
	 * Quita los segundos en una Hora: HH:MM:SS -> HH:MM.
	 * @access protected
	 * @param time $hora La Hora a formatear.
	 * @return string La Hora ya formateada.
	 */
	protected function quitarSegundos($hora)
	{
		$_hora = substr($hora, 0, 5);
		return $_hora;
	}

	/**
	 * Convierte la fecha de MySQL al Formato Normal: aaaa-dd-mm -> dd-mm-aaaa (2000-02-14 -> 14/02/2000).
	 * @access protected
	 * @param date $fecha La Fecha a formatear.
	 * @return string La Fecha ya formateada.
	 */
	protected function fechaBaseToNormal($fecha)
	{
		$_fechaNormal = substr($fecha, 8, 2) . "/" . substr($fecha, 5, 2) . "/" . substr($fecha, 0, 4);
		if (strlen($_fechaNormal) == 10) {
			return $_fechaNormal;
		} else {
			return "FECHA_CORRUPTA";
		}
	}

	/**
	 * Ejectua la Sentencia de SQL recibida.
	 * @access protected
	 * @param string $elSQL La sentencia SQL a mandar a la base.
	 * @param integer $devolver Lo que queremos que MySQL devuelva.
	 * @param string $columna La columna en exclusiva que queremos que MySQL devuelva.
	 * @return object|integer|string|object $_devolver Devuelve uno de estos: ResultSet|ID|NumeroRegistros|valor.
	 */
	protected function sentenciaSQL($elSQL, $tipoDevolucion, $columna='')
	{
		$_resultado = $this->conexion->query($elSQL);
		// Si $_resultado fue TRUE:
		if($_resultado) {
			$_devolver = null;
			switch ($tipoDevolucion) {
				case 0:
					// Devolvemos el resulteSet tal cual (util para pdf y excel):
					$_devolver = $_resultado;
					break;
				case 1:
					// Devolvemos el resultSet convertido en un array (util para amfphp2 y zendamf):
					// DESCONTINUADO...
					break;
				case 2:
					// Devolvemos el resultSet convertido a formato JSON (util para jQuery o jQueryMobile):
					$_resultSet = array();
					while($_registro = $_resultado->fetch_assoc()) {
						$_resultSet[] = array_map(utf8_encode, $_registro);
					}
					$_devolver = $_resultSet;
					break;
				case 3:
					// Devolvemos el resultSet convertido a XML (util para webservices viejitos -experimental-):
					// DESCONTINUADO...
					break;
				case 4:
					// Devolvemos el ultimo id (AUTO_INCREMENT).
					$_devolver  = $this->conexion->insert_id;
					break;
				case 5:
					// Devolvemos el numero de registros afectados por INSERT, UPDATE o DELETE.
					$_devolver  = $this->conexion->affected_rows;
					break;
				case 6:
					// Devolvemos el numero de registros devueltos por SELECT solamente.
					$_devolver = $_resultado->num_rows;
					break;
				case 7:
					// Devolvemos el PRIMER registro devuelto por el SELECT en formato de array.
					$_devolver = $_resultado->fetch_assoc();
					break;
				case 8:
					// Devolvemos la columna especifica del PRIMER registro devuelto por el SELECT.
					$columnaSQL = strval(trim($columna));
					$registroSQL = $_resultado->fetch_assoc();
					$_devolver = $registroSQL[$columnaSQL];
					break;
				default:
					// No hay un $tipoDevolucion, por lo tanto devolvemos un error.
					throw new Exception("NO tienes un tipo definido en el Query.");
					return;
					break;
			}
			return $_devolver; // Aqui devolvemos el resultado a la Clase Heredada...
		} else {
			if(PRODUCCION) {
				throw new Exception("SQL " . rand(10, 99) . $this->conexion->errno); // Produccion.
			} else {
				throw new Exception("No. " .  $this->conexion->errno . "<br />Error: " . $this->conexion->error . "<br />En la sentencia:<br />". $elSQL); // Desarrollo.
			}
			return;
		}
	}

	/**
	 * Funcion que sirve para ver si el Usuario tiene Sesion o no.
	 * @access protected
	 * @return boolean True, si tiene Sesion, False si NO tiene Sesion.
	 */
	protected function validaSesion()
	{
		if(isset($_SESSION["idUsuario"]) && isset($_SESSION["tokenUsuario"])) {
			if( $_SESSION["tokenUsuario"] == md5(sha1(session_id() . $_SERVER['REMOTE_ADDR'] . $_SESSION["idUsuario"])) ) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}

	/**
	 * El Destructor de la Clase Base.
	 * @access public
	 * @return string
	 */
	public function __toString()
	{
		return '¿Que esperabas ver?';
	}
	
	/**
	 * El Destructor de la Clase Base.
	 * @access public
	 * @return string
	 */
	public function __clone()
	{
		throw new Exception("HOY, solo hay Clones de Homero Simpson.");
	}
	
	/**
	 * El Destructor de la Clase Base.
	 * @access public
	 * @return void
	 */
	public function __destruct()
	{
		// Vacio por el momento.
	}

}