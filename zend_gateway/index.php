<?php
$json = file_get_contents('php://input');
$json = (json_decode($json, true));
$clase = trim($json['clase']);
if(strlen($clase) > 0) {
	$nombreClase = strval($clase);
	$nombreArchivo = 'servicios/' . mb_strtolower($clase) . '.php';
} else {
	echo "Sin Clase"; exit;
}

require_once 'globales.php';
require_once $nombreArchivo;
require_once 'Zend/Json/Server.php'; // Version 1.x

$servidor = new Zend_JSON_Server();
$servidor->setProduction(false);
$servidor->setClass($nombreClase);

header('Content-Type: application/json');
$respuesta = $servidor->handle();
?>