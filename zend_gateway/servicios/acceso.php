<?php
require_once 'base.php';

final Class Acceso extends Base
{

	/**
	 * Atributo privado para el query de SQL.
	 * @access private
	 * @var string
	 */
	private $_sql = null;
	private $_usuario=null;
	private $_metodo=null;
	private $_contrasena=null;
	private $_id=0;
	private $_nombre=null;
	
	public function verificarAcceso($usuario, $contrasena,$metodo)
	{
		$this->_metodo=$metodo;
		if(isset($_SESSION["idUsuario"]))
		{
			throw new Exception('El Usuario ya tiene una Sesión Abierta');
			return;
		}
		$usuario=strtolower($usuario);
		$contrasena=strtolower($contrasena);
		$usuario = ereg_replace( "([ ]+)", "", $usuario );
		$this->_usuario=$this->formatear($usuario,"Encriptalo");
		$this->_contrasena=$this->formatear($contrasena,"Encriptalo");

		if($this->_metodo==0)
		{
			$this->_sql=sprintf("SELECT Id_Administrador, Nombre FROM administrador WHERE (Usuario=%s AND Password=%s);",
			$this->_usuario, $this->_contrasena);
			$this->_id=$this->sentenciaSQL($this->_sql,8,'Id_Administrador');
			$this->_nombre=$this->sentenciaSQL($this->_sql,8,'Nombre');
		}
		else if($this->_metodo==1)
		{
			$this->_sql=sprintf("SELECT Id_Doctor, CONCAT(Nombre,' ',Apellidop)AS Nombre FROM doctor WHERE (Usuario=%s AND Password=%s);",
			$this->_usuario, $this->_contrasena);
			$this->_id=$this->sentenciaSQL($this->_sql,8,'Id_Doctor');
			$this->_nombre=$this->sentenciaSQL($this->_sql,8,'Nombre');
		
		}
		
		if($this->_id>0)
		{
			$_SESSION["idUsuario"]=$this->_id;
			$_SESSION["idNombre"]=$this->_nombre;
			$_SESSION["ipUsuario"]=$_SERVER['REMOTE_ADDR'];
			$_SESSION["tokenUsuario"]=md5(sha1(session_id().$_SERVER['REMOTE_ADDR'].$_SESSION["idUsuario"]));
			return sha1(md5(microtime()));
		}
		else
		{
			if(PRODUCCION)
			{
				throw new Exception("Error en sus permisos del servidor");
			}
			else
			{
				throw new Exception("Error en sus permisos del servidor.\n\r".$this->_sql);
			}
			return;
		}
	}

	public function recogerDatos($metodo)
	{
		$this->_metodo=$metodo;
		if($this->_metodo==1)
		{
			$this->_sql=sprintf("SELECT * from doctor where Id_Doctor=".$_SESSION["idUsuario"]);
			return  $this->sentenciaSQL($this->_sql,2);
		}
		else if($this->_metodo==0)
		{
			$this->_sql=sprintf("SELECT * from administrador where Id_Administrador=".$_SESSION["idUsuario"]);
			return  $this->sentenciaSQL($this->_sql,2);
		}
	}
	public function terminarSesion()
	{
		$_SESSION["idUsuario"]=null;
		$_SESSION["ipUsuario"]=null;
		$_SESSION["tokenUsuario"]=null;
		unset($_SESSION["idUsuario"]);
		unset($_SESSION["ipUsuario"]);
		unset($_SESSION["tokenUsuario"]);
		session_unset();
		return sha1(md5(microtime()));
	}
	
}