<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$mail_exists = function_exists('mail');
$test_mail = false;

if (isset($_GET['send']) && $_GET['send'] === '1' && $mail_exists) {
    $test_mail = @mail('info@springcashloans.co.za', 'Diagnostic Test', 'Test message from cPanel server', 'From: info@springcashloans.co.za');
}

echo json_encode([
    'status' => 'online',
    'php_version' => PHP_VERSION,
    'mail_function_exists' => $mail_exists,
    'mail_send_result' => $test_mail,
    'method' => $_SERVER['REQUEST_METHOD']
]);
