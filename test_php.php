<?php
// Simple test file to verify PHP is working
echo "PHP is working!";
echo "<br>PHP Version: " . phpversion();
echo "<br>Server: " . $_SERVER['SERVER_SOFTWARE'];
echo "<br>Mail function available: " . (function_exists('mail') ? 'Yes' : 'No');
?>
