<?php
require_once '../tcpdf/tcpdf.php';


Class FabricaPDF extends TCPDF
{

	/**
	 * Atributo privado para el margen Inferior
	 * @access private
	 * @var string
	 */
	private $_margenInferior = null;

	/**
	 * Atributo privado para el margen Superior
	 * @access private
	 * @var string
	 */
	private $_margenSuperior = null;

	/**
	 * Atributo privado para el margen Izquierdo
	 * @access private
	 * @var string
	 */
	private $_margenIzquierdo = null;

	/**
	 * Atributo privado para el margen Derecho
	 * @access private
	 * @var string
	 */
	private $_margenDerecho = null;

	/**
	 * Atributo privado para el titulo
	 * @access private
	 * @var string
	 */
	private $_titulo = null;

	/**
	 * Funcion que sirve para colocar Atributos del PDF:
	 * @access public
	 * @param object El PDF para colocarle los atributos.
	 * @param string El titulo del PDF.
	 * @param string El autor del PDF.
	 * @return void
	 */
	public function colocarCaracteristicas($elPDF, $titulo, $autor)
	{
		$elPDF->SetCreator("www.escolaris.mx");
		$elPDF->SetTitle($titulo);
		$elPDF->SetAuthor($autor);
		$this->_titulo = $titulo;
	}

	/**
	 * Funcion para colocar margenes y el salto de pagina del PDF:
	 * @access public
	 * @param object El PDF para colocarle los atributos.
	 * @param int El Margen superior del PDF.
	 * @param int El Margen inferior del PDF.
	 * @param int El Margen izquierdo del PDF.
	 * @param int El Margen derecho del PDF.
	 * @param int El Margen de la cabecera del PDF.
	 * @param int El Margen del pie de pagina del PDF.
	 * @param boolean Indicar si se hara salto automatico de pagina del PDF por default:TRUE.
	 * @return void
	 */
	public function colocarMargenes($elPDF, $superior, $inferior, $izquierda, $derecha, $cabecera, $pie, $salto=true)
	{
		$this->_margenInferior = -($inferior); // Negativo para "subir" y comenzar a escribir...
		$this->_margenSuperior = $cabecera;
		$this->_margenIzquierdo = $izquierda;
		$elPDF->SetMargins($izquierda, $superior, $derecha);
		$elPDF->SetHeaderMargin(0);
		$elPDF->SetFooterMargin($pie);
		$elPDF->SetAutoPageBreak($salto, $inferior + 10); // del margen inferiror agregamos 10 "hacia arriba" del mismo para el "footer".
	}

	/**
	 * Funcion Header que coloca las cabeceras a los reportes.
	 * @access public
	 * @return void
	 */
	public function Header() {
		// 216 mm aprox de Ancho tamaño carta...
		$this->SetFont('dejavusans', 'B', 17);
		$html='<img src="../imagenes/logo.jpg" alt="logo" width="1000"/><br/><span style="text-align:center;">'.$this->_titulo.'</span><hr/>';
	 	$this->writeHTML($html, true, false, true, false, '');
	 	
	 	
	}

	/**
	 * Funcion Footer que coloca el pie de pagina a los reportes.
	 * @access public
	 * @return void
	 */
	public function Footer() {
		$this->SetY($this->_margenInferior); // Subir el cursor -equis- mm desde abajo
		$_paginado ='Página ' . $this->getAliasNumPage() . ' de ' . $this->getAliasNbPages();
		$this->SetFont('courier', 'B', 7);
		$this->Cell(100, 7, $_paginado, 0, 0, 'L', 0);
		$this->Cell(100, 7, HOY . ' ' . HORA, 0, 1, 'R', 0);
	}

}