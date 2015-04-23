<?php
require_once 'base.php';
require_once 'peticiones.php';

/**
 * Clase Cuentahabiente, para brindar funcionalidades para Accesar a la Aplicacion.
 */

final Class Cuentahabiente extends Base implements peticiones
{
	/**
	 * Atributo privado para el query de SQL
	 * @access private
	 * @var string
	 */
	private $_sql = null;
	
	/**
	 * Atributo privado para el ID del cuentahabiente
	 * @access private
	 * @var int
	 */
	private $_idC = null;
	/**
	 * Atributo privado para el curp del cuentahabiente
	 * @access private
	 * @var int
	 */
	private $_curpC = null;
	/**
	 * Atributo privado para el nombre del cuentahabiente
	 * @access private
	 * @var String
	 */
	private $_nomC = null;
	/**
	 * Atributo privado para el apellido paterno del cuentahabiente
	 * @access private
	 * @var String
	 */
	private $_apC = null;
	/**
	 * Atributo privado para el apellido materno del cuentahabiente
	 * @access private
	 * @var String
	 */
	private $_amC = null;
	/**
	 * Atributo privado para el sexo del cuentahabiente
	 * @access private
	 * @var String
	 */
	private $_sexC = null;
	/**
	 * Atributo privado para el estado civil del cuentahabiente
	 * @access private
	 * @var String
	 */
	private $_civilC = null;
	/**
	 * Atributo privado para el email del cuentahabiente
	 * @access private
	 * @var String
	 */
	private $_mailC = null;
	/**
	 * Atributo privado para el codigo postal del cuentahabiente
	 * @access private
	 * @var String
	 */
	private $_postalC = null;
	/**
	 * Atributo privado para el estado del cuentahabiente
	 * @access private
	 * @var int
	 */
	private $_estadoC = null;
	/**
	 * Atributo privado para el municipio del cuentahabiente
	 * @access private
	 * @var String
	 */
	private $_municipioC = null;
	/**
	 * Atributo privado para la calle del cuentahabiente
	 * @access private
	 * @var String
	 */
	private $_calleC = null;
	/**
	 * Atributo privado para el telefono del cuentahabiente
	 * @access private
	 * @var String
	 */
	private $_tel1C = null;

	private $_passC = null;
	
	/**
	 * Atributo privado para el tipo de devolucion para el ResulSet
	 * @access private
	 * @var int
	 */
	private $_tipo = null;
	
	/**
	 * Atributo privado para el Reporte en PDF
	 * @access private
	 * @var object
	 */
	private $_reportePDF = null;
	
	/**
	 * Atributo privado con los nombres de columnas
	 * @access private
	 * @var array
	 */
	private $_columnas = array('','Id_Cuenta','Curp','Nombre','Apellidop','Apellidom', 'Sexo', 'Ecivil', 'Email', 'Telefono1');
	
	/**
	 * Constructor de la Clase Paises, para invocar el Constructor de la Clase heredada
	 * @access public
	 * @return void
	 */
	public function __construct()
	{
		// Verificar si esta logeado:
		if(parent::validaSesion()){
			// Si es asi, mandamos a llamar el constructor del padre:
			parent::__construct();
		}else {
			// Caso contrario lo mandamos a la goma:
			throw new Exception("No tienes permisos");
			return;
		}		
	}
	
	/**
	 * Funcion para listar los Registros de la tabla paises
	 * @access public
	 * @param int Se utiliza para establecer el tipo de devolucion.
	 * @return object El juego de Resultados (puede ser un json, array, o resulset).
	 */
	public function listar($tipo)
	 {
	 	$this->_tipo = intval($tipo);
	 	$this->_sql = "SELECT * FROM cuentahabiente WHERE Id_Cuenta>=1 ORDER BY Id_Cuenta ASC;";
	 	return $this->sentenciaSQL($this->_sql,$this->_tipo);
	 }
	 
	 /**
	  * Funcion para buscar Registros en la tabla paises.
	  * @access public
	  * @param string El criterio a buscar en la tabla.
	  * @param string En que columna se va a buscar en la tabla.
	  * @param int Se utliza para establecer el tipo de devolucion.
	  * @return object El juego de Resultados (puede ser un json,array, o resulset).
	  */
	 public function buscar($criterio, $columna, $tipo)
	 {
	 	$this->_tipo = intval($tipo);
	 	if($columna == 0) {
	 		$this->_idC = $this->formatear($criterio, "CadenaBusqueda");
	 		$this->_curpC = $this->formatear($criterio, "CadenaBusqueda");
	 		$this->_nomC = $this->formatear($criterio, "CadenaBusqueda");
			$this->_apC = $this->formatear($criterio, "CadenaBusqueda");
	 		$this->_amC = $this->formatear($criterio, "CadenaBusqueda");
	 		$this->_sexC = $this->formatear($criterio, "CadenaBusqueda");
			$this->_civilC = $this->formatear($criterio, "CadenaBusqueda");
	 		$this->_mailC = $this->formatear($criterio, "CadenaBusqueda");
	 		$this->_tel1C = $this->formatear($criterio, "CadenaBusqueda");
	 		$this->_sql = sprintf("SELECT * FROM cuentahabiente WHERE (Id_Cuenta LIKE %s OR Curp LIKE %s OR Nombre LIKE %s OR Apellidop LIKE %s OR Apellidom LIKE %s OR Sexo LIKE %s OR Ecivil LIKE %s OR Email LIKE %s OR Telefono1 LIKE %s) ORDER BY Id_Cuenta ASC;",
	 		$this->_idC, $this->_curpC, $this->_nomC, $this->_apC, $this->_amC, $this->_sexC, $this->_civilC, $this->_mailC, $this->_tel1C);
	 	}else {
	 		$_columna = $this->_columnas[intval($columna)];
	 		$_criterio = $this->formatear($criterio, "CadenaBusqueda");
	 		$this->_sql = sprintf("SELECT * FROM cuentahabiente WHERE %s LIKE %s ORDER BY Id_Cuenta ASC;",
	 		$_columna, $_criterio);
	 	}
	 	return $this->sentenciaSQL($this->_sql, $this->_tipo);
	 }
	 
	 /**
	  * Funcion para insertar un Registro en la tabla paises.
	  * @access public
	  * @param object Es el registro que vamos a insertar.
	  * @return int El ID del Registro insertado.
	  */
	 public function insertar($registro)
	 {
	 	if(is_array($registro)) {
	 		$registro = (object)$registro;
	 	}
		$this->_curpC = $this->formatear($registro->Curp, "Cadena");
		$this->_nomC = $this->formatear($registro->Nombre, "Cadena");
		$this->_apC = $this->formatear($registro->Apellidop, "Cadena");
		$this->_amC = $this->formatear($registro->Apellidom, "Cadena");
		$this->_sexC = $this->formatear($registro->Sexo, "Cadena");
		$this->_civilC = $this->formatear($registro->Ecivil, "Cadena");
		$this->_mailC = $this->formatear($registro->Email, "Cadena");
		$this->_postalC = $this->formatear($registro->Cpostal, "Cadena");
		$this->_estadoC = $this->formatear($registro->Estado, "Cadena");
		$this->_municipioC = $this->formatear($registro->Municipio, "Cadena");
		$this->_calleC = $this->formatear($registro->Calle, "Cadena");
		$this->_tel1C = $this->formatear($registro->Telefono1, "Cadena");
	 	
	 	$this->_sql = sprintf("INSERT INTO cuentahabiente VALUES(null, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, null);",
	 	$this->_curpC, $this->_nomC, $this->_apC, $this->_amC, $this->_sexC, $this->_civilC, $this->_mailC, $this->_postalC, $this->_estadoC, $this->_municipioC, $this->_calleC, $this->_tel1C);
	 	return $this->sentenciaSQL($this->_sql, 4);
	 }
	 
	 /**
	  * Funcion para actualizar un Registro en la tabla cuentahabiente.
	  * @access public
	  * @param object El registro a actualizarce.
	  * @return int El Numero de Registros afectados.
	  */
	 public function actualizar($registro)
	 {
	 	if(is_array($registro)) {
	 		$registro = (object)$registro;
	 	}
	 	$this->_idC = $this->formatear($registro->Id_Cuenta, "Entero");
		$this->_curpC = $this->formatear($registro->Curp, "Cadena");
		$this->_nomC = $this->formatear($registro->Nombre, "Cadena");
		$this->_apC = $this->formatear($registro->Apellidop, "Cadena");
		$this->_amC = $this->formatear($registro->Apellidom, "Cadena");
		$this->_sexC = $this->formatear($registro->Sexo, "Cadena");
		$this->_civilC = $this->formatear($registro->Ecivil, "Cadena");
		$this->_mailC = $this->formatear($registro->Email, "Cadena");
		$this->_postalC = $this->formatear($registro->Cpostal, "Entero");
		$this->_estadoC = $this->formatear($registro->Estado, "Cadena");
		$this->_municipioC = $this->formatear($registro->Municipio, "Cadena");
		$this->_calleC = $this->formatear($registro->Calle, "Cadena");
		$this->_tel1C = $this->formatear($registro->Telefono1, "Entero");

		$this->_sql = sprintf("UPDATE cuentahabiente SET Curp=%s, Nombre=%s, Apellidop=%s, Apellidom=%s, Sexo=%s, Ecivil=%s, Email=%s, Cpostal=%s, Estado=%s, Municipio=%s, Calle=%s, Telefono1=%s WHERE Id_Cuenta=%s LIMIT 1;",
		$this->_curpC, $this->_nomC, $this->_apC, $this->_amC, $this->_sexC, $this->_civilC, $this->_mailC, $this->_postalC, $this->_estadoC, $this->_municipioC, $this->_calleC, $this->_tel1C, $this->_idC);
		return $this->sentenciaSQL($this->_sql, 5);
	 }
	 
	 /**
	  * Funcion para eliminar un Registro en la tabla paises.
	  * @access public
	  * @param object El registro a eliminarse.
	  * @return int El Numro de Registros afectados.
	  */
	 public function borrar($registro)
	 {
	 	if(is_array($registro)) {
	 		$registro = (object)$registro;
	 	}
	 		$this->_idC = $this->formatear($registro->Id_Cuenta, "Entero");
	 		$this->_sql = sprintf("DELETE FROM cuentahabiente WHERE Id_Cuenta=%s LIMIT 1;", $this->_idC);
	 		return $this->sentenciaSQL($this->_sql, 5);
	 		 
	 }

	 /**
	  * Funcion para crear un Reporte PDF sencillo de la tabla paises.
	  * @access public
	  * @param El tripo de reporte a realizar.
	  * @param El criterio de busqueda.
	  * @param La columna de busqueda.
	  * @return String Nombre del Archivo PDF creado.
	  */
	 public function reportePDF($tipo, $criterio='', $columna='')
	 {
	 	switch (strval($tipo)) {
	 		case 'listar':
	 			// listado.
	 			$_resultSet = $this->listar(0);
	 			$_nombre = 'lista_Cuentahabiente.pdf';
	 			$_titulo = '   Listado de Cuentahabiente';
	 			break;
	 		case 'buscar':
	 			// busqueda.
	 			$_resultSet = $this->buscar($criterio, $columna, 0);
	 			$_nombre = 'busqueda_Cuentahabiente.pdf';
	 			$_titulo = 'Busqueda de Cuentahabiente por "'.$criterio.'"';
	 			break;
	 		default:
	 			throw new Exception('NO hay tipo de reporte definido'); return;
	 			break; 
	 	}
	 	require_once 'fabricapdf.php';
	 	$this->_reportePDF = new FabricaPDF('P', 'mm', 'CARTA', true, 'UTF-8', false);
	 	$this->_reportePDF->colocarCaracteristicas($this->_reportePDF, $_titulo, 'equipo');
	 	$this->_reportePDF->colocarMargenes($this->_reportePDF, 30, 10, 5, 5, 10, 10, true);
	 	$this->_reportePDF->AddPage();
	 	$this->_reportePDF->Ln(20);
	 	$this->_reportePDF->SetFont('dejavusans', 'B', 9);
	 	$this->_reportePDF->MultiCell(10, 0, 'Id', 0, 'R', 0, 0, '', '', true, 0, false, true, 40, 'T');
	 	$this->_reportePDF->Cell(1);
	 	$this->_reportePDF->MultiCell(40, 0, 'Curp', 0, 'L', 0, 0, '', '', true, 0, false, true, 40, 'T');
	 	$this->_reportePDF->Cell(1);
	 	$this->_reportePDF->MultiCell(40, 0, 'Nombre', 0, 'L', 0, 0, '', '', true, 0, false, true, 40, 'T');
	 	$this->_reportePDF->Cell(1);
	 	$this->_reportePDF->MultiCell(40, 0, 'Apellido Paterno', 0, 'L', 0, 0, '', '', true, 0, false, true, 40, 'T');
	 	$this->_reportePDF->Cell(1);
	 	$this->_reportePDF->MultiCell(40, 0, 'Apellido Materno.', 0, 'L', 0, 0, '', '', true, 0, false, true, 40, 'T');
	 	$this->_reportePDF->Cell(1);
		$this->_reportePDF->MultiCell(25, 0, 'Sexo', 0, 'L', 0, 1, '', '', true, 0, false, true, 40, 'T');
	 	$this->_reportePDF->Ln(1);

	 	$this->_reportePDF->SetFont('dejavusans', '', 9);
	 	$this->_reportePDF->SetFillColor(38, 154, 188);
	 	while($_registro = $_resultSet->fetch_assoc()) {
	 		$rellenar = ((++$i) % 2);
	 		$this->_reportePDF->MultiCell(10, 0, utf8_encode($_registro['Id_Cuenta']), 0, 'R', $rellenar, 0, '', '', true, 0, false, true, 40, 'T');
	 		$this->_reportePDF->Cell(1);
	 		$this->_reportePDF->MultiCell(40, 0, utf8_encode($_registro['Curp']), 0, 'L', $rellenar, 0, '', '', true, 0, false, true, 40, 'T');
	 		$this->_reportePDF->Cell(1);
	 		$this->_reportePDF->MultiCell(40, 0, utf8_encode($_registro['Nombre']), 0, 'L', $rellenar, 0, '', '', true, 0, false, true, 40, 'T');
	 		$this->_reportePDF->Cell(1);
	 		$this->_reportePDF->MultiCell(40, 0, utf8_encode($_registro['Apellidop']), 0, 'L', $rellenar, 0, '', '', true, 0, false, true, 40, 'T');
	 		$this->_reportePDF->Cell(1);
	 		$this->_reportePDF->MultiCell(40, 0, utf8_encode($_registro['Apellidom']), 0, 'L', $rellenar, 0, '', '', true, 0, false, true, 40, 'T');
	 		$this->_reportePDF->Cell(1);
			$this->_reportePDF->MultiCell(25, 0, utf8_encode($_registro['Sexo']), 0, 'L', $rellenar, 1, '', '', true, 0, false, true, 40, 'T');
	 		$this->_reportePDF->Ln(1);
	 	}
	 	$this->_reportePDF->Ln(5);
	 	$this->_reportePDF->SetFont('dejavusans', '', 9);
	 	$this->_reportePDF->MultiCell(0, 0, utf8_encode('Este Reporte contiene ' .$_resultSet->num_rows.' Cuentahabiente(s).'), 0, 'L', 0, 1, '', '', true, 0, false, true,
	 	40, 'T');
	 	$this->_reportePDF->Output('../pdfs/' .$_nombre, 'F');
	 	return $_nombre;
	 }
	 
	 /**
	  * El destructor de la Clase Cuentahabiente.
	  * @access public
	  * @return void
	  */
	 public function __destruct()
	 {
	 	error_reporting(E_ALL);
	 }
}