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


    //Initial Information--------------------------------

    //get contact object from JSON
    $contact = $inData["contact"];

    //get info inside contact object
    $contactName = $contact["Name"];
    $contactEmail = $contact["Email"];
    $contactPhone = $contact["Phone"];

    //get user ID from JSON
    $userId = $inData["userId"];

    //---------------------------------------------------



    //Updated Information--------------------------------

    //get contact object from JSON
    $contact2 = $inData["contact2"];

    //get info inside contact object
    $contactName2 = $contact2["Name"];
    $contactEmail2 = $contact2["Email"];
    $contactPhone2 = $contact2["Phone"];


    //----------------------------------------------------




    //connect to database
    $conn = new mysqli("localhost", "Team14", "COP4331-Team14X", "COP4331");
    if($conn->connect_error){
        returnWithError($conn->connect_error);
    }
    else{
        //prepare SQL statement to delete data & execute it
        $sqlselect = $conn->prepare("SELECT ID FROM Contacts WHERE Name =? AND Email =? AND Phone =? AND UserID =?");
        $sqlselect->bind_param("sssi",$contactName, $contactEmail, $contactPhone, $userId);
        $sqlselect->execute();
        $result = $sqlselect->get_result();

        // Fetch the result as an associative array
        if ($row = $result->fetch_assoc()) {
            $id = $row['ID'];
        } else {
            // Handle case where no rows are returned
            returnWithError("No contact found.");
            $sqlselect->close();
            $conn->close();
            exit();
        }

        $sqlUpdate = $conn->prepare("UPDATE Contacts SET Name = ?, Email = ?, Phone = ?, UserID =? WHERE ID=?");
        $sqlUpdate->bind_param("sssii",$contactName2, $contactEmail2, $contactPhone2, $userId, $id);

        if($sqlUpdate->execute()){
            returnWithError("None; Contact updated");
        }
        else{
            returnWithError("Could not update contact.");
        }


        
        $sqlselect->close();
        $sqlUpdate->close();
        $conn->close();
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
