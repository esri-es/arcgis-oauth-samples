<?php
session_start();
require_once('arcgis-oauth.php');

$oAuth = new Authenticator(array(
  'config' => '../config.json',
  'redirect_uri' => 'login.php',
  'output' => 'credentials.json'
));
?>
