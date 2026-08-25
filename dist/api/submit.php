<?php
/**
 * Spring Cash Loans (Pty) Ltd - cPanel Mail Handler API
 * Sends incoming Contact Us enquiries and Loan Applications directly to cPanel email inboxes.
 */

// Enable CORS if needed and set JSON response header
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    exit();
}

// Read raw JSON input
$inputRaw = file_get_contents('php_input') ?: file_get_contents('php://input');
$data = json_decode($inputRaw, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid or missing JSON payload']);
    exit();
}

// Target cPanel Email Addresses
$CONTACT_EMAIL = 'info@springcashloans.co.za';
$APPLICATIONS_EMAIL = 'applications@springcashloans.co.za';

$submissionType = isset($data['type']) ? strtolower(trim($data['type'])) : 'contact';

// Generate reference number
$refNumber = isset($data['refNumber']) && !empty($data['refNumber']) 
    ? $data['refNumber'] 
    : ($submissionType === 'application' 
        ? 'SCL-APP-' . date('Y') . '-' . rand(10000, 99999) 
        : 'ENQ-ZA-' . date('Y') . '-' . rand(10000, 99999));

if ($submissionType === 'application') {
    // ==========================================
    // LOAN APPLICATION EMAIL SUBMISSION
    // ==========================================
    $to = $APPLICATIONS_EMAIL;
    $subject = "NEW LOAN APPLICATION: [{$refNumber}] - " . ($data['applicantName'] ?? 'Applicant');
    
    $loanType = strtoupper($data['loanType'] ?? 'PERSONAL');
    $amount = isset($data['amount']) ? 'R ' . number_format((float)$data['amount'], 2, '.', ' ') : 'N/A';
    $term = ($data['term'] ?? 'N/A') . ' Months';
    $monthlyRepayment = isset($data['monthlyRepayment']) ? 'R ' . number_format((float)$data['monthlyRepayment'], 2, '.', ' ') : 'N/A';
    
    $applicantTitle = htmlspecialchars($data['title'] ?? '');
    $applicantName = htmlspecialchars($data['applicantName'] ?? $data['fullName'] ?? 'N/A');
    $idOrPassport = htmlspecialchars($data['idOrPassport'] ?? 'N/A');
    $mobile = htmlspecialchars($data['mobileNumber'] ?? 'N/A');
    $email = htmlspecialchars($data['email'] ?? 'N/A');
    $address = htmlspecialchars(($data['address'] ?? '') . ', ' . ($data['city'] ?? '') . ', ' . ($data['province'] ?? ''));
    
    $employmentStatus = htmlspecialchars($data['employmentStatus'] ?? 'N/A');
    $monthlyIncome = isset($data['monthlyIncome']) ? 'R ' . number_format((float)$data['monthlyIncome'], 2, '.', ' ') : 'N/A';
    
    $bankName = htmlspecialchars($data['bankName'] ?? 'N/A');
    $accountNumber = htmlspecialchars($data['accountNumber'] ?? 'N/A');
    $accountType = htmlspecialchars($data['accountType'] ?? 'N/A');

    $htmlBody = "
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset='utf-8'>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f6f8; color: #102a43; margin: 0; padding: 20px; }
        .container { max-width: 650px; background: #ffffff; margin: 0 auto; border-radius: 8px; border: 1px solid #e4e7eb; overflow: hidden; }
        .header { background: #0B1F33; color: #ffffff; padding: 24px; text-align: center; }
        .header h2 { margin: 0; font-size: 22px; color: #168C8C; }
        .header p { margin: 6px 0 0 0; font-size: 14px; color: #d9e2ec; }
        .content { padding: 24px; }
        .section-title { font-size: 14px; font-weight: bold; color: #168C8C; text-transform: uppercase; border-bottom: 2px solid #e4e7eb; padding-bottom: 6px; margin-top: 20px; margin-bottom: 12px; }
        .table-data { width: 100%; border-collapse: collapse; font-size: 14px; }
        .table-data td { padding: 8px 10px; border-bottom: 1px solid #f0f4f8; }
        .table-data tr td:first-child { font-weight: bold; color: #486581; width: 40%; }
        .footer { background: #f7f8f6; padding: 16px; text-align: center; font-size: 12px; color: #627d98; border-top: 1px solid #e4e7eb; }
      </style>
    </head>
    <body>
      <div class='container'>
        <div class='header'>
          <h2>SPRING CASH LOANS (PTY) LTD</h2>
          <p>Official Loan Application Submission</p>
        </div>
        <div class='content'>
          <div class='section-title'>LOAN DETAILS</div>
          <table class='table-data'>
            <tr><td>Reference Number:</td><td><strong>{$refNumber}</strong></td></tr>
            <tr><td>Loan Type:</td><td><strong>{$loanType} LOAN</strong></td></tr>
            <tr><td>Requested Amount:</td><td><strong>{$amount}</strong></td></tr>
            <tr><td>Repayment Term:</td><td>{$term}</td></tr>
            <tr><td>Estimated Monthly Instalment:</td><td><strong>{$monthlyRepayment}</strong></td></tr>
          </table>

          <div class='section-title'>APPLICANT PERSONAL DETAILS</div>
          <table class='table-data'>
            <tr><td>Full Name:</td><td>{$applicantTitle} {$applicantName}</td></tr>
            <tr><td>ID / Passport Number:</td><td>{$idOrPassport}</td></tr>
            <tr><td>Mobile Number:</td><td><a href='tel:{$mobile}'>{$mobile}</a></td></tr>
            <tr><td>Email Address:</td><td><a href='mailto:{$email}'>{$email}</a></td></tr>
            <tr><td>Residential Address:</td><td>{$address}</td></tr>
          </table>

          <div class='section-title'>FINANCIAL & BANK DETAILS</div>
          <table class='table-data'>
            <tr><td>Employment Status:</td><td>{$employmentStatus}</td></tr>
            <tr><td>Net Monthly Income:</td><td>{$monthlyIncome}</td></tr>
            <tr><td>Bank Name:</td><td>{$bankName}</td></tr>
            <tr><td>Account Number:</td><td>{$accountNumber}</td></tr>
            <tr><td>Account Type:</td><td>{$accountType}</td></tr>
          </table>

          <div class='section-title'>LEGAL & POPIA CONSENTS</div>
          <p style='font-size:12px; color:#486581; line-height:1.5;'>
            ✔ Applicant consented to POPIA data processing.<br>
            ✔ Applicant authorized credit bureau checks & income verification.<br>
            ✔ Submission Date: " . date('Y-m-d H:i:s') . "
          </p>
        </div>
        <div class='footer'>
          Spring Cash Loans (Pty) Ltd &bull; National Credit Regulator (NCR) Number: NCRCP19642
        </div>
      </div>
    </body>
    </html>
    ";

    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: Spring Cash Loans <website@springcashloans.co.za>" . "\r\n";
    if (!empty($email) && filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $headers .= "Reply-To: {$email}" . "\r\n";
    }

    $mailSent = @mail($to, $subject, $htmlBody, $headers);

    echo json_encode([
        'success' => true,
        'refNumber' => $refNumber,
        'mailSent' => $mailSent,
        'message' => 'Application submitted successfully to ' . $to
    ]);
    exit();

} else {
    // ==========================================
    // CONTACT US ENQUIRY EMAIL SUBMISSION
    // ==========================================
    $to = $CONTACT_EMAIL;
    $category = htmlspecialchars($data['category'] ?? 'General enquiry');
    $subject = "ENQUIRY: [{$refNumber}] - {$category} from " . ($data['fullName'] ?? 'Customer');

    $fullName = htmlspecialchars($data['fullName'] ?? 'N/A');
    $email = htmlspecialchars($data['email'] ?? 'N/A');
    $mobile = htmlspecialchars($data['mobileNumber'] ?? 'N/A');
    $contactMethod = htmlspecialchars($data['contactMethod'] ?? 'Phone');
    $userMessage = nl2br(htmlspecialchars($data['message'] ?? 'N/A'));

    $htmlBody = "
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset='utf-8'>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f6f8; color: #102a43; margin: 0; padding: 20px; }
        .container { max-width: 600px; background: #ffffff; margin: 0 auto; border-radius: 8px; border: 1px solid #e4e7eb; overflow: hidden; }
        .header { background: #168C8C; color: #ffffff; padding: 20px; text-align: center; }
        .header h3 { margin: 0; font-size: 20px; }
        .content { padding: 24px; }
        .table-data { width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px; }
        .table-data td { padding: 8px 10px; border-bottom: 1px solid #f0f4f8; }
        .table-data tr td:first-child { font-weight: bold; color: #486581; width: 35%; }
        .msg-box { background: #f7f8f6; border: 1px solid #e4e7eb; padding: 16px; rounded: 6px; font-size: 14px; line-height: 1.6; color: #102a43; }
        .footer { background: #f7f8f6; padding: 14px; text-align: center; font-size: 12px; color: #627d98; border-top: 1px solid #e4e7eb; }
      </style>
    </head>
    <body>
      <div class='container'>
        <div class='header'>
          <h3>SPRING CASH LOANS - CONTACT ENQUIRY</h3>
        </div>
        <div class='content'>
          <table class='table-data'>
            <tr><td>Enquiry Reference:</td><td><strong>{$refNumber}</strong></td></tr>
            <tr><td>Category / Topic:</td><td><strong>{$category}</strong></td></tr>
            <tr><td>Full Name:</td><td>{$fullName}</td></tr>
            <tr><td>Email Address:</td><td><a href='mailto:{$email}'>{$email}</a></td></tr>
            <tr><td>Mobile Number:</td><td><a href='tel:{$mobile}'>{$mobile}</a></td></tr>
            <tr><td>Preferred Contact:</td><td>{$contactMethod}</td></tr>
          </table>

          <div style='font-size:13px; font-weight:bold; color:#168C8C; margin-bottom:8px;'>CUSTOMER MESSAGE:</div>
          <div class='msg-box'>
            {$userMessage}
          </div>
        </div>
        <div class='footer'>
          Spring Cash Loans (Pty) Ltd &bull; NCRCP19642
        </div>
      </div>
    </body>
    </html>
    ";

    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: Spring Cash Loans <website@springcashloans.co.za>" . "\r\n";
    if (!empty($email) && filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $headers .= "Reply-To: {$email}" . "\r\n";
    }

    $mailSent = @mail($to, $subject, $htmlBody, $headers);

    echo json_encode([
        'success' => true,
        'refNumber' => $refNumber,
        'mailSent' => $mailSent,
        'message' => 'Enquiry submitted successfully to ' . $to
    ]);
    exit();
}
