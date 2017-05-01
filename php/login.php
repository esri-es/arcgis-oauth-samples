<?
  require_once('init.php');

  if(isset($_SESSION["username"])){
      header('Location: index.php');
  }else{
    if(!isset($_GET['code'])){
      echo '<a href="'.$oAuth->getCodeUrl().'">Login</a>';
    }else{
      $oAuth->getRefreshToken($_GET['code']);
    }
  }
?>
