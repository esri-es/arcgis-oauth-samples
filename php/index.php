<?php
require_once('init.php');

if(!isset($_SESSION["username"])){
  header('Location: login.php');
}else{
  echo "Hola ".$_SESSION["username"]."!";
?>
  <a href="logout.php">Salir</a>
<?php
  
  echo '<pre>';
  print_r($oAuth->getUserInfo());
  echo '</pre>';


  $endpoint = 'http://services.arcgis.com/Q6ZFRRvMTlsTTFuP/arcgis/rest/services/AIRBNB_Madrid_listings/FeatureServer/0';
  $params = array(
      'f' => 'json',
      'token' => $_SESSION["access_token"]
  );
  echo '<pre>';
  print_r($oAuth->get($endpoint, $params));
  echo '</pre>';
}
?>
