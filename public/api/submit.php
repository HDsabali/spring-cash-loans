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

// Process Uploaded Files from $_FILES
$attachments = [];
if (!empty($_FILES)) {
    foreach ($_FILES as $key => $file) {
        if (!empty($file['tmp_name']) && is_uploaded_file($file['tmp_name']) && $file['error'] === UPLOAD_ERR_OK) {
            $attachments[] = [
                'path' => $file['tmp_name'],
                'name' => $file['name'],
                'type' => $file['type']
            ];
        }
    }
}

/**
 * Formal HTML & Attachment SmtpMailer
 */
class SmtpMailer {
    public static function send($host, $username, $password, $to, $subject, $htmlBody, $attachments = []) {
        if (empty($password) || strpos($password, 'PASTE_') !== false || strpos($password, 'YOUR_') !== false) {
            return false;
        }

        // Try Port 465 SSL
        $res = self::sendSocket($host, 465, true, $username, $password, $to, $subject, $htmlBody, $attachments);
        if ($res) return true;

        // Try Port 587 TLS
        return self::sendSocket($host, 587, false, $username, $password, $to, $subject, $htmlBody, $attachments);
    }

    private static function sendSocket($host, $port, $isSsl, $username, $password, $to, $subject, $htmlBody, $attachments = []) {
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

        $boundary = "----=_NextPart_" . md5(time());

        $headers  = "MIME-Version: 1.0\r\n";
        $headers .= "From: Spring Cash Loans <{$username}>\r\n";
        $headers .= "To: <{$to}>\r\n";
        $headers .= "Subject: {$subject}\r\n";
        $headers .= "Date: " . date("r") . "\r\n";
        $headers .= "Content-Type: multipart/mixed; boundary=\"{$boundary}\"\r\n";

        // HTML Body Part
        $body  = "--{$boundary}\r\n";
        $body .= "Content-Type: text/html; charset=UTF-8\r\n";
        $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
        $body .= chunk_split(base64_encode($htmlBody)) . "\r\n";

        // Attachment Parts
        if (!empty($attachments)) {
            foreach ($attachments as $att) {
                if (file_exists($att['path'])) {
                    $fileName = $att['name'];
                    $fileData = file_get_contents($att['path']);
                    $mimeType = !empty($att['type']) ? $att['type'] : 'application/octet-stream';

                    $body .= "--{$boundary}\r\n";
                    $body .= "Content-Type: {$mimeType}; name=\"{$fileName}\"\r\n";
                    $body .= "Content-Disposition: attachment; filename=\"{$fileName}\"\r\n";
                    $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
                    $body .= chunk_split(base64_encode($fileData)) . "\r\n";
                }
            }
        }

        $body .= "--{$boundary}--\r\n";

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

    $applicantName = htmlspecialchars(($data['title'] ?? '') . ' ' . ($data['applicantName'] ?? ''));
    $idOrPassport = htmlspecialchars($data['idOrPassport'] ?? 'N/A');
    $mobile = htmlspecialchars($data['mobileNumber'] ?? 'N/A');
    $email = htmlspecialchars($data['email'] ?? 'N/A');
    $address = htmlspecialchars($data['address'] ?? 'N/A');
    $employment = htmlspecialchars($data['employmentStatus'] ?? 'N/A');
    $income = isset($data['monthlyIncome']) ? 'R ' . number_format((float)$data['monthlyIncome'], 2, '.', ' ') : 'N/A';
    $bankName = htmlspecialchars($data['bankName'] ?? 'N/A');
    $accountNumber = htmlspecialchars($data['accountNumber'] ?? 'N/A');

    $html = <<<HTML
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 20px; color: #333; }
    .container { max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e1e4e8; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { background-color: #12355B; padding: 24px 30px; text-align: left; }
    .header h1 { color: #ffffff; margin: 0; font-size: 20px; font-weight: bold; letter-spacing: 0.5px; }
    .header p { color: #168C8C; margin: 4px 0 0 0; font-size: 13px; font-weight: 600; }
    .badge { display: inline-block; background: #168C8C; color: #ffffff; padding: 6px 14px; border-radius: 6px; font-size: 13px; font-weight: bold; margin-top: 10px; }
    .content { padding: 30px; }
    .section-title { font-size: 13px; font-weight: bold; color: #12355B; text-transform: uppercase; letter-spacing: 1px; margin-top: 20px; margin-bottom: 12px; border-bottom: 2px solid #e7f4f2; padding-bottom: 6px; }
    .data-table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
    .data-table td { padding: 10px 14px; font-size: 13px; border-bottom: 1px solid #f0f0f0; }
    .data-table td.label { font-weight: bold; color: #52606D; width: 40%; background-color: #f8fafc; }
    .data-table td.value { color: #102A43; font-weight: 500; }
    .footer { background-color: #f8fafc; padding: 16px 30px; border-top: 1px solid #e1e4e8; text-align: center; font-size: 12px; color: #627D98; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>SPRING CASH LOANS</h1>
      <p>Formal Loan Application Notification</p>
      <div class="badge">Reference: {$ref}</div>
    </div>
    <div class="content">
      <div class="section-title">1. Requested Loan Summary</div>
      <table class="data-table">
        <tr><td class="label">Loan Product</td><td class="value">{$loanType} LOAN</td></tr>
        <tr><td class="label">Requested Amount</td><td class="value">{$amount}</td></tr>
        <tr><td class="label">Repayment Term</td><td class="value">{$term}</td></tr>
        <tr><td class="label">Monthly Repayment</td><td class="value">{$monthlyRepayment}</td></tr>
      </table>

      <div class="section-title">2. Applicant Personal Details</div>
      <table class="data-table">
        <tr><td class="label">Full Name</td><td class="value">{$applicantName}</td></tr>
        <tr><td class="label">ID / Passport Number</td><td class="value">{$idOrPassport}</td></tr>
        <tr><td class="label">Mobile Number</td><td class="value">{$mobile}</td></tr>
        <tr><td class="label">Email Address</td><td class="value">{$email}</td></tr>
        <tr><td class="label">Residential Address</td><td class="value">{$address}</td></tr>
      </table>

      <div class="section-title">3. Employment & Banking Details</div>
      <table class="data-table">
        <tr><td class="label">Employment Status</td><td class="value">{$employment}</td></tr>
        <tr><td class="label">Gross Monthly Income</td><td class="value">{$income}</td></tr>
        <tr><td class="label">Bank Name</td><td class="value">{$bankName}</td></tr>
        <tr><td class="label">Account Number</td><td class="value">{$accountNumber}</td></tr>
      </table>
    </div>
    <div class="footer">
      Official Application Submission • Spring Cash Loans (Pty) Ltd
    </div>
  </div>
</body>
</html>
HTML;

    $sent = SmtpMailer::send('mail.springcashloans.co.za', 'applications@springcashloans.co.za', $APP_PASS, $to, $subject, $html, $attachments);
    echo json_encode(['success' => true, 'refNumber' => $ref, 'mailSent' => (bool)$sent]);
    exit();
} else {
    $to = 'info@springcashloans.co.za';
    $category = htmlspecialchars($data['category'] ?? 'General enquiry');
    $fullName = htmlspecialchars($data['fullName'] ?? 'Customer');
    $email = htmlspecialchars($data['email'] ?? 'N/A');
    $mobile = htmlspecialchars($data['mobileNumber'] ?? 'N/A');
    $contactMethod = htmlspecialchars($data['contactMethod'] ?? 'Phone');
    $userMsg = nl2br(htmlspecialchars($data['message'] ?? 'N/A'));

    $subject = "ENQUIRY: [{$ref}] - {$category} from {$fullName}";
    
    $html = <<<HTML
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 20px; color: #333; }
    .container { max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e1e4e8; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { background-color: #12355B; padding: 24px 30px; text-align: left; }
    .header h1 { color: #ffffff; margin: 0; font-size: 20px; font-weight: bold; letter-spacing: 0.5px; }
    .header p { color: #168C8C; margin: 4px 0 0 0; font-size: 13px; font-weight: 600; }
    .badge { display: inline-block; background: #168C8C; color: #ffffff; padding: 6px 14px; border-radius: 6px; font-size: 13px; font-weight: bold; margin-top: 10px; }
    .content { padding: 30px; }
    .section-title { font-size: 13px; font-weight: bold; color: #12355B; text-transform: uppercase; letter-spacing: 1px; margin-top: 16px; margin-bottom: 12px; border-bottom: 2px solid #e7f4f2; padding-bottom: 6px; }
    .data-table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
    .data-table td { padding: 10px 14px; font-size: 13px; border-bottom: 1px solid #f0f0f0; }
    .data-table td.label { font-weight: bold; color: #52606D; width: 40%; background-color: #f8fafc; }
    .data-table td.value { color: #102A43; font-weight: 500; }
    .message-box { background-color: #f8fafc; border: 1px solid #e4e7eb; padding: 16px; border-radius: 8px; font-size: 13px; line-height: 1.6; color: #102A43; margin-top: 10px; }
    .footer { background-color: #f8fafc; padding: 16px 30px; border-top: 1px solid #e1e4e8; text-align: center; font-size: 12px; color: #627D98; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>SPRING CASH LOANS</h1>
      <p>New Contact Enquiry</p>
      <div class="badge">Reference: {$ref}</div>
    </div>
    <div class="content">
      <div class="section-title">Customer Details</div>
      <table class="data-table">
        <tr><td class="label">Category / Topic</td><td class="value">{$category}</td></tr>
        <tr><td class="label">Full Name</td><td class="value">{$fullName}</td></tr>
        <tr><td class="label">Email Address</td><td class="value">{$email}</td></tr>
        <tr><td class="label">Mobile Number</td><td class="value">{$mobile}</td></tr>
        <tr><td class="label">Preferred Contact</td><td class="value">{$contactMethod}</td></tr>
      </table>

      <div class="section-title">Message Body</div>
      <div class="message-box">
        {$userMsg}
      </div>
    </div>
    <div class="footer">
      Official Contact Enquiry Notification • Spring Cash Loans (Pty) Ltd
    </div>
  </div>
</body>
</html>
HTML;

    $sent = SmtpMailer::send('mail.springcashloans.co.za', 'info@springcashloans.co.za', $INFO_PASS, $to, $subject, $html, $attachments);
    echo json_encode(['success' => true, 'refNumber' => $ref, 'mailSent' => (bool)$sent]);
    exit();
}
