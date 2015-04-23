<?php
require_once 'base.php';
require_once 'peticiones.php';

/**
 * Clase Paquete, para brindar funcionalidades para Accesar a la Aplicacion.
 */

final Class Paquete extends Base implements peticiones
{
	/**
	 * Atributo privado para el query de SQL
	 * @access private
	 * @var string
	 */
	private $_sql = null;
	
	/**
	 * Atributo privado para el ID del Pais
	 * @access private
	 * @var int
	 */
	private $_claveP = null;
	
	private $_desP = null;
	
	private $_preP = null;

	private $_nomP = null;
	
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
	private $_columnas = array('','Clave_Paquete','Descripcion','Precio','Nombre');
	
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
	 	$this->_sql = "SELECT * FROM paquetes WHERE Clave_Paquete>=1 ORDER BY Clave_Paquete ASC;";
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
	 		$this->_claveP = $this->formatear($criterio, "CadenaBusqueda");
	 		$this->_desP = $this->formatear($criterio, "CadenaBusqueda");
	 		$this->_preP = $this->formatear($criterio, "CadenaBusqueda");
			$this->_nomP = $this->formatear($criterio, "CadenaBusqueda");
	 		$this->_sql = sprintf("SELECT * FROM paquetes WHERE (Clave_Paquete LIKE %s OR Descripcion LIKE %s OR Precio LIKE %s OR Nombre LIKE %s) ORDER BY Clave_Paquete ASC;",
	 		$this->_idMedicamento, $this->_nombrer, $this->_nombrec);
	 	}else {
	 		$_columna = $this->_columnas[intval($columna)];
	 		$_criterio = $this->formatear($criterio, "CadenaBusqueda");
	 		$this->_sql = sprintf("SELECT * FROM paquetes WHERE %s LIKE %s ORDER BY Clave_Paquete ASC;",
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
		$this->_desP = $this->formatear($registro->Descripcion, "Cadena");
		$this->_preP = $this->formatear($registro->Precio, "Entero");
		$this->_nomP = $this->formatear($registro->Nombre, "Cadena");
	 	
	 	$this->_sql = sprintf("INSERT INTO paquetes VALUES(null, %s, %s, %s);",
	 	$this->_desP, $this->_preP, $this->_nomP);
	 	return $this->sentenciaSQL($this->_sql, 4);
	 }
	 
	 /**
	  * Funcion para actualizar un Registro en la tabla paises.
	  * @access public
	  * @param object El registro a actualizarce.
	  * @return int El Numero de Registros afectados.
	  */
	 public function actualizar($registro)
	 {
	 	if(is_array($registro)) {
	 		$registro = (object)$registro;
	 	}
	 	$this->_claveP = $this->formatear($registro->Clave_Paquete, "Entero");
		$this->_desP = $this->formatear($registro->Descripcion, "Cadena");
		$this->_preP = $this->formatear($registro->Precio, "Entero");
		$this->_nomP = $this->formatear($registro->Nombre, "Cadena");

		$this->_sql = sprintf("UPDATE paquetes SET Descripcion=%s, Precio=%s, Nombre=%s WHERE Clave_Paquete=%s LIMIT 1;",
		$this->_desP, $this->_preP, $this->_nomP, $this->_claveP);
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
	 		$this->_claveP = $this->formatear($registro->Clave_Paquete, "Entero");
	 		$this->_sql = sprintf("DELETE FROM paquetes WHERE Clave_Paquete=%s LIMIT 1;", $this->_claveP);
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
	 			$_nombre = 'lista_Paquete.pdf';
	 			$_titulo = '   Listado de Paquete';
	 			break;
	 		case 'buscar':
	 			// busqueda.
	 			$_resultSet = $this->buscar($criterio, $columna, 0);
	 			$_nombre = 'busqueda_Paquete.pdf';
	 			$_titulo = 'Busqueda de Paquete por "'.$criterio.'"';
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
	 	$this->_reportePDF->MultiCell(15, 0, 'Clave', 0, 'R', 0, 0, '', '', true, 0, false, true, 40, 'T');
	 	$this->_reportePDF->Cell(1);
	 	$this->_reportePDF->MultiCell(130, 0, 'Descipcion', 0, 'L', 0, 0, '', '', true, 0, false, true, 40, 'T');
	 	$this->_reportePDF->Cell(1);
	 	$this->_reportePDF->MultiCell(30, 0, 'Precio', 0, 'L', 0, 0, '', '', true, 0, false, true, 40, 'T');
	 	$this->_reportePDF->Cell(1);
	 	$this->_reportePDF->MultiCell(25, 0, 'Nombre', 0, 'L', 0, 1, '', '', true, 0, false, true, 40, 'T');
	 	$this->_reportePDF->Ln(1);

	 	$this->_reportePDF->SetFont('dejavusans', '', 9);
	 	$this->_reportePDF->SetFillColor(38, 154, 188);
	 	while($_registro = $_resultSet->fetch_assoc()) {
	 		$rellenar = ((++$i) % 2);
	 		$this->_reportePDF->MultiCell(15, 0, utf8_encode($_registro['Clave_Paquete']), 0, 'R', $rellenar, 0, '', '', true, 0, false, true, 40, 'T');
	 		$this->_reportePDF->Cell(1);
	 		$this->_reportePDF->MultiCell(130, 0, utf8_encode($_registro['Descripcion']), 0, 'L', $rellenar, 0, '', '', true, 0, false, true, 40, 'T');
	 		$this->_reportePDF->Cell(1);
	 		$this->_reportePDF->MultiCell(30, 0, utf8_encode($_registro['Precio']), 0, 'L', $rellenar, 0, '', '', true, 0, false, true, 40, 'T');
	 		$this->_reportePDF->Cell(1);
	 		$this->_reportePDF->MultiCell(25, 0, utf8_encode($_registro['Nombre']), 0, 'L', $rellenar, 1, '', '', true, 0, false, true, 40, 'T');
	 		$this->_reportePDF->Ln(1);
	 	}
	 	$this->_reportePDF->Ln(5);
	 	$this->_reportePDF->SetFont('dejavusans', '', 9);
	 	$this->_reportePDF->MultiCell(0, 0, utf8_encode('Este Reporte contiene ' .$_resultSet->num_rows.' Paquete(s).'), 0, 'L', 0, 1, '', '', true, 0, false, true,
	 	40, 'T');
	 	$this->_reportePDF->Output('../pdfs/' .$_nombre, 'F');
	 	return $_nombre;
	 }
	 
	 /**
	  * El destructor de la Clase Paises.
	  * @access public
	  * @return void
	  */
	 public function __destruct()
	 {
	 	error_reporting(E_ALL);
	 }
}