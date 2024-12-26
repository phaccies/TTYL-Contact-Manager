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

// Get the JSON data from the request
$inData = getRequestInfo();

// Extract user info from JSON
$login = $inData["login"];
$password = $inData["password"];

// Connect to the database
$conn = new mysqli("localhost", "Team14", "COP4331-Team14X", "COP4331");

// Check connection
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    // Prepare SQL statement to select user based on login and password
    $stmt = $conn->prepare("SELECT ID, firstName, lastName, Password FROM Users WHERE BINARY Login = ?");
    
    // Bind parameters and execute
    $stmt->bind_param("s", $login);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($row = $result->fetch_assoc()) {
        // Verify the password
        if ($row['Password'] === $password) {
            returnWithInfo($row['firstName'], $row['lastName'], $row['ID']);
        } else {
            returnWithError("Invalid login credentials");
        }
    } else {
        returnWithError("No Records Found");
    }

    // Close statement and connection
    $stmt->close();
    $conn->close();
}

// Function Definitions

// Get JSON data from the request
function getRequestInfo() {
    return json_decode(file_get_contents('php://input'), true);
}

// Send result info as JSON
function sendResultInfoAsJson($obj) {
    header('Content-type: application/json');
    echo $obj;
}

// Return an error as JSON
function returnWithError($err) {
    $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

// Return user info as JSON
function returnWithInfo($firstName, $lastName, $id) {
    $retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
    sendResultInfoAsJson($retValue);
}
?>
