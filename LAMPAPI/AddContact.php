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


    //get JSON
    $inData = getRequestInfo();

    //get contact object from JSON
    $contact = $inData["contact"];

    //get info inside contact object
    $contactName = $contact["Name"];
    $contactEmail = $contact["Email"];
    $contactPhone = $contact["Phone"];

    //get user ID from JSON
    $userId = $inData["userId"];

    //connect to database
    $conn = new mysqli("localhost", "Team14", "COP4331-Team14X", "COP4331");
    if($conn->connect_error){
        returnWithError($conn->connect_error);
    }
    else{
        //prepare SQL statement to enter data & execute it
        $stmt = $conn->prepare("INSERT into Contacts (Name, Email, Phone, UserID) values (?, ?, ?, ?)");
        $stmt->bind_param("sssi",$contactName, $contactEmail, $contactPhone, $userId);
        $stmt->execute();
        $stmt->close();
        $conn->close();
        returnWithError("");
    }

    //Function Definitions
    function getRequestInfo(){
        return json_decode(file_get_contents("php://input"), true);
    }

    function sendResultInfoAsJson($obj){
        header('Content-type: application/json');
        echo $obj;
    }

    function returnWithError($err){
            $retValue = '{"error":"' . $err . '"}';
            sendResultInfoAsJson($retValue);
    }
