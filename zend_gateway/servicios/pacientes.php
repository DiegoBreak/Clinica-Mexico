<?php
require_once 'base.php';
require_once 'peticiones.php';

/**
 * Clase Paises, para brindar funcionalidades para Accesar a la Aplicacion.
 */

final Class Pacientes extends Base implements peticiones
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

	private $_cuentahabiente = null;
	
	private $_nombrePaciente = null;

	private $_apellidoUno = null;

	private $_apellidoDos = null;

	private $_nacimientoPaciente = null;

	private $_sexoPaciente = null;
	
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
	private $_columnas = array('','Id_Paciente','Id_Cuenta','Apellidop','Apellidom');
	
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
	 	$this->_sql = "SELECT pa.*, CONCAT(cu.Nombre,' ',cu.Apellidop,' ',cu.Apellidom) AS nombreC FROM paciente pa join cuentahabiente cu on (pa.Id_Cuenta=cu.Id_Cuenta) WHERE pa.Id_Paciente>=1  ORDER BY pa.Id_Paciente ASC;";
	 	return $this->sentenciaSQL($this->_sql,$this->_tipo);
	 }
	 /**
	 *Funcion para listar los registros de la tabla cuentahabiente dentro de un combo.
	 *@access public
	 *@param int se utiliza para establecer el tipo de devolucion.
	 *@return object El juego de Resultados (puede ser json, array, o resultset).
	 */
	 public function comboCuenta($tipo)
	 {

	 	$this->_tipo=intval($tipo);
	 	$this->_sql="SELECT Id_Cuenta AS data, Nombre AS labelB, Apellidop AS labelC, Apellidom AS labelA FROM cuentahabiente WHERE Id_Cuenta>=1 ORDER BY data ASC";
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
	 		$this->_idPaciente = $this->formatear($criterio, "CadenaBusqueda");
	 		$this->_cuentahabiente = $this->formatear($criterio, "CadenaBusqueda");
	 		$this->_apellidoUno = $this->formatear($criterio, "CadenaBusqueda");
	 		$this->_apellidoDos = $this->formatear($criterio, "CadenaBusqueda");


	 		$this->_sql = sprintf("SELECT paciente.*, cuentahabiente.nombre AS nombre_Cuenta FROM paciente, cuentahabiente WHERE (paciente.Id_Paciente LIKE %s OR paciente.nombre LIKE %s OR paciente.apellidoP LIKE %s OR paciente.apellidoM LIKE %s OR paciente.nacimiento LIKE %s OR paciente.Id_Cuenta LIKE %s OR paciente.sexo LIKE %s) AND paciente.Id_Cuenta=cuentahabiente.Id_Cuenta ORDER BY paciente.Id_Paciente ASC;",
	 		$this->_idPaciente, $this->_cuentahabiente, $this->_apellidoUno, $this->_apellidoDos);
	 	}else {
	 		$_columna = $this->_columnas[intval($columna)];
	 		$_criterio = $this->formatear($criterio, "CadenaBusqueda");
	 		$this->_sql = sprintf("SELECT * FROM paciente WHERE %s LIKE %s ORDER BY Id_Paciente ASC;",
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
	 	$this->_cuentahabiente=$this->formatear($registro->Id_Cuenta, "Entero");
	 	$this->_nombrePaciente = $this->formatear($registro->Nombre, "Cadena");
	 	$this->_apellidoUno = $this->formatear($registro->Apellidop, "Cadena");
	 	$this->_apellidoDos = $this->formatear($registro->Apellidom, "Cadena");
	 	$this->_nacimientoPaciente = $this->formatear($registro->Fnacimiento, "Cadena");
	 	$this->_sexoPaciente = $this->formatear($registro->Sexo, "Cadena");
	 	$consulta="SELECT * FROM contrato WHERE Id_Cuenta=".$this->_cuentahabiente." AND FechaFin>date_format(now(),'%Y-%m-%d');";
	 		
	 	if($this->sentenciaSQL($consulta, 6)==1)
	 	{
	 		$consulta="SELECT p.Id_Cuenta, COUNT(p.Id_Paciente), m.Personas FROM Paciente p join Cuentahabiente c on (p.Id_Cuenta=c.Id_Cuenta) 	join Contrato o on (o.Id_Cuenta=c.Id_Cuenta) join Membresias m on (o.Id_Membresia=m.Id_Membresia) WHERE p.Id_Cuenta=".$this->_cuentahabiente." GROUP BY p.Id_Cuenta 	HAVING COUNT(p.Id_Paciente)<m.Personas ORDER BY p.Id_Cuenta;";
	 		if($this->sentenciaSQL($consulta, 6)==1)
	 		{
	 			$this->_sql = sprintf("INSERT INTO paciente VALUES(null, %s, %s, %s, %s, %s, %s);",
	 			$this->_nombrePaciente, $this->_apellidoUno, $this->_apellidoDos, $this->_nacimientoPaciente, $this->_sexoPaciente, $this->_cuentahabiente );
	 			return $this->sentenciaSQL($this->_sql, 4);
	 		}
	 		else
	 		{
	 			throw new Exception("El contrato del cuentahabiente con el ID ".$this->_cuentahabiente." ha llegado a su limite de personas");
	 		}
	 	}
	 	else
	 	{
	 		throw new Exception("El contrato del cuentahabiente con el ID ".$this->_cuentahabiente." ha Vencido");
	 	}
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
	 	$this->_idPaciente = $this->formatear($registro->Id_Paciente, "Entero");
	 	$this->_cuentahabiente=$this->formatear($registro->Id_Cuenta, "Entero");
	 	$this->_nombrePaciente = $this->formatear($registro->Nombre, "Cadena");
	 	$this->_apellidoUno = $this->formatear($registro->Apellidop, "Cadena");
	 	$this->_apellidoDos = $this->formatear($registro->Apellidom, "Cadena");
	 	$this->_nacimientoPaciente = $this->formatear($registro->Fnacimiento, "Cadena");
	 	$this->_sexoPaciente = $this->formatear($registro->Sexo, "Cadena");

	 	$this->_sql = sprintf("UPDATE paciente SET Nombre=%s, Apellidop=%s, ApellidoP=%s, Fnacimiento=%s, Sexo=%s, Id_Cuenta=%s WHERE Id_Paciente=%s LIMIT 1;",
	 	$this->_nombrePaciente, $this->_apellidoUno, $this->_apellidoDos, $this->_nacimientoPaciente, $this->_sexoPaciente, $this->_cuentahabiente, $this->_idPaciente );
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
	 		$this->_idPaciente = $this->formatear($registro->Id_Paciente, "Entero");
	 		$this->_sql = sprintf("DELETE FROM paciente WHERE Id_Paciente=%s LIMIT 1;", $this->_idPaciente);
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
	 			$_nombre = 'lista_Pacientes.pdf';
	 			$_titulo = '   Listado de Paciente';
	 			break;
	 		case 'buscar':
	 			// busqueda.
	 			$_resultSet = $this->buscar($criterio, $columna, 0);
	 			$_nombre = 'busqueda_Paciente.pdf';
	 			$_titulo = 'Busqueda de Paciente por "'.$criterio.'"';
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
	 	$this->_reportePDF->MultiCell(13, 0, 'ID', 0, 'R', 0, 0, '', '', true, 0, false, true, 40, 'T');
	 	$this->_reportePDF->Cell(1);
	 	$this->_reportePDF->MultiCell(20, 0, 'Cuentahabiente', 0, 'L', 0, 0, '', '', true, 0, false, true, 40, 'T');
	 	$this->_reportePDF->Cell(1);
	 	$this->_reportePDF->MultiCell(35, 0, 'Nombre', 0, 'L', 0, 0, '', '', true, 0, false, true, 40, 'T');
	 	$this->_reportePDF->Cell(1);
	 	$this->_reportePDF->MultiCell(35, 0, 'Apellido Paterno', 0, 'L', 0, 0, '', '', true, 0, false, true, 40, 'T');
	 	$this->_reportePDF->Cell(1);
	 	$this->_reportePDF->MultiCell(35, 0, 'Apellido Materno', 0, 'L', 0, 0, '', '', true, 0, false, true, 40, 'T');
	 	$this->_reportePDF->Cell(1);
	 	$this->_reportePDF->MultiCell(35, 0, 'Fecha de Nacimiento', 0, 'L', 0, 0, '', '', true, 0, false, true, 40, 'T');
	 	$this->_reportePDF->Cell(1);
	 	$this->_reportePDF->MultiCell(20, 0, 'Sexo', 0, 'L', 0, 1, '', '', true, 0, false, true, 40, 'T');
	 	$this->_reportePDF->Ln(5);

	 	$this->_reportePDF->SetFont('dejavusans', '', 9);
	 	$this->_reportePDF->SetFillColor(38, 154, 188);
	 	while($_registro = $_resultSet->fetch_assoc()) {
	 		$rellenar = ((++$i) % 2);
	 		$this->_reportePDF->MultiCell(13, 0, utf8_encode($_registro['Id_Paciente']), 0, 'R', $rellenar, 0, '', '', true, 0, false, true, 40, 'T');
	 		$this->_reportePDF->Cell(1);
	 		$this->_reportePDF->MultiCell(20, 0, utf8_encode($_registro['Id_Cuenta']), 0, 'L', $rellenar, 0, '', '', true, 0, false, true, 40, 'T');
	 		$this->_reportePDF->Cell(1);
	 		$this->_reportePDF->MultiCell(35, 0, utf8_encode($_registro['Nombre']), 0, 'L', $rellenar, 0, '', '', true, 0, false, true, 40, 'T');
	 		$this->_reportePDF->Cell(1);
	 		$this->_reportePDF->MultiCell(35, 0, utf8_encode($_registro['Apellidop']), 0, 'L', $rellenar, 0, '', '', true, 0, false, true, 40, 'T');
	 		$this->_reportePDF->Cell(1);
	 		$this->_reportePDF->MultiCell(35, 0, utf8_encode($_registro['Apellidom']), 0, 'L', $rellenar, 0, '', '', true, 0, false, true, 40, 'T');
	 		$this->_reportePDF->Cell(1);
	 		$this->_reportePDF->MultiCell(35, 0, utf8_encode($_registro['Fnacimiento']), 0, 'L', $rellenar, 0, '', '', true, 0, false, true, 40, 'T');
	 		$this->_reportePDF->Cell(1);
	 		$this->_reportePDF->MultiCell(20, 0, utf8_encode($_registro['Sexo']), 0, 'L', $rellenar, 1, '', '', true, 0, false, true, 40, 'T');
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