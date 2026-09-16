<?php

// Change this address to the inbox that should receive submissions.
$contactformRecipient = 'your@email.com';
$contactformTitle = 'Contact form submission';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method Not Allowed');
}

$fields = ['contactName', 'contactTitle', 'contactCompany', 'contactEmail', 'contactPhone'];
$values = [];
foreach ($fields as $field) {
    $values[$field] = trim((string) filter_input(INPUT_POST, $field, FILTER_UNSAFE_RAW));
}

if ($values['contactName'] === '' || !filter_var($values['contactEmail'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    exit('Please provide a name and valid email address.');
}

// Escape user input only when placing it into the HTML email body.
$message = '<p><strong>Name:</strong> ' . htmlspecialchars($values['contactName'], ENT_QUOTES, 'UTF-8') . '</p>';
foreach (['contactTitle' => 'Title', 'contactCompany' => 'Company', 'contactPhone' => 'Phone'] as $field => $label) {
    if ($values[$field] !== '') {
        $message .= '<p><strong>' . $label . ':</strong> ' . htmlspecialchars($values[$field], ENT_QUOTES, 'UTF-8') . '</p>';
    }
}
$message .= '<p><strong>Email:</strong> ' . htmlspecialchars($values['contactEmail'], ENT_QUOTES, 'UTF-8') . '</p>';

$headers = [
    'From: Eventcamp contact form <' . $contactformRecipient . '>',
    'Reply-To: ' . $values['contactEmail'],
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
];

if (!mail($contactformRecipient, $contactformTitle, $message, implode("\r\n", $headers))) {
    http_response_code(500);
    exit('Unable to send your message.');
}

header('Location: ../', true, 303);
exit;
