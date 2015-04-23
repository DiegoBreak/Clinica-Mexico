<?php
require_once 'base.php';
require_once 'peticiones.php';

/**
 * Clase Paises, para brindar funcionalidades para Accesar a la Aplicacion.
 */

final Class PacientePaquete extends Base implements peticiones
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
	private $_idPaciente = null;

	private $_idPP = null;
	
	private $_idPaquete = null;

	private $_fecha = null;

	private $_hora = null;
	
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
	private $_columnas = array('','ClavePP','Id_Paciente','Clave_Paquete');
	
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
	 	/*$this->_sql = "SELECT paciente.*, cuentahabiente.nombre AS nombre_Cuenta FROM paciente, cuentahabiente WHERE Id_Paciente>=1 AND paciente.Id_Cuenta=cuentahabiente.Id_Cuenta ORDER BY paciente.Id_Paciente ASC;";
	 	*/
	 	$this->_sql = "SELECT pp.*, p.Id_Paciente as paciente, p.Nombre as nombre, p.Apellidop as ap1, p.Apellidom as ap2, pa.nombre AS nombre_Paquete FROM paciente_paquete pp join paciente p on (pp.Id_Paciente=p.Id_Paciente) join paquetes pa on (pp.Clave_Paquete=pa.Clave_Paquete) WHERE pp.ClavePP>=1 ORDER BY pp.ClavePP ASC";
	 	
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
	 	$this->_sql="SELECT P.Id_Cuenta, p.Id_Paciente AS data, p.Nombre AS labelB, p.Apellidop AS labelC, p.Apellidom AS labelA FROM Paciente p join Cuentahabiente c on (p.Id_Cuenta=c.Id_Cuenta) 	join Contrato o on (o.Id_Cuenta=c.Id_Cuenta) WHERE p.Id_Paciente>=1 AND FechaFin>date_format(now(),'%Y-%m-%d')ORDER BY data ASC;";
	 	
	 	return $this->sentenciaSQL($this->_sql, $this->_tipo);
	 }

	 public function comboPaquete($tipo)
	 {

	 	$this->_tipo=intval($tipo);
	 	$this->_sql="SELECT Clave_Paquete AS data, Nombre AS labelA FROM paquetes WHERE Clave_Paquete>=1 ORDER BY data ASC";
	 	
	 	return $this->sentenciaSQL($this->_sql, $this->_tipo);
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
	 		$this->_idPP = $this->formatear($criterio, "CadenaBusqueda");
	 		$this->_idPaciente = $this->formatear($criterio, "CadenaBusqueda");
	 		$this->_idPaquete = $this->formatear($criterio, "CadenaBusqueda");

	 		$this->_sql = sprintf("SELECT pp.*, p.Id_Paciente as paciente, p.Nombre as nombre, p.Apellidop as ap1, p.Apellidom as ap2, pa.nombre AS nombre_Paquete FROM paciente_paquete pp join paciente p on (pp.Id_Paciente=p.Id_Paciente) join paquetes pa on (pp.Clave_Paquete=pa.Clave_Paquete) WHERE pp.ClavePP LIKE %s OR pp.Id_Paciente LIKE %s OR pp.Clave_Paquete LIKE %s ORDER BY pp.ClavePP ASC;",
	 		$this->_idPP,$this->_idPaciente, $this->_idPaquete);
	 	}
	 	else 
	 	{
	 		$_columna = $this->_columnas[intval($columna)];
	 		$_criterio = $this->formatear($criterio, "CadenaBusqueda");
	 		$this->_sql = sprintf("SELECT pp.*, p.Id_Paciente as paciente, p.Nombre as nombre, p.Apellidop as ap1, p.Apellidom as ap2, pa.nombre AS nombre_Paquete FROM paciente_paquete pp join paciente p on (pp.Id_Paciente=p.Id_Paciente) join paquetes pa on (pp.Clave_Paquete=pa.Clave_Paquete) WHERE ".'pp.'."%s LIKE %s ORDER BY ClavePP ASC;",
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
	 	$this->_idPaciente=$this->formatear($registro->Id_Paciente, "Entero");
	 	$this->_idPaquete = $this->formatear($registro->Clave_Paquete, "Entero");
	 	$this->_fecha = $this->formatear($registro->Fecha, "Cadena");
	 	$this->_hora = $this->formatear($registro->Hora, "Cadena");
	 	
	 	$this->_sql = sprintf("INSERT INTO paciente_paquete VALUES(null, %s, %s, %s, %s);",
	 	$this->_fecha, $this->_hora, $this->_idPaquete, $this->_idPaciente );
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
	 	$this->_idPP = $this->formatear($registro->ClavePP, "Entero");
	 	$this->_idPaciente=$this->formatear($registro->Id_Paciente, "Entero");
	 	$this->_idPaquete = $this->formatear($registro->Clave_Paquete, "Entero");
	 	$this->_fecha = $this->formatear($registro->Fecha, "Cadena");
	 	$this->_hora = $this->formatear($registro->Hora, "Cadena");

	 	$this->_sql = sprintf("UPDATE paciente_paquete SET Fecha=%s, Hora=%s, Clave_Paquete=%s, Id_Paciente=%s WHERE ClavePP=%s LIMIT 1;",
	 	$this->_fecha, $this->_hora, $this->_idPaquete, $this->_idPaciente, $this->_idPP);
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
	 		$this->_idPP = $this->formatear($registro->ClavePP, "Entero");
	 		$this->_sql = sprintf("DELETE FROM paciente_paquete WHERE ClavePP=%s LIMIT 1;", $this->_idPP);
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
	 			$_nombre = 'lista_PP.pdf';
	 			$_titulo = '   Listado de Pacientes';
	 			break;
	 		case 'buscar':
	 			// busqueda.
	 			$_resultSet = $this->buscar($criterio, $columna, 0);
	 			$_nombre = 'busqueda_PP.pdf';
	 			$_titulo = 'Busqueda de Pacientes por "'.$criterio.'"';
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
	 	$this->_reportePDF->MultiCell(15, 0, 'ID', 0, 'R', 0, 0, '', '', true, 0, false, true, 40, 'T');
	 	$this->_reportePDF->Cell(1);
	 	$this->_reportePDF->MultiCell(70, 0, 'Paciente', 0, 'L', 0, 0, '', '', true, 0, false, true, 40, 'T');
	 	$this->_reportePDF->Cell(1);
	 	$this->_reportePDF->MultiCell(40, 0, 'Paquete', 0, 'L', 0, 0, '', '', true, 0, false, true, 40, 'T');
	 	$this->_reportePDF->Cell(1);
	 	$this->_reportePDF->MultiCell(35, 0, 'Fecha', 0, 'L', 0, 0, '', '', true, 0, false, true, 40, 'T');
	 	$this->_reportePDF->Cell(1);
	 	$this->_reportePDF->MultiCell(35, 0, 'Hora', 0, 'L', 0, 1, '', '', true, 0, false, true, 40, 'T');
	 	$this->_reportePDF->Ln(5);

	 	$this->_reportePDF->SetFont('dejavusans', '', 9);
	 	$this->_reportePDF->SetFillColor(38, 154, 188);
	 	while($_registro = $_resultSet->fetch_assoc()) {
	 		$rellenar = ((++$i) % 2);
	 		$this->_reportePDF->MultiCell(15, 0, utf8_encode($_registro['ClavePP']), 0, 'R', $rellenar, 0, '', '', true, 0, false, true, 40, 'T');
	 		$this->_reportePDF->Cell(1);
	 		$this->_reportePDF->MultiCell(70, 0, utf8_encode($_registro['paciente'].'   '.$_registro['nombre'].' '.$_registro['ap1'].' '.$_registro['ap2']), 0, 'L', $rellenar, 0, '', '', true, 0, false, true, 40, 'T');
	 		$this->_reportePDF->Cell(1);
	 		$this->_reportePDF->MultiCell(40, 0, utf8_encode($_registro['nombre_Paquete']), 0, 'L', $rellenar, 0, '', '', true, 0, false, true, 40, 'T');
	 		$this->_reportePDF->Cell(1);
	 		$this->_reportePDF->MultiCell(35, 0, utf8_encode($_registro['Fecha']), 0, 'L', $rellenar, 0, '', '', true, 0, false, true, 40, 'T');
	 		$this->_reportePDF->Cell(1);
	 		$this->_reportePDF->MultiCell(35, 0, utf8_encode($_registro['Hora'].' hrs.'), 0, 'L', $rellenar, 1, '', '', true, 0, false, true, 40, 'T');
	 		$this->_reportePDF->Ln(1);
	 	}
	 	$this->_reportePDF->Ln(5);
	 	$this->_reportePDF->SetFont('dejavusans', '', 9);
	 	$this->_reportePDF->MultiCell(0, 0, utf8_encode('Este Reporte contiene ' .$_resultSet->num_rows.' Paciente Paquete(s).'), 0, 'L', 0, 1, '', '', true, 0, false, true,
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