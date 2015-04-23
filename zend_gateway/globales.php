<?php
date_default_timezone_set('America/Mexico_City');
/*
define('SERVIDOR', '');
define('USUARIO', '');
define('CONTRASENA', '');
define('BASE', '');
define('PRODUCCION', true);
*/

define('SERVIDOR', '127.0.0.1:8080');
define('USUARIO', 'root');
define('CONTRASENA', '');
define('BASE', 'clinicamexico_bd');
define('PRODUCCION', false);


define('HOY', date('Y') . "-" . date('m') . "-" . date('d'));
define('HORA', date('H') . ":" . date('i') . ":" . date('s'));

define('RUTA_PDFS', '../reportespdf/');
define('RUTA_IMAGENES', '../../imagenes/');
?>