<?php

// Change your@mail.com to your own
$contactformRecipient = 'your@email.com';

// Change the string
// This is the title that will show up as a title in the e-mail
$contactformTitle = 'Contact form submission';


if($_POST) {
		$contactName = htmlspecialchars( addslashes( $_POST['contactName'] ) );
		$contactTitle = htmlspecialchars( addslashes( $_POST['contactTitle'] ) );
		$contactCompany = htmlspecialchars( addslashes( $_POST['contactCompany'] ) );
		$contactEmail = htmlspecialchars( addslashes( $_POST['contactEmail'] ) );
		$contactPhone = htmlspecialchars( addslashes( $_POST['contactPhone'] ) );
		
		
		$message = '';
		$message .= 'Name: ' . $contactName . '<br />';
		if( $contactTitle !== '' ) { $message .= 'Title: ' . $contactTitle . '<br />'; }
		if( $contactCompany !== '' ) { $message .= 'Company: ' . $contactCompany . '<br />'; }
		$message .= 'Email: ' . $contactEmail . '<br />';
		if( $contactPhone !== '' ) { $message .= 'Phone: ' . $contactPhone . '<br />'; }
		
		
		// Email Headers
		$headers = "From: " . $contactEmail . "\r\n";
		$headers .= "Reply-To: ". $contactEmail . "\r\n";
		$headers .= "MIME-Version: 1.0\r\n";
		$headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
		
		// send mail
		// mail( to, subject, message, headers, parameters)
		mail( $contactformRecipient, $contactformTitle, $message, $headers );

		// Redirect user back to the index page
		header ("Location: ../");
}

?>