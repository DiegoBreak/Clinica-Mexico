<?php
require_once 'base.php';
require_once 'peticiones.php';

/**
 * Clase Doctor, para brindar funcionalidades para Accesar a la Aplicacion.
 */

final Class Doctor extends Base implements peticiones
{
	/**
	 * Atributo privado para el query de SQL
	 * @access private
	 * @var string
	 */
	private $_sql = null;
	
	/**
	 * Atributo privado para el ID del doctor
	 * @access private
	 * @var int
	 */
	private $_idD = null;
	/**
	 * Atributo privado para curp
	 * @access private
	 * @var string
	 */
	private $_curpD = null;
	/**
	 * Atributo privado para nombre
	 * @access private
	 * @var string
	 */
	private $_nomD = null;
	/**
	 * Atributo privado para apellido paterno
	 * @access private
	 * @var string
	 */
	private $_apD = null;
	/**
	 * Atributo privado para apellido materno
	 * @access private
	 * @var string
	 */
	private $_amD = null;
	/**
	 * Atributo privado para el sexo
	 * @access private
	 * @var string
	 */
	private $_sexD = null;
	/**
	 * Atributo privado para email
	 * @access private
	 * @var string
	 */
	private $_mailD = null;
	/**
	 * Atributo privado para el codigo postal
	 * @access private
	 * @var string
	 */
	private $_postalD = null;
	/**
	 * Atributo privado para el estado
	 * @access private
	 * @var string
	 */
	private $_estadoD = null;
	/**
	 * Atributo privado para municipio
	 * @access private
	 * @var string
	 */
	private $_municipioD = null;
	/**
	 * Atributo privado para la calle
	 * @access private
	 * @var string
	 */
	private $_calleD = null;
	/**
	 * Atributo privado para el telefono
	 * @access private
	 * @var string
	 */
	private $_tel1D = null;
	/**
	 * Atributo privado para la cedula
	 * @access private
	 * @var string
	 */
	private $_cedD = null;
	/**
	 * Atributo privado para estado
	 * @access private
	 * @var string
	 */
	private $_estD = null;
	/**
	 * Atributo privado para contraseña
	 * @access private
	 * @var string
	 */
	private $_cont = null;
	/**
	 * Atributo privado para usuario
	 * @access private
	 * @var string
	 */
	private $_usu = null;
	
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
	private $_columnas = array('','Id_Doctor','Curp','Nombre','Apellidop','Apellidom', 'Sexo', 'Email', 'Cpostal', 'Esado', 'Municipio', 'Telefono1', 'Cedula', 'Estatus');
	
	/**
	 * Constructor de la Clase doctores, para invocar el Constructor de la Clase heredada
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
	 * Funcion para listar los Registros de la tabla doctores
	 * @access public
	 * @param int Se utiliza para establecer el tipo de devolucion.
	 * @return object El juego de Resultados (puede ser un json, array, o resulset).
	 */
	public function listar($tipo)
	 {
	 	$this->_tipo = intval($tipo);
	 	$this->_sql = "SELECT * FROM doctor WHERE Id_Doctor>=1 ORDER BY Id_Doctor ASC;";
	 	return $this->sentenciaSQL($this->_sql,$this->_tipo);
	 }
	 
	 /**
	  * Funcion para buscar Registros en la tabla doctores.
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
	 		$this->_idD = $this->formatear($criterio, "CadenaBusqueda");
	 		$this->_curpD = $this->formatear($criterio, "CadenaBusqueda");
	 		$this->_nomD = $this->formatear($criterio, "CadenaBusqueda");
			$this->_apD = $this->formatear($criterio, "CadenaBusqueda");
	 		$this->_amD = $this->formatear($criterio, "CadenaBusqueda");
	 		$this->_sexD = $this->formatear($criterio, "CadenaBusqueda");
			$this->_mailD = $this->formatear($criterio, "CadenaBusqueda");
			$this->_postalD = $this->formatear($criterio, "CadenaBusqueda");
			$this->_estadoD = $this->formatear($criterio, "CadenaBusqueda");
			$this->_municipioD = $this->formatear($criterio, "CadenaBusqueda");
			$this->_calleD = $this->formatear($criterio, "CadenaBusqueda");
			$this->_tel1D = $this->formatear($criterio, "CadenaBusqueda");
			$this->_cedD = $this->formatear($criterio, "CadenaBusquda");
			$this->_estD = $this->formatear($criterio, "CadenaBusquda");
			
	 		$this->_sql = sprintf("SELECT * FROM doctor WHERE (Id_Doctor LIKE %s OR Curp LIKE %s OR Nombre LIKE %s OR Apellidop LIKE %s OR Apellidom LIKE %s OR Sexo LIKE %s OR Email LIKE %s OR Cpostal LIKE %s OR Estado LIKE %s OR Municipio LIKE %s OR Calle LIKE %s OR Telefono1 LIKE %s OR Cedula LIKE %s OR Estatus LIKE %s) ORDER BY Id_Doctor ASC;",
	 		$this->_idD, $this->_curpD, $this->_nomD, $this->_apD, $this->_amD, $this->_sexD, $this->_mailD, $this->_postalD, $this->_estadoD, $this->_municipioD, $this->_calleD, $this->_tel1D, $this->_cedD, $this->_estD); 
	 	}else {
	 		$_columna = $this->_columnas[intval($columna)];
	 		$_criterio = $this->formatear($criterio, "CadenaBusqueda");
	 		$this->_sql = sprintf("SELECT * FROM doctor WHERE %s LIKE %s ORDER BY Id_Doctor ASC;",
	 		$_columna, $_criterio);
	 	}
	 	return $this->sentenciaSQL($this->_sql, $this->_tipo);
	 }
	 
	 /**
	  * Funcion para insertar un Registro en la tabla doctores.
	  * @access public
	  * @param object Es el registro que vamos a insertar.
	  * @return int El ID del Registro insertado.
	  */
	 public function insertar($registro)
	 {
	 	if(is_array($registro)) {
	 		$registro = (object)$registro;
	 	}
		$this->_curpD = $this->formatear($registro->Curp, "Cadena");
		$this->_nomD = $this->formatear($registro->Nombre, "Cadena");
		$this->_apD = $this->formatear($registro->Apellidop, "Cadena");
		$this->_amD = $this->formatear($registro->Apellidom, "Cadena");
		$this->_sexD = $this->formatear($registro->Sexo, "Cadena");
		$this->_mailD = $this->formatear($registro->Email, "Cadena");
		$this->_postalD = $this->formatear($registro->Cpostal, "Entero");
		$this->_estadoD = $this->formatear($registro->Estado, "Cadena");
		$this->_municipioD = $this->formatear($registro->Municipio, "Cadena");
		$this->_calleD = $this->formatear($registro->Calle, "Cadena");
		$this->_tel1D = $this->formatear($registro->Telefono1, "Entero");
		$this->_cedD = $this->formatear($registro->Cedula, "Cadena");
		$this->_estD = $this->formatear($registro->Estatus, "Cadena");
		$this->_cont = $this->formatear(strtolower($registro->Curp),"Encriptalo");
		$this->_usu = $this->formatear(strtolower($registro->Nombre.$registro->Apellidop),"Encriptalo");
	 	
	 	$this->_sql = sprintf("INSERT INTO doctor VALUES(null, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,%s, %s, %s);",
	 	$this->_curpD, $this->_nomD, $this->_apD, $this->_amD, $this->_sexD, $this->_mailD, $this->_postalD, $this->_estadoD, $this->_municipioD, $this->_calleD, $this->_tel1D,$this->_cont,$this->_usu,$this->_cedD, $this->_estD);
	 	return $this->sentenciaSQL($this->_sql, 4);
	 }
	 
	 /**
	  * Funcion para actualizar un Registro en la tabla doctores.
	  * @access public
	  * @param object El registro a actualizarce.
	  * @return int El Numero de Registros afectados.
	  */
	 public function actualizar($registro)
	 {
	 	if(is_array($registro)) {
	 		$registro = (object)$registro;
	 	}
	 	$this->_idD = $this->formatear($registro->Id_Doctor, "Entero");
		$this->_curpD = $this->formatear($registro->Curp, "Cadena");
		$this->_nomD = $this->formatear($registro->Nombre, "Cadena");
		$this->_apD = $this->formatear($registro->Apellidop, "Cadena");
		$this->_amD = $this->formatear($registro->Apellidom, "Cadena");
		$this->_sexD = $this->formatear($registro->Sexo, "Cadena");
		$this->_mailD = $this->formatear($registro->Email, "Cadena");
		$this->_postalD = $this->formatear($registro->Cpostal, "Entero");
		$this->_estadoD = $this->formatear($registro->Estado, "Cadena");
		$this->_municipioD = $this->formatear($registro->Municipio, "Cadena");
		$this->_calleD = $this->formatear($registro->Calle, "Cadena");
		$this->_tel1D = $this->formatear($registro->Telefono1, "Entero");
		$this->_cedD = $this->formatear($registro->Cedula, "Entero");
		$this->_estD = $this->formatear($registro->Estatus, "Cadena");
		$this->_sql = sprintf("UPDATE doctor SET Curp=%s, Nombre=%s, Apellidop=%s, Apellidom=%s, Sexo=%s, Email=%s, Cpostal=%s, Estado=%s, Municipio=%s, Calle=%s, Telefono1=%s, Cedula=%s, Estatus=%s WHERE Id_Doctor=%s LIMIT 1;",
		$this->_curpD, $this->_nomD, $this->_apD, $this->_amD, $this->_sexD, $this->_mailD, $this->_postalD, $this->_estadoD, $this->_municipioD, $this->_calleD, $this->_tel1D, $this->_cedD, $this->_estD, $this->_idD);
		return $this->sentenciaSQL($this->_sql, 5);
	 }
	 
	 /**
	  * Funcion para eliminar un Registro en la tabla doctores.
	  * @access public
	  * @param object El registro a eliminarse.
	  * @return int El Numro de Registros afectados.
	  */
	 public function borrar($registro)
	 {
	 	if(is_array($registro)) {
	 		$registro = (object)$registro;
	 	}
	 		$this->_idD = $this->formatear($registro->Id_Doctor, "Entero");
	 		$this->_sql = sprintf("DELETE FROM doctor WHERE Id_Doctor=%s LIMIT 1;", $this->_idD);
	 		return $this->sentenciaSQL($this->_sql, 5);
	 		 
	 }

	 /**
	  * Funcion para crear un Reporte PDF sencillo de la tabla doctores.
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
	 			$_nombre = 'lista_Doctor.pdf';
	 			$_titulo = '   Listado de Doctor';
	 			break;
	 		case 'buscar':
	 			// busqueda.
	 			$_resultSet = $this->buscar($criterio, $columna, 0);
	 			$_nombre = 'busqueda_Doctor.pdf';
	 			$_titulo = 'Busqueda de Doctor por "'.$criterio.'"';
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
	 		$this->_reportePDF->MultiCell(10, 0, utf8_encode($_registro['Id_Doctor']), 0, 'R', $rellenar, 0, '', '', true, 0, false, true, 40, 'T');
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
	 	$this->_reportePDF->MultiCell(0, 0, utf8_encode('Este Reporte contiene ' .$_resultSet->num_rows.' Doctor(es).'), 0, 'L', 0, 1, '', '', true, 0, false, true,
	 	40, 'T');
	 	$this->_reportePDF->Output('../pdfs/' .$_nombre, 'F');
	 	return $_nombre;
	 }
	 
	 /**
	  * El destructor de la Clase doctores.
	  * @access public
	  * @return void
	  */
	 public function __destruct()
	 {
	 	error_reporting(E_ALL);
	 }
}