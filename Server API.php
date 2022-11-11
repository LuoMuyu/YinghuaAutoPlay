<?php
header('Content-Type: application/json;charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type,Content-Length,Accept-Encoding,X-Requested-with, Origin');
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $url = 'https://upload.chaojiying.net/Upload/Processing.php';
    $jsondata = json_decode(@file_get_contents("php://input") ,true);
    $img_base64 = str_replace(' ', '+', $jsondata['file_base64']);
    $imageName = "cjy_".date("His",time())."_".rand(1111,9999).'.png';
    if (strstr($img_base64,",")){
        $img_base64 = explode(',',$img_base64);
        $img_base64 = $img_base64[1];
    }
    $r = file_put_contents($imageName, base64_decode($img_base64));
    $fields = array( 
	  'user'=>'', # 账号 / Account
	  'pass2'=>md5(''), # 密码 / Password
	  'softid'=>'', # 软件ID / Software ID
	  'codetype'=>'', # 验证码类型 / Code Type
	  'userfile'=> new CURLFile(realpath($imageName))
	);
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_POST, count($fields));
	curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_BINARYTRANSFER, true);
	curl_setopt($ch, CURLOPT_REFERER, '');
	curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36');
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('Expect:'));
	$result = curl_exec($ch);
	curl_close($ch);
	unlink($imageName);
    echo $result;
}
