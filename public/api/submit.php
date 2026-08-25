<?php
// Spring Cash Loans (Pty) Ltd - Fail-safe cPanel Mail Handler API
error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);
ini_set('display_errors', '0');

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

$inputRaw = file_get_contents('php://input');
$data = json_decode($inputRaw, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'No JSON payload']);
    exit();
}

$submissionType = isset($data['type']) ? strtolower(trim($data['type'])) : 'contact';
$refNumber = isset($data['refNumber']) && !empty($data['refNumber']) ? $data['refNumber'] : 'REF-' . rand(10000, 99999);

if ($submissionType === 'application') {
    $to = 'applications@springcashloans.co.za';
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

    $htmlBody = "
    <div style='font-family:Arial,sans-serif; padding:20px; color:#102a43;'>
      <h2 style='color:#0B1F33; border-bottom:2px solid #168C8C; padding-bottom:8px;'>SPRING CASH LOANS - NEW APPLICATION</h2>
      <p><b>Reference Number:</b> {$refNumber}</p>
      <p><b>Loan Product:</b> {$loanType} LOAN</p>
      <p><b>Requested Amount:</b> {$amount}</p>
      <p><b>Term:</b> {$term}</p>
      <p><b>Estimated Instalment:</b> {$monthlyRepayment}</p>
      <hr>
      <h3>Applicant Personal & Bank Details</h3>
      <p><b>Full Name:</b> {$applicantTitle} {$applicantName}</p>
      <p><b>ID / Passport:</b> {$idOrPassport}</p>
      <p><b>Mobile:</b> {$mobile}</p>
      <p><b>Email:</b> {$email}</p>
      <p><b>Address:</b> {$address}</p>
      <p><b>Employment Status:</b> {$employmentStatus}</p>
      <p><b>Monthly Income:</b> {$monthlyIncome}</p>
      <p><b>Bank Name:</b> {$bankName}</p>
      <p><b>Account Number:</b> {$accountNumber}</p>
    </div>
    ";

    $headers  = "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "From: Spring Cash Loans <applications@springcashloans.co.za>\r\n";
    if (!empty($email) && filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $headers .= "Reply-To: {$email}\r\n";
    }

    $sent = @mail($to, $subject, $htmlBody, $headers);
    echo json_encode(['success' => true, 'refNumber' => $refNumber, 'mailSent' => (bool)$sent]);
    exit();

} else {
    $to = 'info@springcashloans.co.za';
    $category = htmlspecialchars($data['category'] ?? 'General enquiry');
    $subject = "ENQUIRY: [{$refNumber}] - {$category} from " . ($data['fullName'] ?? 'Customer');

    $fullName = htmlspecialchars($data['fullName'] ?? 'N/A');
    $email = htmlspecialchars($data['email'] ?? 'N/A');
    $mobile = htmlspecialchars($data['mobileNumber'] ?? 'N/A');
    $contactMethod = htmlspecialchars($data['contactMethod'] ?? 'Phone');
    $userMessage = nl2br(htmlspecialchars($data['message'] ?? 'N/A'));

    $htmlBody = "
    <div style='font-family:Arial,sans-serif; padding:20px; color:#102a43;'>
      <h2 style='color:#168C8C; border-bottom:2px solid #168C8C; padding-bottom:8px;'>SPRING CASH LOANS - CONTACT ENQUIRY</h2>
      <p><b>Reference Number:</b> {$refNumber}</p>
      <p><b>Category:</b> {$category}</p>
      <p><b>Full Name:</b> {$fullName}</p>
      <p><b>Email:</b> {$email}</p>
      <p><b>Mobile:</b> {$mobile}</p>
      <p><b>Preferred Contact Method:</b> {$contactMethod}</p>
      <hr>
      <p><b>Message:</b></p>
      <div style='background:#f7f8f6; padding:15px; border-radius:6px; border:1px solid #e4e7eb;'>{$userMessage}</div>
    </div>
    ";

    $headers  = "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "From: Spring Cash Loans <info@springcashloans.co.za>\r\n";
    if (!empty($email) && filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $headers .= "Reply-To: {$email}\r\n";
    }

    $sent = @mail($to, $subject, $htmlBody, $headers);
    echo json_encode(['success' => true, 'refNumber' => $refNumber, 'mailSent' => (bool)$sent]);
    exit();
}
