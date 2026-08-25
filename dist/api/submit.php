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

// Read raw JSON input or fallback to $_REQUEST / $_POST for LiteSpeed compatibility
$input = @file_get_contents('php://input');
$data = @json_decode($input, true);

if (empty($data) || !is_array($data)) {
    $data = $_REQUEST;
}

if (empty($data) || (empty($data['type']) && empty($data['fullName']) && empty($data['applicantName']))) {
    echo json_encode(['success' => false, 'message' => 'No data received']);
    exit();
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

    $headers = "From: applications@springcashloans.co.za\r\n";
    if (!empty($data['email'])) {
        $headers .= "Reply-To: " . $data['email'] . "\r\n";
    }

    $sent = @mail($to, $subject, $message, $headers);
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

    $headers = "From: info@springcashloans.co.za\r\n";
    if (!empty($data['email'])) {
        $headers .= "Reply-To: " . $data['email'] . "\r\n";
    }

    $sent = @mail($to, $subject, $message, $headers);
    echo json_encode(['success' => true, 'refNumber' => $ref, 'mailSent' => (bool)$sent]);
    exit();
}
