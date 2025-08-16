<?php
// Set upload folder
$uploadDir = "uploads/";

// Create folder if it doesn’t exist
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars($_POST["name"]);
    $email = htmlspecialchars($_POST["email"]);
    $message = htmlspecialchars($_POST["message"]);

    // File upload
    if (isset($_FILES["resume"]) && $_FILES["resume"]["error"] == 0) {
        $fileName = basename($_FILES["resume"]["name"]);
        $fileTmp = $_FILES["resume"]["tmp_name"];
        $fileSize = $_FILES["resume"]["size"];
        $fileType = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

        // Allowed file types
        $allowedTypes = ["pdf", "doc", "docx"];

        if (!in_array($fileType, $allowedTypes)) {
            die("Error: Only PDF, DOC, and DOCX files are allowed.");
        }

        // Max file size: 5MB
        if ($fileSize > 5 * 1024 * 1024) {
            die("Error: File size exceeds 5MB limit.");
        }

        // Save file with unique name
        $newFileName = uniqid("resume_") . "." . $fileType;
        $uploadPath = $uploadDir . $newFileName;

        if (move_uploaded_file($fileTmp, $uploadPath)) {
            echo "Application submitted successfully!<br>";
            echo "Name: " . $name . "<br>";
            echo "Email: " . $email . "<br>";
            echo "Message: " . $message . "<br>";
            echo "Resume uploaded to: " . $uploadPath . "<br>";

            // OPTIONAL: Send Email Notification
            $to = "info@easterncargo.co.in"; // Change to your email
            $subject = "New Career Application from $name";
            $body = "You have received a new application:\n\n" .
                    "Name: $name\n" .
                    "Email: $email\n" .
                    "Message: $message\n" .
                    "Resume: $uploadPath\n";
            $headers = "From: noreply@easterncargo.co.in";

            mail($to, $subject, $body, $headers);
        } else {
            echo "Error: Failed to upload file.";
        }
    } else {
        echo "Error: No resume file uploaded.";
    }
}
?>
