<?php
class Authenticator {
    public $config;
    public $redirect_uri;
    public $output;

    function __construct($params){
        $string = file_get_contents($params['config']);
        $this->config = json_decode($string, true);
        $this->redirect_uri = $params['redirect_uri'];
        $this->output = $params['output'];
    }

    function buildQs() {
        print 'Inside `aMemberFunc()`';
    }

    function getRedirectUri(){
      $protocol = stripos($_SERVER['SERVER_PROTOCOL'],'https') === true ? 'https://' : 'http://';
      $url = $protocol.$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];
      $redirect_uri = dirname($url).'/'.$this->redirect_uri;
      return $redirect_uri;
    }

    function getCodeUrl(){
      $params = array(
          'client_id' => $this->config['client_id'],
          'redirect_uri' => $this->getRedirectUri(),
          'response_type' => 'code',
          'expiration' => -1
      );

      $qs = http_build_query($params);

      return 'https://www.arcgis.com/sharing/rest/oauth2/authorize?'.$qs;
    }

    function getRefreshToken($code){
      $url = 'https://www.arcgis.com/sharing/rest/oauth2/token';
      $data = array(
        'client_id' => $this->config['client_id'],
        'client_secret' => $this->config['client_secret'],
        'grant_type' => 'authorization_code',
        'code' => $code,
        'redirect_uri' => $this->getRedirectUri()
      );

      $options = array(
          'http' => array(
              'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
              'method'  => 'POST',
              'content' => http_build_query($data)
          )
      );
      $context  = stream_context_create($options);
      $result = file_get_contents($url, false, $context);
      if ($result === FALSE) {
        /* Handle error */
        die('Error getting the token');
      }
      $res = json_decode($result, true);

      if(!isset($res['access_token'])){
        header('Location: index.php');
      }else{
        $_SESSION["access_token"] = $res['access_token'];
        $_SESSION["username"] = $res['username'];
        $_SESSION["refresh_token"] = $res['refresh_token'];

        // Important: save the refresh_token in a persistent storage
        $output = array(
          'username' => $res['username'],
          'refresh_token' => $res['refresh_token']
        );

        $string = file_put_contents($this->output, json_encode($output));

        // Finish and redirect
        header('Location: index.php');
      }
    }

    function get($url, $params){
      $result = file_get_contents($url.'?'. http_build_query($params));

      $r = json_decode($result, true);

      if(isset($r['error'])){
        $error_code = $r['error']['code'];
        if($error_code == 498 || $error_code == 499){
          $token = $this->getNewToken();
          $params['token'] = $token;
          $_SESSION["access_token"] = $token;

          $this->get($url, $params);
        }else{
          echo("Error ($error_code) during GET to: ". $url."<br>");
          die($r['error']['message']);
        }
      }else{
        return $r;
      }
    }

    function getNewToken(){
      $url = 'https://www.arcgis.com/sharing/rest/oauth2/token';
      $data = array(
        'client_id' => $this->config['client_id'],
        'grant_type' => 'refresh_token',
        'refresh_token' => $_SESSION["refresh_token"],
      );

      $post = $this->post($url, $data);

      return $post['access_token'];
    }

    function post($url, $data){
      $options = array(
          'http' => array(
              'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
              'method'  => 'POST',
              'content' => http_build_query($data)
          )
      );
      $context  = stream_context_create($options);

      $result = file_get_contents($url, false, $context);

      if ($result === FALSE) {
        die('Error sending POST request to: '.$url);
      }
      $r = json_decode($result, true);
      return $r;
    }

    function getUserInfo(){
      $endpoint = 'https://www.arcgis.com/sharing/rest/community/users/'.$_SESSION["username"];
      $params = array(
          'f' => 'json',
          'token' => $_SESSION["access_token"]
      );

      return $this->get($endpoint, $params);
    }

}
?>
