
<?php
require_once 'Facebook/autoload.php';
require_once 'Facebook/Facebook.php';

require_once __DIR__ . '/Facebook/autoload.php';


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



?>


