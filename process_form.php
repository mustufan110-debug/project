<?php
// process_form.php  – cPanel SMTP edition
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/vendor/autoload.php';

// ============= 1. CONFIGURE YOUR cPanel MAILBOX HERE =============
const SMTP_USER = 'web@easterncargo.co.in';   // ← mailbox you created
const SMTP_PASS = 'K.qWcq_W.&~w';        // ← its password
// =================================================================

session_start();

function sanitize($data) {
    return htmlspecialchars(strip_tags(trim($data)));
}

function json_response($success, $msg) {
    echo json_encode(['success' => $success, 'message' => $msg]);
    exit;
}

/* ---------- AJAX CAPTCHA ---------- */
if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['action'] ?? '') === 'get_captcha') {
    $captcha = rand(1000, 9999);
    $_SESSION['captcha'] = $captcha;
    echo json_encode(['captcha' => $captcha]);
    exit;
}

/* ---------- MAIN FORM SUBMIT ---------- */
if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !isset($_POST['form_type'])) {
    json_response(false, 'Invalid request.');
}

// CAPTCHA check
if (!isset($_POST['captcha'], $_SESSION['captcha']) ||
    $_POST['captcha'] !== $_SESSION['captcha']) {
    json_response(false, 'Invalid CAPTCHA.');
}
unset($_SESSION['captcha']);

// Gather & validate common fields
$name    = sanitize($_POST['name']    ?? '');
$email   = sanitize($_POST['email']   ?? '');
$phone   = sanitize($_POST['phone']   ?? '');
$service = sanitize($_POST['service'] ?? $_POST['transport'] ?? '');
$msgBody = sanitize($_POST['message'] ?? '');

if ($name === '' || $email === '' || $phone === '' || $service === '' ||
    !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_response(false, 'Please fill all required fields with valid data.');
}

// Build message
$formType = $_POST['form_type'];
$subject  = ($formType === 'quote')
    ? 'New Quote Request - Eastern Cargo'
    : 'New Contact Form - Eastern Cargo';

$emailContent = "
<h2>{$subject}</h2>
<p><strong>Name:</strong> {$name}</p>
<p><strong>Email:</strong> {$email}</p>
<p><strong>Phone:</strong> {$phone}</p>
<p><strong>Service/Transport:</strong> {$service}</p>
<p><strong>Message:</strong><br>" . nl2br($msgBody) . "</p>
<p><strong>Submitted:</strong> " . date('Y-m-d H:i:s') . "</p>
<p><strong>IP:</strong> " . $_SERVER['REMOTE_ADDR'] . "</p>
";

/* ---------- SEND VIA cPanel SMTP ---------- */
$mail = new PHPMailer(true);
try {
    // Server settings
    $mail->isSMTP();
    $mail->Host       = 'easterncargo.co.in'; // cPanel SMTP host
    $mail->SMTPAuth   = true;
    $mail->Username   = SMTP_USER; //web@easterncargo.co.in
    $mail->Password   = SMTP_PASS; //K.qWcq_W.&~w
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;

    // Recipients
    $mail->setFrom(SMTP_USER, 'Eastern Cargo Website');
    $mail->addAddress('info@easterncargo.co.in');
    $mail->addReplyTo($email, $name);

    // Headers
    $mail->MessageID = '<' . uniqid() . '@' . $_SERVER['SERVER_NAME'] . '>';
    $mail->addCustomHeader('Date', date('r'));

    // Content
    $mail->isHTML(true);
    $mail->Subject = $subject;
    $mail->Body    = $emailContent;

    $mail->send();
    json_response(true, 'Thank you! We have received your message and will get back to you soon.');
} catch (Exception $e) {
    error_log("PHPMailer error: " . $mail->ErrorInfo);
    json_response(false, 'Sorry, we could not send your message. Please try again later.');
}