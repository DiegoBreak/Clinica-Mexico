<?php
require_once 'base.php';
require_once 'peticiones.php';

/**
 * Clase Paises, para brindar funcionalidades para Accesar a la Aplicacion.
 */

final Class Expediente extends Base implements peticiones
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
	private $_idExpediente = null;

	private $_idCita = null;

	private $_diagnostico = null;
	
	private $_receta = null;

	private $_indicaciones = null;

	private $_fecha = null;
	
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
	private $_columnas = array('','Expediente','Id Cita','Paciente','Fecha');
	
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
	 *Funcion para listar los registros de la tabla cuentahabiente dentro de un combo.
	 *@access public
	 *@param int se utiliza para establecer el tipo de devolucion.
	 *@return object El juego de Resultados (puede ser json, array, o resultset).
	 */
	
	public function comboCita($tipo)
	 {

	 	$this->_tipo=intval($tipo);
	 	$this->_sql="SELECT c.Id_Cita as dataa, p.Id_Paciente as idp, p.nombre as nom, p.Apellidop as app, p.Apellidom as apm from cita c join paciente p on(c.Id_Paciente=p.Id_Paciente) where c.Id_Cita>0 and dia=date_format(now(),'%Y-%m-%d') order by c.Id_Cita;";
	 	return $this->sentenciaSQL($this->_sql, $this->_tipo);
	 }
	 public function comboCita2($tipo)
	 {

	 	$this->_tipo=intval($tipo);
	 	$this->_sql="SELECT c.Id_Cita as dataa, p.Id_Paciente as idp, p.nombre as nom, p.Apellidop as app, p.Apellidom as apm from cita c join paciente p on(c.Id_Paciente=p.Id_Paciente) where c.Id_Cita>0 order by c.Id_Cita;";
	 	return $this->sentenciaSQL($this->_sql, $this->_tipo);
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
	 	$this->_sql = "SELECT ex.*, CONCAT(pa.Nombre,' ',pa.Apellidop,' ',pa.Apellidom) as nombrep, CONCAT(do.Nombre, ' ',do.Apellidop, ' ',do.Apellidom) as nombred FROM expediente ex join cita ci on (ex.Id_Cita=ci.Id_Cita) join paciente pa on (ci.Id_Paciente=pa.Id_Paciente)  join Doctor do on (ci.Id_Doctor=do.Id_Doctor) WHERE ex.Id_Expediente>=1 ORDER BY ex.Id_Expediente ASC;";
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
	 		$this->_idExpediente = $this->formatear($criterio, "CadenaBusqueda");
	 		$this->_idCita = $this->formatear($criterio, "CadenaBusqueda");
	 		$this->_fecha = $this->formatear($criterio, "CadenaBusqueda");

	 		$this->_sql = sprintf("SELECT * FROM expediente WHERE (Id_Expediente LIKE %s OR Id_Cita LIKE %s OR Fecha LIKE %s )  ORDER BY Id_Expediente ASC;",
	 		$this->_idExpediente, $this->_idCita, $this->_fecha);
	 	}
	 	else if($columna==3) 
	 	{
	 		$this->_idCita = $this->formatear($criterio, "CadenaBusqueda");
	 		$this->_idExpediente = $this->formatear($criterio, "CadenaBusqueda");

	 		$this->_sql = sprintf("SELECT ex.*, CONCAT(pa.Nombre,' ',pa.Apellidop,' ',pa.Apellidom) as nombrep, CONCAT(do.Nombre, ' ',do.Apellidop, ' ',do.Apellidom) as nombred FROM expediente ex join cita ci on (ex.Id_Cita=ci.Id_Cita) join paciente pa on (ci.Id_Paciente=pa.Id_Paciente)  join Doctor do on (ci.Id_Doctor=do.Id_Doctor) WHERE (pa.Id_Paciente LIKE %s OR CONCAT(pa.Nombre,' ',pa.Apellidop,' ',pa.Apellidom) LIKE %s )ORDER BY ex.Id_Expediente ASC;",
	 		$this->_idCita,$this->_idExpediente);
	 	
	 	}else {
	 		$_columna = $this->_columnas[intval($columna)];
	 		$_criterio = $this->formatear($criterio, "CadenaBusqueda");
	 		$this->_sql = sprintf("SELECT * FROM expediente WHERE %s LIKE %s ORDER BY Id_Cita ASC;",
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
	 	$this->_idCita = $this->formatear($registro->Id_Cita, "Entero");
	 	$this->_diagnostico = $this->formatear($registro->Diagnostico, "Cadena");
	 	$this->_receta = $this->formatear($registro->Receta, "Cadena");
	 	$this->_indicaciones = $this->formatear($registro->Indicaciones, "Cadena");
	 	
	 	$this->_sql = sprintf("INSERT INTO expediente VALUES(null,%s,now(), %s, %s,%s);",
	 	$this->_idCita,$this->_diagnostico, $this->_receta, $this->_indicaciones);
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
	 	$this->_idExpediente=$this->formatear($registro->Id_Expediente, "Entero");
	 	$this->_idCita=$this->formatear($registro->Id_Cita, "Entero");
	 	$this->_diagnostico = $this->formatear($registro->Diagnostico, "Cadena");
	 	$this->_receta = $this->formatear($registro->Receta, "Cadena");
	 	$this->_indicaciones = $this->formatear($registro->Indicaciones, "Cadena");

	 	$this->_sql = sprintf("UPDATE expediente SET  Id_Cita=%s, Diagnostico=%s, Receta=%s, Indicaciones=%s WHERE Id_Expediente=%s LIMIT 1;",
	 	$this->_idCita,$this->_diagnostico, $this->_receta, $this->_indicaciones, $this->_idExpediente);
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
	 		$this->_idCita = $this->formatear($registro->Id_Cita, "Entero");
	 		$this->_sql = sprintf("DELETE FROM expediente WHERE Id_Cita=%s LIMIT 1;", $this->_idCita);
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
	 			$_nombre = 'lista_Expediente.pdf';
	 			$_titulo = '   Listado de Expedientes';
	 			break;
	 		case 'buscar':
	 			// busqueda.
	 			$_resultSet = $this->buscar($criterio, $columna, 0);
	 			$_nombre = 'busqueda_Expediente.pdf';
	 			$_titulo = 'Busqueda de Expediente por "'.$criterio.'"';
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
	 	$this->_reportePDF->MultiCell(25, 0, 'Expediente', 0, 'R', 0, 0, '', '', true, 0, false, true, 40, 'T');
	 	$this->_reportePDF->Cell(1);
	 	$this->_reportePDF->MultiCell(25, 0, 'ID cita', 0, 'L', 0, 0, '', '', true, 0, false, true, 40, 'T');
	 	$this->_reportePDF->Cell(1);
	 	$this->_reportePDF->MultiCell(60, 0, 'Paciente', 0, 'L', 0, 0, '', '', true, 0, false, true, 40, 'T');
	 	$this->_reportePDF->Cell(1);
	 	$this->_reportePDF->MultiCell(60, 0, 'Doctor', 0, 'L', 0, 0, '', '', true, 0, false, true, 40, 'T');
	 	$this->_reportePDF->Cell(1);
	 	$this->_reportePDF->MultiCell(25, 0, 'Fecha', 0, 'L', 0, 1, '', '', true, 0, false, true, 40, 'T');
	 	$this->_reportePDF->Ln(5);

	 	$this->_reportePDF->SetFont('dejavusans', '', 9);
	 	$this->_reportePDF->SetFillColor(38, 154, 188);
	 	while($_registro = $_resultSet->fetch_assoc()) {
	 		$rellenar = ((++$i) % 2);
	 		$this->_reportePDF->MultiCell(25, 0, utf8_encode($_registro['Id_Expediente']), 0, 'R', $rellenar, 0, '', '', true, 0, false, true, 40, 'T');
	 		$this->_reportePDF->Cell(1);
	 		$this->_reportePDF->MultiCell(25, 0, utf8_encode($_registro['Id_Cita']), 0, 'L', $rellenar, 0, '', '', true, 0, false, true, 40, 'T');
	 		$this->_reportePDF->Cell(1);
	 		$this->_reportePDF->MultiCell(60, 0, utf8_encode($_registro['nombrep']), 0, 'L', $rellenar, 0, '', '', true, 0, false, true, 40, 'T');
	 		$this->_reportePDF->Cell(1);
	 		$this->_reportePDF->MultiCell(60, 0, utf8_encode($_registro['nombred']), 0, 'L', $rellenar, 0, '', '', true, 0, false, true, 40, 'T');
	 		$this->_reportePDF->Cell(1);
	 		$this->_reportePDF->MultiCell(25, 0, utf8_encode($_registro['Fecha']), 0, 'L', $rellenar, 1, '', '', true, 0, false, true, 40, 'T');
	 		$this->_reportePDF->Ln(1);
	 	}
	 	$this->_reportePDF->Ln(5);
	 	$this->_reportePDF->SetFont('dejavusans', '', 9);
	 	$this->_reportePDF->MultiCell(0, 0, utf8_encode('Este Reporte contiene ' .$_resultSet->num_rows.' Expediente(s).'), 0, 'L', 0, 1, '', '', true, 0, false, true,
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