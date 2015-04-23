<?php
require_once 'base.php';
require_once 'peticiones.php';

/**
 * Clase Paises, para brindar funcionalidades para Accesar a la Aplicacion.
 */

final Class Medicamentos extends Base implements peticiones
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
	private $_idMedicamento = null;
	
	private $_Nomreg = null;

	private $_Nomcien = null;

	private $_Formula = null;

	private $_Forma = null;

	private $_Dosis = null;
	
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
	private $_columnas = array('','Id_Medicamento','Nomreg','Nomcien','Forma','Formula');
	
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
	 	$this->_sql = "SELECT * FROM medicamentos WHERE Id_Medicamento>=1 ORDER BY Id_Medicamento ASC;";
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
	 		$this->_idMedicamento = $this->formatear($criterio, "CadenaBusqueda");
	 		$this->_Nomreg = $this->formatear($criterio, "CadenaBusqueda");
	 		$this->_Nomcien = $this->formatear($criterio, "CadenaBusqueda");
	 		$this->_sql = sprintf("SELECT * FROM medicamentos WHERE (Id_Medicamento LIKE %s OR Nomreg LIKE %s OR Nomcien LIKE %s) ORDER BY Id_Medicamento ASC;",
	 		$this->_idMedicamento, $this->_Nomreg, $this->_Nomcien);
	 	}else {
	 		$_columna = $this->_columnas[intval($columna)];
	 		$_criterio = $this->formatear($criterio, "CadenaBusqueda");
	 		$this->_sql = sprintf("SELECT * FROM medicamentos WHERE %s LIKE %s ORDER BY Id_Medicamento ASC;",
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
	 	$this->_Nomreg = $this->formatear($registro->Nomreg, "Cadena");
	 	$this->_Nomcien = $this->formatear($registro->Nomcien, "Cadena");
	 	$this->_Formula = $this->formatear($registro->Formula, "Cadena");
	 	$this->_Forma = $this->formatear($registro->Forma, "Cadena");
	 	$this->_Dosis = $this->formatear($registro->Dosis, "Entero");
	 	
	 	$this->_sql = sprintf("INSERT INTO medicamentos VALUES(null, %s, %s, %s, %s, %s);",
	 	$this->_Nomcien, $this->_Nomreg, $this->_Forma, $this->_Formula, $this->_Dosis );
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
	 		$this->_idMedicamento = $this->formatear($registro->Id_Medicamento, "Entero");
	 		$this->_Nomreg = $this->formatear($registro->Nomreg, "Cadena");
		 	$this->_Nomcien = $this->formatear($registro->Nomcien, "Cadena");
		 	$this->_Formula = $this->formatear($registro->Formula, "Cadena");
		 	$this->_Forma = $this->formatear($registro->Forma, "Cadena");
		 	$this->_Dosis = $this->formatear($registro->Dosis, "Entero");
	 		$this->_sql = sprintf("UPDATE medicamentos SET Nomcien=%s, Nomreg=%s, Forma=%s, Formula=%s, Dosis=%s WHERE Id_Medicamento=%s LIMIT 1;",
	 		$this->_Nomcien, $this->_Nomreg, $this->_Forma, $this->_Formula, $this->_Dosis , $this->_idMedicamento);
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
	 		$this->_idMedicamento = $this->formatear($registro->Id_Medicamento, "Entero");
	 		$this->_sql = sprintf("DELETE FROM medicamentos WHERE Id_Medicamento=%s LIMIT 1;", $this->_idMedicamento);
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
	 			$_nombre = 'lista_Medicamentos.pdf';
	 			$_titulo = '   Listado de Medicamentos';
	 			break;
	 		case 'buscar':
	 			// busqueda.
	 			$_resultSet = $this->buscar($criterio, $columna, 0);
	 			$_nombre = 'busqueda_Medicamentos.pdf';
	 			$_titulo = 'Busqueda de Medicamentos por "'.$criterio.'"';
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
	 	$this->_reportePDF->MultiCell(13, 0, 'Clave', 0, 'R', 0, 0, '', '', true, 0, false, true, 40, 'T');
	 	$this->_reportePDF->Cell(1);
	 	$this->_reportePDF->MultiCell(40, 0, 'Nombre', 0, 'L', 0, 0, '', '', true, 0, false, true, 40, 'T');
	 	$this->_reportePDF->Cell(1);
	 	$this->_reportePDF->MultiCell(90, 0, 'Formula', 0, 'L', 0, 0, '', '', true, 0, false, true, 40, 'T');
	 	$this->_reportePDF->Cell(1);
	 	$this->_reportePDF->MultiCell(30, 0, 'Forma', 0, 'L', 0, 0, '', '', true, 0, false, true, 40, 'T');
	 	$this->_reportePDF->Cell(1);
	 	$this->_reportePDF->MultiCell(20, 0, 'Dosis/Mg.', 0, 'L', 0, 1, '', '', true, 0, false, true, 40, 'T');
	 	$this->_reportePDF->Ln(1);

	 	$this->_reportePDF->SetFont('dejavusans', '', 9);
	 	$this->_reportePDF->SetFillColor(38, 154, 188);
	 	while($_registro = $_resultSet->fetch_assoc()) {
	 		$rellenar = ((++$i) % 2);
	 		$this->_reportePDF->MultiCell(13, 0, utf8_encode($_registro['Id_Medicamento']), 0, 'R', $rellenar, 0, '', '', true, 0, false, true, 40, 'T');
	 		$this->_reportePDF->Cell(1);
	 		$this->_reportePDF->MultiCell(40, 0, utf8_encode($_registro['Nomreg']), 0, 'L', $rellenar, 0, '', '', true, 0, false, true, 40, 'T');
	 		$this->_reportePDF->Cell(1);
	 		$this->_reportePDF->MultiCell(90, 0, utf8_encode($_registro['Formula']), 0, 'L', $rellenar, 0, '', '', true, 0, false, true, 40, 'T');
	 		$this->_reportePDF->Cell(1);
	 		$this->_reportePDF->MultiCell(30, 0, utf8_encode($_registro['Forma']), 0, 'L', $rellenar, 0, '', '', true, 0, false, true, 40, 'T');
	 		$this->_reportePDF->Cell(1);
	 		$this->_reportePDF->MultiCell(20, 0, utf8_encode($_registro['Dosis']), 0, 'L', $rellenar, 1, '', '', true, 0, false, true, 40, 'T');
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