<?php

interface peticiones
{
	/**
	 * Funcion que podra listar Registros
	 * @param int El tipo de devolucion: (puede ser un json, array, o resultset).
	 */
	public function listar($tipo);
	
	/**
	 * Funcion que podra buscar Registro
	 * @param string Criterio de busqueda.
	 * @param string Columna(s) por las cuales se buscara.
	 * @param int El tipo de devolucion: (puede ser un json, array, o resultset).
	 */
	public function buscar($criterio, $columna, $tipo);
	
	/**
	 * Funcion que podra insertar Registro
	 * @param object El registro a insertar.
	 */
	public function insertar($registro);
	
	/**
	 * Funcion que podra actualizar Registro
	 * @param object El registro a actualizar
	 */
	public function actualizar($registro);
	
	/**
	 * Funcion que podra borrar Registro
	 * @param object El registro a eliminar.
	 */
	public function borrar($registro);

}