
<?php
require_once 'autoload.php';
require_once 'Facebook.php';

require_once __DIR__ . '/autoload.php';



$fb = new Facebook\Facebook([
  'app_id' => '1710610359248953',
  'app_secret' => '59f839b04bfa6b83409fc05c8d25f212',
  'default_graph_version' => 'v2.4',
  'default_access_token' => isset($_SESSION['facebook_access_token']) ? $_SESSION['facebook_access_token'] : 'APP-ID|APP-SECRET'
]);

$app_access_token = $app_id . '|' . $app_secret;



$response = $fb->post('/1269198996497098/notifications',  array(

'template' => 'You have received a new message.',

'href' => 'http://www.klausurenhub.bplaced.net/',

'access_token' => $app_access_token
)

print "test";

);

/*
$facebook = new Facebook();

$app_id = "1710610359248953";

$app_secret = "59f839b04bfa6b83409fc05c8d25f212";

$app_access_token = $app_id . '|' . $app_secret;

$response = $facebook->api( '/1269198996497098/notifications', 'POST', array(

'template' => 'You have received a new message.',

'href' => 'RELATIVE URL',

'access_token' => $app_access_token
) );

print_r($response);
*/


?>


