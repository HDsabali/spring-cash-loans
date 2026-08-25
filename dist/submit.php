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
 * Formal & Clean SmtpMailer supporting Attachments & Clean HTML/Text formatting
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
    
    $loanType = htmlspecialchars(strtoupper($data['loanType'] ?? 'PERSONAL'));
    $amount = isset($data['amount']) ? 'R ' . number_format((float)$data['amount'], 2, '.', ' ') : 'R 0.00';
    $term = htmlspecialchars(($data['term'] ?? '0') . ' Months');
    $monthlyRepayment = isset($data['monthlyRepayment']) ? 'R ' . number_format((float)$data['monthlyRepayment'], 2, '.', ' ') : 'R 0.00';

    $applicantName = htmlspecialchars(($data['title'] ?? '') . ' ' . ($data['applicantName'] ?? ''));
    $idOrPassport = htmlspecialchars($data['idOrPassport'] ?? 'N/A');
    $mobile = htmlspecialchars($data['mobileNumber'] ?? 'N/A');
    $email = htmlspecialchars($data['email'] ?? 'N/A');
    $address = htmlspecialchars($data['address'] ?? 'N/A');
    $employment = htmlspecialchars($data['employmentStatus'] ?? 'N/A');
    $income = isset($data['monthlyIncome']) ? 'R ' . number_format((float)$data['monthlyIncome'], 2, '.', ' ') : 'N/A';
    $bankName = htmlspecialchars($data['bankName'] ?? 'N/A');
    $accountNumber = htmlspecialchars($data['accountNumber'] ?? 'N/A');
    $accountType = htmlspecialchars($data['accountType'] ?? 'Cheque Account');

    $html = <<<HTML
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #102A43; background-color: #f7f8f6; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 25px; border-radius: 10px; border: 1px solid #e4e7eb;">
    <h2 style="color: #12355B; margin-top: 0; border-bottom: 2px solid #168C8C; padding-bottom: 8px;">SPRING CASH LOANS &mdash; NEW LOAN APPLICATION</h2>
    
    <p><b>Reference Number:</b> {$ref}</p>
    <p><b>Loan Type:</b> {$loanType} LOAN</p>
    <p><b>How much would you like to borrow?:</b> {$amount}</p>
    <p><b>Repayment Period:</b> {$term}</p>
    <p><b>Estimated Monthly Repayment:</b> {$monthlyRepayment}</p>

    <h3 style="color: #12355B; border-bottom: 1px solid #e4e7eb; padding-bottom: 5px; margin-top: 25px;">APPLICANT PERSONAL DETAILS</h3>
    <p><b>Full Name:</b> {$applicantName}</p>
    <p><b>ID / Passport Number:</b> {$idOrPassport}</p>
    <p><b>Mobile Number:</b> {$mobile}</p>
    <p><b>Email Address:</b> {$email}</p>
    <p><b>Residential Address:</b> {$address}</p>

    <h3 style="color: #12355B; border-bottom: 1px solid #e4e7eb; padding-bottom: 5px; margin-top: 25px;">EMPLOYMENT & BANKING DETAILS</h3>
    <p><b>Employment Status:</b> {$employment}</p>
    <p><b>Gross Monthly Income:</b> {$income}</p>
    <p><b>Bank Name:</b> {$bankName}</p>
    <p><b>Account Number:</b> {$accountNumber} ({$accountType})</p>

    <hr style="border: none; border-top: 1px solid #e4e7eb; margin-top: 30px;">
    <p style="font-size: 12px; color: #627D98; text-align: center;">Spring Cash Loans (Pty) Ltd &bull; Official Loan Application Notification</p>
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
</head>
<body style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #102A43; background-color: #f7f8f6; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 25px; border-radius: 10px; border: 1px solid #e4e7eb;">
    <h2 style="color: #12355B; margin-top: 0; border-bottom: 2px solid #168C8C; padding-bottom: 8px;">SPRING CASH LOANS &mdash; NEW CONTACT ENQUIRY</h2>
    
    <p><b>Reference Number:</b> {$ref}</p>
    <p><b>Category / Topic:</b> {$category}</p>
    <p><b>Full Name:</b> {$fullName}</p>
    <p><b>Email Address:</b> {$email}</p>
    <p><b>Mobile Number:</b> {$mobile}</p>
    <p><b>Preferred Contact Method:</b> {$contactMethod}</p>

    <h3 style="color: #12355B; border-bottom: 1px solid #e4e7eb; padding-bottom: 5px; margin-top: 25px;">CUSTOMER MESSAGE</h3>
    <div style="background-color: #f8fafc; border: 1px solid #e4e7eb; padding: 15px; border-radius: 8px;">
      {$userMsg}
    </div>

    <hr style="border: none; border-top: 1px solid #e4e7eb; margin-top: 30px;">
    <p style="font-size: 12px; color: #627D98; text-align: center;">Spring Cash Loans (Pty) Ltd &bull; Official Contact Enquiry Notification</p>
  </div>
</body>
</html>
HTML;

    $sent = SmtpMailer::send('mail.springcashloans.co.za', 'info@springcashloans.co.za', $INFO_PASS, $to, $subject, $html, $attachments);
    echo json_encode(['success' => true, 'refNumber' => $ref, 'mailSent' => (bool)$sent]);
    exit();
}
