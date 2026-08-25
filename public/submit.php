<?php
error_reporting(0);
@ini_set('display_errors', '0');

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$INFO_PASS = '';
$APP_PASS  = '';

if (file_exists(__DIR__ . '/config.php')) {
    include_once __DIR__ . '/config.php';
}

if (empty($INFO_PASS) && defined('INFO_EMAIL_PASS')) {
    $INFO_PASS = INFO_EMAIL_PASS;
}
if (empty($APP_PASS) && defined('APPLICATIONS_EMAIL_PASS')) {
    $APP_PASS = APPLICATIONS_EMAIL_PASS;
}

$input = @file_get_contents('php://input');
$data = @json_decode($input, true);

if (empty($data) || !is_array($data)) {
    $data = $_REQUEST;
}

if (empty($data) || (empty($data['type']) && empty($data['fullName']) && empty($data['applicantName']))) {
    echo json_encode(['success' => false, 'message' => 'No data received']);
    exit();
}

/**
 * Robust Dual-Port (SSL 465 / TLS 587) cPanel SMTP Socket Mailer
 */
class SmtpMailer {
    public static function send($host, $username, $password, $to, $subject, $body) {
        if (empty($password) || strpos($password, 'PASTE_') !== false || strpos($password, 'YOUR_') !== false) {
            return false;
        }

        // Try Port 465 SSL
        $res = self::sendSocket($host, 465, true, $username, $password, $to, $subject, $body);
        if ($res) return true;

        // Try Port 587 TLS
        return self::sendSocket($host, 587, false, $username, $password, $to, $subject, $body);
    }

    private static function sendSocket($host, $port, $isSsl, $username, $password, $to, $subject, $body) {
        $prefix = $isSsl ? "ssl://" : "";
        $context = stream_context_create([
            'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true
            ]
        ]);

        $socket = @stream_socket_client("{$prefix}{$host}:{$port}", $errno, $errstr, 12, STREAM_CLIENT_CONNECT, $context);
        if (!$socket) return false;

        $getResponse = function() use ($socket) {
            $response = "";
            while ($line = @fgets($socket, 512)) {
                $response .= $line;
                if (substr($line, 3, 1) == " ") break;
            }
            return $response;
        };

        $getResponse();
        fputs($socket, "EHLO {$host}\r\n"); $getResponse();

        if (!$isSsl) {
            fputs($socket, "STARTTLS\r\n"); $starttls = $getResponse();
            if (strpos($starttls, '220') !== false) {
                @stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
                fputs($socket, "EHLO {$host}\r\n"); $getResponse();
            }
        }

        fputs($socket, "AUTH LOGIN\r\n"); $getResponse();
        fputs($socket, base64_encode($username) . "\r\n"); $getResponse();
        fputs($socket, base64_encode($password) . "\r\n"); $authRes = $getResponse();

        if (strpos($authRes, '235') === false) {
            fclose($socket);
            return false;
        }

        fputs($socket, "MAIL FROM: <{$username}>\r\n"); $getResponse();
        fputs($socket, "RCPT TO: <{$to}>\r\n"); $getResponse();
        fputs($socket, "DATA\r\n"); $getResponse();

        $headers  = "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
        $headers .= "From: Spring Cash Loans <{$username}>\r\n";
        $headers .= "To: <{$to}>\r\n";
        $headers .= "Subject: {$subject}\r\n";
        $headers .= "Date: " . date("r") . "\r\n";

        fputs($socket, $headers . "\r\n" . $body . "\r\n.\r\n");
        $dataRes = $getResponse();
        fputs($socket, "QUIT\r\n");
        fclose($socket);

        return strpos($dataRes, '250') !== false;
    }
}

$type = isset($data['type']) ? strtolower(trim($data['type'])) : 'contact';
$ref = isset($data['refNumber']) && !empty($data['refNumber']) ? $data['refNumber'] : 'REF-' . rand(1000, 9999);

if ($type === 'application') {
    $to = 'applications@springcashloans.co.za';
    $subject = "NEW LOAN APPLICATION: [{$ref}] - " . ($data['applicantName'] ?? 'Applicant');
    
    $loanType = strtoupper($data['loanType'] ?? 'PERSONAL');
    $amount = isset($data['amount']) ? 'R ' . number_format((float)$data['amount'], 2, '.', ' ') : 'N/A';
    $term = ($data['term'] ?? 'N/A') . ' Months';
    $monthlyRepayment = isset($data['monthlyRepayment']) ? 'R ' . number_format((float)$data['monthlyRepayment'], 2, '.', ' ') : 'N/A';

    $message = "SPRING CASH LOANS - NEW LOAN APPLICATION\n";
    $message .= "==========================================\n\n";
    $message .= "Reference Number: " . $ref . "\n";
    $message .= "Loan Product: " . $loanType . " LOAN\n";
    $message .= "Requested Amount: " . $amount . "\n";
    $message .= "Repayment Term: " . $term . "\n";
    $message .= "Monthly Repayment: " . $monthlyRepayment . "\n\n";
    $message .= "APPLICANT PERSONAL & BANK DETAILS\n";
    $message .= "------------------------------------------\n";
    $message .= "Full Name: " . ($data['title'] ?? '') . " " . ($data['applicantName'] ?? '') . "\n";
    $message .= "ID / Passport: " . ($data['idOrPassport'] ?? '') . "\n";
    $message .= "Mobile Number: " . ($data['mobileNumber'] ?? '') . "\n";
    $message .= "Email Address: " . ($data['email'] ?? '') . "\n";
    $message .= "Residential Address: " . ($data['address'] ?? '') . "\n";
    $message .= "Employment Status: " . ($data['employmentStatus'] ?? '') . "\n";
    $message .= "Monthly Income: R " . ($data['monthlyIncome'] ?? '') . "\n";
    $message .= "Bank Name: " . ($data['bankName'] ?? '') . "\n";
    $message .= "Account Number: " . ($data['accountNumber'] ?? '') . "\n";

    $sent = SmtpMailer::send('mail.springcashloans.co.za', 'applications@springcashloans.co.za', $APP_PASS, $to, $subject, $message);
    echo json_encode(['success' => true, 'refNumber' => $ref, 'mailSent' => (bool)$sent]);
    exit();
} else {
    $to = 'info@springcashloans.co.za';
    $category = htmlspecialchars($data['category'] ?? 'General enquiry');
    $subject = "ENQUIRY: [{$ref}] - {$category} from " . ($data['fullName'] ?? 'Customer');
    
    $message = "SPRING CASH LOANS - NEW CONTACT ENQUIRY\n";
    $message .= "==========================================\n\n";
    $message .= "Reference Number: " . $ref . "\n";
    $message .= "Category / Topic: " . $category . "\n";
    $message .= "Full Name: " . ($data['fullName'] ?? '') . "\n";
    $message .= "Email Address: " . ($data['email'] ?? '') . "\n";
    $message .= "Mobile Number: " . ($data['mobileNumber'] ?? '') . "\n";
    $message .= "Preferred Contact Method: " . ($data['contactMethod'] ?? 'Phone') . "\n\n";
    $message .= "CUSTOMER MESSAGE:\n";
    $message .= "------------------------------------------\n";
    $message .= ($data['message'] ?? '') . "\n";

    $sent = SmtpMailer::send('mail.springcashloans.co.za', 'info@springcashloans.co.za', $INFO_PASS, $to, $subject, $message);
    echo json_encode(['success' => true, 'refNumber' => $ref, 'mailSent' => (bool)$sent]);
    exit();
}
