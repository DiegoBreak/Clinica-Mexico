<?php
require_once 'base.php';
require_once 'peticiones.php';

/**
 * Clase Paquete, para brindar funcionalidades para Accesar a la Aplicacion.
 */

final Class Cita extends Base implements peticiones
{
	/**
	 * Atributo privado para el query de SQL
	 * @access private
	 * @var string
	 */
	private $_sql = null;
	
	/**
	 * Atributo privado para el ID del cita	 * @access private
	 * @var int
	 */
	private $_idCita = null;

	private $_idPaciente = null;
	
	private $_idDoctor = null;
	
	private $_dia= null;

	private $_hora = null;

	private $_estatus = null;
	
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
	private $_columnas = array('','Id_Cita','Dia','Hora','Id_Paciente','Id_Doctor','Estatus');
	
	/**
	 * Constructor de la Clase citas, para invocar el Constructor de la Clase heredada
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
	 * Funcion para listar los Registros de la tabla citas
	 * @access public
	 * @param int Se utiliza para establecer el tipo de devolucion.
	 * @return object El juego de Resultados (puede ser un json, array, o resulset).
	 */
	public function listar($tipo)
	 {
	 	$this->_tipo = intval($tipo);
	 	$this->_sql = "SELECT ci.*, CONCAT(pa.Nombre,' ',pa.Apellidop,' ' ,pa.Apellidom) as nombrep, CONCAT(do.Nombre,' ',do.Apellidop,' ' ,do.Apellidom) as nombred from cita ci join paciente pa on (ci.Id_Paciente=pa.Id_Paciente) join doctor do on (ci.Id_Doctor=do.Id_Doctor) order by ci.Id_Cita;";
	 	return $this->sentenciaSQL($this->_sql,$this->_tipo);
	 }

	  /**
	 *Funcion para listar los registros de la tabla cuentahabiente dentro de un combo.
	 *@access public
	 *@param int se utiliza para establecer el tipo de devolucion.
	 *@return object El juego de Resultados (puede ser json, array, o resultset).
	 */
	 public function comboPaciente($tipo)
	 {

	 	$this->_tipo=intval($tipo);
	 	$this->_sql="SELECT Id_Paciente AS data, Nombre AS labelC, Apellidop AS labelA, Apellidom AS labelB FROM paciente WHERE Id_Paciente>=1 ORDER BY data ASC";
	 	return $this->sentenciaSQL($this->_sql, $this->_tipo);
	 }

	  /**
	 *Funcion para listar los registros de la tabla cuentahabiente dentro de un combo.
	 *@access public
	 *@param int se utiliza para establecer el tipo de devolucion.
	 *@return object El juego de Resultados (puede ser json, array, o resultset).
	 */
	 public function comboDoctor($tipo)
	 {

	 	$this->_tipo=intval($tipo);
	 	$this->_sql="SELECT Id_Doctor AS data, Nombre AS labelC, Apellidop AS labelA, Apellidom AS labelB FROM doctor WHERE Id_Doctor>=1 ORDER BY data ASC";
	 	return $this->sentenciaSQL($this->_sql, $this->_tipo);
	 }
	 
	 /**
	  * Funcion para buscar Registros en la tabla citas.
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
	 		$this->_idCita = $this->formatear($criterio, "CadenaBusqueda");
	 		$this->_idPaciente = $this->formatear($criterio, "CadenaBusqueda");
	 		$this->_idDoctor = $this->formatear($criterio, "CadenaBusqueda");
	 		$this->_sql = sprintf("SELECT * FROM cita WHERE (Id_Cita LIKE %s OR Id_Paciente LIKE %s OR Id_Doctor LIKE %s) ORDER BY Id_Cita ASC;",
	 		$this->_idCuenta, $this->_idMembresia);
	 	}else {
	 		$_columna = $this->_columnas[intval($columna)];
	 		$_criterio = $this->formatear($criterio, "CadenaBusqueda");
	 		$this->_sql = sprintf("SELECT * FROM cita WHERE %s LIKE %s ORDER BY Id_Cita ASC;",
	 		$_columna, $_criterio);
	 	}
	 	return $this->sentenciaSQL($this->_sql, $this->_tipo);
	 }
	 
	 /**
	  * Funcion para insertar un Registro en la tabla citas.
	  * @access public
	  * @param object Es el registro que vamos a insertar.
	  * @return int El ID del Registro insertado.
	  */
	 public function insertar($registro)
	 {
	 	if(is_array($registro)) {
	 		$registro = (object)$registro;
	 	}
		$this->_idPaciente = $this->formatear($registro->Id_Paciente, "Entero");
		$this->_idDoctor = $this->formatear($registro->Id_Doctor, "Entero");
		$this->_dia = $this->formatear($registro->Dia, "Cadena");
		$this->_hora = $this->formatear($registro->Hora, "Cadena");
		$this->_estatus = $this->formatear($registro->Estatus, "Cadena");

	 	$this->_sql = sprintf("INSERT INTO cita VALUES(null,%s, %s, %s, %s, %s);",
	 	$this->_dia, $this->_hora, $this->_idPaciente, $this->_idDoctor, $this->_estatus);
	 	return $this->sentenciaSQL($this->_sql, 4);
	 }
	 
	 /**
	  * Funcion para actualizar un Registro en la tabla citas.
	  * @access public
	  * @param object El registro a actualizarce.
	  * @return int El Numero de Registros afectados.
	  */
	 public function actualizar($registro)
	 {
	 	if(is_array($registro)) {
	 		$registro = (object)$registro;
	 	}
	 	$this->_idCita = $this->formatear($registro->Id_Cita, "Entero");
		$this->_idPaciente = $this->formatear($registro->Id_Paciente, "Entero");
		$this->_idDoctor = $this->formatear($registro->Id_Doctor, "Entero");
		$this->_dia = $this->formatear($registro->Dia, "Cadena");
		$this->_hora = $this->formatear($registro->Hora, "Cadena");
		$this->_estatus = $this->formatear($registro->Estatus, "Cadena");

		$this->_sql = sprintf("UPDATE cita SET Dia=%s, Hora=%s, Id_Paciente=%s, Id_Doctor=%s, Estatus=%s WHERE Id_Cita=%s LIMIT 1;",
		$this->_dia, $this->_hora, $this->_idPaciente, $this->_idDoctor, $this->_estatus, $this->_idCita);
		return $this->sentenciaSQL($this->_sql, 5);
	 }
	 
	 /**
	  * Funcion para eliminar un Registro en la tabla citas.
	  * @access public
	  * @param object El registro a eliminarse.
	  * @return int El Numro de Registros afectados.
	  */
	 public function borrar($registro)
	 {
	 	if(is_array($registro)) {
	 		$registro = (object)$registro;
	 	}
	 		$this->_idCita = $this->formatear($registro->Id_Cita, "Entero");
	 		$this->_sql = sprintf("DELETE FROM cita WHERE Id_Cita=%s LIMIT 1;", $this->_idCita);
	 		return $this->sentenciaSQL($this->_sql, 5);
	 		 
	 }

	 /**
	  * Funcion para crear un Reporte PDF sencillo de la tabla citas.
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
	 			$_nombre = 'lista_Cita.pdf';
	 			$_titulo = '   Listado de Citas';
	 			break;
	 		case 'buscar':
	 			// busqueda.
	 			$_resultSet = $this->buscar($criterio, $columna, 0);
	 			$_nombre = 'busqueda_Citas.pdf';
	 			$_titulo = 'Busqueda de Cita por "'.$criterio.'"';
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
	 	$this->_reportePDF->MultiCell(10, 0, 'ID', 0, 'R', 0, 0, '', '', true, 0, false, true, 40, 'T');
	 	$this->_reportePDF->Cell(1);
	 	$this->_reportePDF->MultiCell(45, 0, 'Paciente', 0, 'L', 0, 0, '', '', true, 0, false, true, 40, 'T');
	 	$this->_reportePDF->Cell(1);
	 	$this->_reportePDF->MultiCell(45, 0, 'Doctor', 0, 'L', 0, 0, '', '', true, 0, false, true, 40, 'T');
	 	$this->_reportePDF->Cell(1);
	 	$this->_reportePDF->MultiCell(30, 0, 'Dia', 0, 'L', 0, 0, '', '', true, 0, false, true, 40, 'T');
	 	$this->_reportePDF->Cell(1);
	 	$this->_reportePDF->MultiCell(30, 0, 'Hora', 0, 'L', 0, 0, '', '', true, 0, false, true, 40, 'T');
	 	$this->_reportePDF->Cell(1);
	 	$this->_reportePDF->MultiCell(30, 0, 'Estatus', 0, 'L', 0, 1, '', '', true, 0, false, true, 40, 'T');
	 	$this->_reportePDF->Ln(1);

	 	$this->_reportePDF->SetFont('dejavusans', '', 9);
	 	$this->_reportePDF->SetFillColor(38, 154, 188);
	 	while($_registro = $_resultSet->fetch_assoc()) {
	 		$rellenar = ((++$i) % 2);
	 		$this->_reportePDF->MultiCell(10, 0, utf8_encode($_registro['Id_Cita']), 0, 'R', $rellenar, 0, '', '', true, 0, false, true, 40, 'T');
	 		$this->_reportePDF->Cell(1);
	 		$this->_reportePDF->MultiCell(45, 0, utf8_encode($_registro['Id_Paciente']), 0, 'L', $rellenar, 0, '', '', true, 0, false, true, 40, 'T');
	 		$this->_reportePDF->Cell(1);
	 		$this->_reportePDF->MultiCell(45, 0, utf8_encode($_registro['Id_Doctor']), 0, 'L', $rellenar, 0, '', '', true, 0, false, true, 40, 'T');
	 		$this->_reportePDF->Cell(1);
	 		$this->_reportePDF->MultiCell(30, 0, utf8_encode($_registro['Dia']), 0, 'L', $rellenar, 0, '', '', true, 0, false, true, 40, 'T');
	 		$this->_reportePDF->Cell(1);
	 		$this->_reportePDF->MultiCell(30, 0, utf8_encode($_registro['Hora']), 0, 'L', $rellenar, 0, '', '', true, 0, false, true, 40, 'T');
	 		$this->_reportePDF->Cell(1);
	 		$this->_reportePDF->MultiCell(30, 0, utf8_encode($_registro['Estatus']), 0, 'L', $rellenar, 1, '', '', true, 0, false, true, 40, 'T');
	 		$this->_reportePDF->Ln(1);
	 	}
	 	$this->_reportePDF->Ln(5);
	 	$this->_reportePDF->SetFont('dejavusans', '', 9);
	 	$this->_reportePDF->MultiCell(0, 0, utf8_encode('Este Reporte contiene ' .$_resultSet->num_rows.' Cita(s).'), 0, 'L', 0, 1, '', '', true, 0, false, true,
	 	40, 'T');
	 	$this->_reportePDF->Output('../pdfs/' .$_nombre, 'F');
	 	return $_nombre;
	 }
	 
	 /**
	  * El destructor de la Clase citas.
	  * @access public
	  * @return void
	  */
	 public function __destruct()
	 {
	 	error_reporting(E_ALL);
	 }
}