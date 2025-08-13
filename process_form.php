<?php
// Enable error reporting for debugging (remove in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Start session for CAPTCHA
session_start();

// Function to sanitize input data
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Function to validate email
function is_valid_email($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Function to generate CAPTCHA
function generate_captcha() {
    $captcha = rand(1000, 9999);
    $_SESSION['captcha'] = $captcha;
    return $captcha;
}

// Function to send email
function send_email($to, $subject, $message, $headers) {
    // Use mail() function for Linux server
    return mail($to, $subject, $message, $headers);
}

// Handle AJAX requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $response = array();
    
    // Check if it's a CAPTCHA request
    if (isset($_POST['action']) && $_POST['action'] === 'get_captcha') {
        $captcha = generate_captcha();
        $response['captcha'] = $captcha;
        echo json_encode($response);
        exit;
    }
    
    // Process form submission
    if (isset($_POST['form_type'])) {
        $form_type = sanitize_input($_POST['form_type']);
        
        // Verify CAPTCHA
        if (!isset($_POST['captcha']) || !isset($_SESSION['captcha']) || 
            $_POST['captcha'] != $_SESSION['captcha']) {
            $response['success'] = false;
            $response['message'] = 'Invalid CAPTCHA. Please try again.';
            echo json_encode($response);
            exit;
        }
        
        // Clear CAPTCHA after successful verification
        unset($_SESSION['captcha']);
        
        // Prepare email content based on form type
        $subject = '';
        $email_content = '';
        
        if ($form_type === 'quote') {
            $subject = 'New Quote Request - Eastern Cargo Carriers';
            
            $name = sanitize_input($_POST['name']);
            $email = sanitize_input($_POST['email']);
            $phone = sanitize_input($_POST['phone']);
            $transport = sanitize_input($_POST['transport']);
            $message = sanitize_input($_POST['message']);
            
            // Validate required fields
            if (empty($name) || empty($email) || empty($phone) || empty($transport)) {
                $response['success'] = false;
                $response['message'] = 'Please fill in all required fields.';
                echo json_encode($response);
                exit;
            }
            
            // Validate email
            if (!is_valid_email($email)) {
                $response['success'] = false;
                $response['message'] = 'Please enter a valid email address.';
                echo json_encode($response);
                exit;
            }
            
            $email_content = "
            <h2>New Quote Request from Eastern Cargo Website</h2>
            <p><strong>Name:</strong> $name</p>
            <p><strong>Email:</strong> $email</p>
            <p><strong>Phone:</strong> $phone</p>
            <p><strong>Transport Type:</strong> $transport</p>
            <p><strong>Message:</strong> $message</p>
            <p><strong>Submitted on:</strong> " . date('Y-m-d H:i:s') . "</p>
            <p><strong>IP Address:</strong> " . $_SERVER['REMOTE_ADDR'] . "</p>
            ";
            
        } elseif ($form_type === 'contact') {
            $subject = 'New Contact Form Submission - Eastern Cargo Carriers';
            
            $name = sanitize_input($_POST['name']);
            $email = sanitize_input($_POST['email']);
            $phone = sanitize_input($_POST['phone']);
            $service = sanitize_input($_POST['service']);
            $message = sanitize_input($_POST['message']);
            
            // Validate required fields
            if (empty($name) || empty($email) || empty($phone) || empty($service)) {
                $response['success'] = false;
                $response['message'] = 'Please fill in all required fields.';
                echo json_encode($response);
                exit;
            }
            
            // Validate email
            if (!is_valid_email($email)) {
                $response['success'] = false;
                $response['message'] = 'Please enter a valid email address.';
                echo json_encode($response);
                exit;
            }
            
            $email_content = "
            <h2>New Contact Form Submission from Eastern Cargo Website</h2>
            <p><strong>Name:</strong> $name</p>
            <p><strong>Email:</strong> $email</p>
            <p><strong>Phone:</strong> $phone</p>
            <p><strong>Service:</strong> $service</p>
            <p><strong>Message:</strong> $message</p>
            <p><strong>Submitted on:</strong> " . date('Y-m-d H:i:s') . "</p>
            <p><strong>IP Address:</strong> " . $_SERVER['REMOTE_ADDR'] . "</p>
            ";
        }
        
        // Set email headers
        $headers = array();
        $headers[] = 'MIME-Version: 1.0';
        $headers[] = 'Content-type: text/html; charset=UTF-8';
        $headers[] = 'From: Eastern Cargo Website <noreply@easterncargo.co.in>';
        $headers[] = 'Reply-To: ' . $email;
        $headers[] = 'X-Mailer: PHP/' . phpversion();
        
        // Send email
        $to = 'info@easterncargo.co.in';
        $mail_sent = send_email($to, $subject, $email_content, implode("\r\n", $headers));
        
        if ($mail_sent) {
            $response['success'] = true;
            $response['message'] = 'Thank you! Your message has been sent successfully. We will get back to you soon.';
        } else {
            $response['success'] = false;
            $response['message'] = 'Sorry, there was an error sending your message. Please try again later.';
        }
        
        echo json_encode($response);
        exit;
    }
}

// If not POST request, return error
$response['success'] = false;
$response['message'] = 'Invalid request method.';
echo json_encode($response);
?>
