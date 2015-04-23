<?php
require_once 'base.php';
require_once 'peticiones.php';

/**
 * Clase Paises, para brindar funcionalidades para Accesar a la Aplicacion.
 */

final Class Membresias extends Base implements peticiones
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
	private $_Id_Membresia = null;
	
	private $_Personas = null;

	private $_Descripcion = null;

	private $_Precio = null;
	
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
	private $_columnas = array('','Id_Membresia','Personas','Precio');
	
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
	 	$this->_sql = "SELECT * FROM membresias WHERE Id_Membresia>=1 ORDER BY Id_Membresia ASC;";
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
	 		$this->_Id_Membresia = $this->formatear($criterio, "CadenaBusqueda");
	 		$this->_Personas = $this->formatear($criterio, "CadenaBusqueda");
	 		$this->_Precio = $this->formatear($criterio, "CadenaBusqueda");
	 		$this->_sql = sprintf("SELECT * FROM membresias WHERE (Id_Membresia LIKE %s OR Personas LIKE %s OR Precio LIKE %s) ORDER BY Id_Membresia ASC;",
	 		$this->_Id_Membresia, $this->_Personas, $this->_Precio);
	 	}else {
	 		$_columna = $this->_columnas[intval($columna)];
	 		$_criterio = $this->formatear($criterio, "CadenaBusqueda");
	 		$this->_sql = sprintf("SELECT * FROM membresias WHERE %s LIKE %s ORDER BY Id_Membresia ASC;",
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
	 	$this->_Personas = $this->formatear($registro->Personas, "Entero");
		$this->_Descripcion = $this->formatear($registro->Descripcion, "Cadena");
		$this->_Precio = $this->formatear($registro->Precio, "Entero");
	 	
	 	$this->_sql = sprintf("INSERT INTO membresias VALUES(null, %s, %s, %s);",
	 	$this->_Personas, $this->_Descripcion, $this->_Precio);
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
	 		$this->_Id_Membresia= $this->formatear($registro->Id_Membresia, "Entero");
	 		$this->_Personas = $this->formatear($registro->Personas, "Entero");
		 	$this->_Descripcion = $this->formatear($registro->Descripcion, "Cadena");
		 	$this->_Precio = $this->formatear($registro->Precio, "Entero");
	 		$this->_sql = sprintf("UPDATE membresias SET  Personas=%s, Descripcion=%s, Precio=%s WHERE Id_Membresia=%s LIMIT 1;",
	 		$this->_Personas, $this->_Descripcion, $this->_Precio, $this->_Id_Membresia);
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
	 		$this->_Id_Membresia = $this->formatear($registro->Id_Membresia, "Entero");
	 		$this->_sql = sprintf("DELETE FROM membresias WHERE Id_Membresia=%s LIMIT 1;", $this->_Id_Membresia);
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
	 			$_nombre = 'lista_Membresias.pdf';
	 			$_titulo = 'Listado de Membresias';
	 			break;
	 		case 'buscar':
	 			// busqueda.
	 			$_resultSet = $this->buscar($criterio, $columna, 0);
	 			$_nombre = 'busqueda_Membresias.pdf';
	 			$_titulo = 'Busqueda de Membresias por "'.$criterio.'"';
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
	 	$this->_reportePDF->MultiCell(20, 0, 'Id_Membresia', 0, 'R', 0, 0, '', '', true, 0, false, true, 40, 'T');
	 	$this->_reportePDF->Cell(1);
	 	$this->_reportePDF->MultiCell(80, 0, 'Descripcion', 0, 'L', 0, 0, '', '', true, 0, false, true, 40, 'T');
	 	$this->_reportePDF->Cell(1);
	 	$this->_reportePDF->MultiCell(40, 0, 'Numero de Personas', 0, 'L', 0, 0, '', '', true, 0, false, true, 40, 'T');
	 	$this->_reportePDF->Cell(1);
	 	$this->_reportePDF->MultiCell(40, 0, 'Precio', 0, 'L', 0, 1, '', '', true, 0, false, true, 40, 'T');
	 	$this->_reportePDF->Ln(5);

	 	$this->_reportePDF->SetFont('dejavusans', '', 9);
	 	$this->_reportePDF->SetFillColor(38, 154, 188);
	 	while($_registro = $_resultSet->fetch_assoc()) {
	 		$rellenar = ((++$i) % 2);
	 		$this->_reportePDF->MultiCell(20, 0, utf8_encode($_registro['Id_Membresia']), 0, 'R', $rellenar, 0, '', '', true, 0, false, true, 40, 'T');
	 		$this->_reportePDF->Cell(1);
	 		$this->_reportePDF->MultiCell(90, 0, utf8_encode($_registro['Descripcion']), 0, 'L', $rellenar, 0, '', '', true, 0, false, true, 40, 'T');
	 		$this->_reportePDF->Cell(1);
	 		$this->_reportePDF->MultiCell(40, 0, utf8_encode($_registro['Personas']), 0, 'L', $rellenar, 0, '', '', true, 0, false, true, 40, 'T');
	 		$this->_reportePDF->Cell(1);
	 		$this->_reportePDF->MultiCell(40, 0, utf8_encode($_registro['Precio']), 0, 'L', $rellenar, 1, '', '', true, 0, false, true, 40, 'T');
	 		$this->_reportePDF->Ln(1);
	 	}
	 	$this->_reportePDF->Ln(5);
	 	$this->_reportePDF->SetFont('dejavusans', '', 9);
	 	$this->_reportePDF->MultiCell(0, 0, utf8_encode('Este Reporte contiene ' .$_resultSet->num_rows.' Medicamento(os).'), 0, 'L', 0, 1, '', '', true, 0, false, true,
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