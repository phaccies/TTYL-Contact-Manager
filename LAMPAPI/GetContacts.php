<?php

// Allow from any origin
header("Access-Control-Allow-Origin: *");

// Allow headers and methods
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

$inData = getRequestInfo();
$userId = $inData["userId"];

$conn = new mysqli("localhost", "Team14", "COP4331-Team14X", "COP4331");
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    // Fetching the contact's ID along with other information
    $stmt = $conn->prepare("SELECT ID, Name, Phone, Email FROM Contacts WHERE userId=?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();

    $contacts = array();

    while($row = $result->fetch_assoc()) {
        $contacts[] = $row;
    }

    if(count($contacts) > 0) {
        returnWithInfo($contacts);
    } else {
        returnWithError("No Contacts Found");
    }

    $stmt->close();
    $conn->close();
}

function getRequestInfo() {
    return json_decode(file_get_contents('php://input'), true);
}

function returnWithError($err) {
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($contacts) {
    $retValue = '{"contacts":' . json_encode($contacts) . '}';
    sendResultInfoAsJson($retValue);
}

function sendResultInfoAsJson($obj) {
    header('Content-type: application/json');
    echo $obj;
}

?>
