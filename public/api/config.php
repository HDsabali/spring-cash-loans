<?php
/**
 * Spring Cash Loans (Pty) Ltd - SMTP & Email Configuration
 * Configure your cPanel email passwords here for 100% guaranteed SMTP delivery.
 */

define('SMTP_HOST', 'mail.springcashloans.co.za');
define('SMTP_PORT', 465); // SSL Port 465

// Email Account 1: Contact Us Enquiries
define('INFO_EMAIL', 'info@springcashloans.co.za');
define('INFO_EMAIL_PASS', 'Prime1990@');

// Email Account 2: Loan Applications
define('APPLICATIONS_EMAIL', 'applications@springcashloans.co.za');
define('APPLICATIONS_EMAIL_PASS', 'Prime1990@');

// Variables fallback
$INFO_PASS = 'Prime1990@';
$APP_PASS = 'Prime1990@';
