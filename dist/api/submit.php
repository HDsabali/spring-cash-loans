<?php
header('Content-Type: application/json; charset=utf-8');

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    echo json_encode(['success' => false, 'message' => 'No data']);
    exit();
}

$type = isset($data['type']) ? $data['type'] : 'contact';
$ref = isset($data['refNumber']) ? $data['refNumber'] : 'REF-' . rand(1000, 9999);

if ($type === 'application') {
    $to = 'applications@springcashloans.co.za';
    $subject = "NEW LOAN APPLICATION: [{$ref}] - " . ($data['applicantName'] ?? 'Applicant');
    
    $message = "NEW LOAN APPLICATION\n\n";
    $message .= "Reference: " . $ref . "\n";
    $message .= "Loan Type: " . ($data['loanType'] ?? 'Personal') . "\n";
    $message .= "Amount: R " . ($data['amount'] ?? '0') . "\n";
    $message .= "Term: " . ($data['term'] ?? '0') . " Months\n";
    $message .= "Monthly Repayment: R " . ($data['monthlyRepayment'] ?? '0') . "\n\n";
    $message .= "APPLICANT DETAILS\n";
    $message .= "Name: " . ($data['title'] ?? '') . " " . ($data['applicantName'] ?? '') . "\n";
    $message .= "ID/Passport: " . ($data['idOrPassport'] ?? '') . "\n";
    $message .= "Mobile: " . ($data['mobileNumber'] ?? '') . "\n";
    $message .= "Email: " . ($data['email'] ?? '') . "\n";
    $message .= "Address: " . ($data['address'] ?? '') . "\n";
    $message .= "Employment: " . ($data['employmentStatus'] ?? '') . "\n";
    $message .= "Income: R " . ($data['monthlyIncome'] ?? '') . "\n";
    $message .= "Bank: " . ($data['bankName'] ?? '') . " (" . ($data['accountNumber'] ?? '') . ")\n";

    $headers = "From: applications@springcashloans.co.za\r\n";
    if (!empty($data['email'])) {
        $headers .= "Reply-To: " . $data['email'] . "\r\n";
    }

    $sent = @mail($to, $subject, $message, $headers);
    echo json_encode(['success' => true, 'mailSent' => (bool)$sent]);
    exit();
} else {
    $to = 'info@springcashloans.co.za';
    $subject = "ENQUIRY: [{$ref}] - " . ($data['category'] ?? 'General') . " from " . ($data['fullName'] ?? 'Customer');
    
    $message = "NEW CONTACT ENQUIRY\n\n";
    $message .= "Reference: " . $ref . "\n";
    $message .= "Category: " . ($data['category'] ?? 'General enquiry') . "\n";
    $message .= "Name: " . ($data['fullName'] ?? '') . "\n";
    $message .= "Email: " . ($data['email'] ?? '') . "\n";
    $message .= "Mobile: " . ($data['mobileNumber'] ?? '') . "\n";
    $message .= "Preferred Contact: " . ($data['contactMethod'] ?? 'Phone') . "\n\n";
    $message .= "Message:\n" . ($data['message'] ?? '') . "\n";

    $headers = "From: info@springcashloans.co.za\r\n";
    if (!empty($data['email'])) {
        $headers .= "Reply-To: " . $data['email'] . "\r\n";
    }

    $sent = @mail($to, $subject, $message, $headers);
    echo json_encode(['success' => true, 'mailSent' => (bool)$sent]);
    exit();
}
