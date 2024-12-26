const urlBase = "http://cop4331-team14.xyz/LAMPAPI";
const extension = "php";

let userId = 0;
let firstName = "";
let lastName = "";

// Gracie
function doSearchContact() {
  const input = document
    .getElementById("searchInput")
    .value.trim()
    .toLowerCase();
  const table = document.getElementById("contactTable");
  const tableContainer = document.getElementById("table-container");
  const rows = table.getElementsByTagName("tr");
  let found = false; // Track if any matches are found

  // Loop through all rows, starting from 1 to skip the header row
  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i].getElementsByTagName("td");
    if (cells.length > 0) {
      const name = cells[0].innerText.trim().toLowerCase(); // Assuming name is in the first column

      if (name.includes(input)) {
        rows[i].style.display = ""; // Show the row if a match is found
        found = true;
      } else {
        rows[i].style.display = "none"; // Hide the row if no match
      }
    }
  }

  const messageDisplay = document.getElementById("messageDisplay");

  // Display whether a contact was found or not
  if (input !== "") {
    if (found) {
      messageDisplay.innerText = ""; // Clear the "not found" message if a match is found
      table.style.display = ""; // Ensure the table is visible
      tableContainer.style.display = ""; //Ensure container is visible
    } else {
      messageDisplay.innerText = "Contact not found."; // Show message if no match found
      table.style.display = "none"; // Hide table if no match
      tableContainer.style.display = "none"; //Also hide the container if there is no match.

    }
  } else {
    messageDisplay.innerText = ""; // Clear the message if input is empty
    table.style.display = ""; // Show the table in case input was cleared
    tableContainer.style.display = ""; //Ensure container is visible
  }

  // Clear the search input after searching
  document.getElementById("searchInput").value = "";

  // Optional: Send JSON payload for server-side processing
  let tmp = { search: input };
  let jsonPayload = JSON.stringify(tmp);
  let url = urlBase + "/SearchContacts." + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      console.log("Server received search request.");
    }
  };

  xhr.onerror = function () {
    console.error("Network error: Could not complete search.");
  };

  xhr.send(jsonPayload);
}

/////////////////////////////////////////////////////////////////////////////

//Working on this (Veronica)
function editContact(Name, Phone, Email, ID, saveButton, editButton, row) {
  readCookie(); //Obtain userId

  saveButton.style.display = "inline";
  editButton.style.display = "none";
  console.log("Hi, I'm updating :P");
  console.log("I'm looking Contact id: " + ID);

  let nameCell = row.cells[0];
  let phoneCell = row.cells[1];
  let emailCell = row.cells[2];

  // Make the cells editable
  nameCell.contentEditable = true;
  phoneCell.contentEditable = true;
  emailCell.contentEditable = true;

  nameCell.style.border = "2px solid rgb(93, 0, 255)"; // Border
  phoneCell.style.border = "2px solid rgb(93, 0, 255)"; // Border
  emailCell.style.border = "2px solid rgb(93, 0, 255)"; // Border

  nameCell.style.backgroundColor = "#8082ff";
  phoneCell.style.backgroundColor = "#8082ff";
  emailCell.style.backgroundColor = "#8082ff";

  nameCell.style.color = "#000000";
  phoneCell.style.color = "#000000";
  emailCell.style.color = "#000000";

  //Make editResult Span
  // let editResult = document.createElement("span");
  //editResult.id = "editResult";
  //document.body.appendChild(editResult);

  saveButton.onclick = function () {
    let newName = nameCell.textContent;
    let newPhone = phoneCell.textContent;
    let newEmail = emailCell.textContent;

    //Things begin here:
    let tmp = {
      contact: {
        Name: Name,
        Phone: Phone,
        Email: Email,
      },
      userId: userId,
      contact2: {
        Name: newName,
        Phone: newPhone,
        Email: newEmail,
      },
    };

    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + "/UpdateContact." + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function () {
      if (this.readyState == 4) {
        if (this.status == 200) {
          loadContacts();
          // document.getElementById("editResult").innerHTML = "Changes saved.";
        } else {
          document.getElementById("editResult").innerHTML =
            "Error: " + this.status + " " + xhr.statusText;
        }
      }
    };

    xhr.onerror = function () {
      document.getElementById("editResult").innerHTML =
        "Network Error: Failed to update the contact.";
    };

    xhr.send(jsonPayload);

    // Make the cells un-editable
    nameCell.contentEditable = false;
    phoneCell.contentEditable = false;
    emailCell.contentEditable = false;

    saveButton.style.display = "none";
    editButton.style.display = "inline";
    //loadContacts();
  }; //onClick ends here
}

//Wrapper function to determine if deletion or not occurs. If true, then row will be deleted as well.
function delWrapper(Name, Phone, Email) {
  const userConfirmed = confirm(
    "Are you sure you want to delete this contact?"
  );

  if (userConfirmed) {
    deleteContact(Name, Phone, Email);
    return true;
  } else {
    console.log("Contact was not deleted.");
    return false;
  }
}

//Working on this (Veronica)
function deleteContact(Name, Phone, Email) {
  readCookie(); //Obtain userId

  let tmp = {
    contact: { Name: Name, Phone: Phone, Email: Email },
    userId: userId,
  };

  let jsonPayload = JSON.stringify(tmp);
  let url = urlBase + "/DeleteContact." + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  xhr.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status == 200) {
        console.log("Contact has been sucessfully deleted.");
      } else {
        document.getElementById("deleteResult").innerHTML =
          "Error: " + this.status + " " + xhr.statusText;
      }
    }
  };

  xhr.send(jsonPayload);
}

// Gracie - working on this
function loadContacts() {
  readCookie(); // Get userId from the cookie

  console.log("Loading contacts for userId:", userId); // Log userId for debugging

  let tmp = { userId: userId }; // Create payload with userId
  let jsonPayload = JSON.stringify(tmp); // Convert it to JSON
  let url = urlBase + "/GetContacts." + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        try {
          let jsonObject = JSON.parse(xhr.responseText);
          console.log("Response JSON: ", jsonObject);
          console.log("Contacts loaded: ", jsonObject.contacts);
          populateContactTable(jsonObject.contacts); // Populate table with contacts
        } catch (e) {
          console.error("Failed to parse response as JSON", e);
        }
      } else {
        console.log("Error: Unable to load contacts, status " + xhr.status);
      }
    }
  };
  xhr.send(jsonPayload);
}

function populateContactTable(contacts) {
  let table = document.getElementById("contactTable");

  // Clear existing rows (except for header)
  let rowCount = table.rows.length;
  while (rowCount > 1) {
    table.deleteRow(1);
    rowCount--;
  }

  // Add new rows for each contact
  contacts.forEach(function (contact) {
    let row = table.insertRow();

    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);
    let cell5 = row.insertCell(4); // For buttons

    cell1.innerHTML = contact.Name || "N/A"; // Adjusted field name
    cell2.innerHTML = contact.Phone || "N/A"; // Adjusted field name
    cell3.innerHTML = contact.Email || "N/A"; // Adjusted field name
    cell4.innerHTML = ""; // Assuming there's no additional field for phone number here

    // Create "Delete" button with image
    let deleteButton = document.createElement("button");
    let deleteImage = document.createElement("img");
    deleteImage.src = "images/Delete.jpg";
    deleteImage.alt = "Delete";
    deleteImage.className = "delImg";
    deleteImage.style.width = "20px"; // Set desired width
    deleteImage.style.height = "20px"; // Set desired height
    deleteButton.appendChild(deleteImage);
    //deleteButton.className = "buttons";
    deleteButton.className = "deleteButton";
    deleteButton.onclick = function () {
      if (delWrapper(contact.Name, contact.Phone, contact.Email)) {
        table.deleteRow(row.rowIndex);
      }
    };
    cell5.appendChild(deleteButton);

    // Create "Save" button with image (Future Use w/ Edit)
    let saveButton = document.createElement("button");
    let saveImage = document.createElement("img");
    saveImage.src = "images/Save.jpg";
    saveImage.alt = "Save";
    saveImage.style.width = "20px"; // Set desired width
    saveImage.style.height = "20px"; // Set desired height
    saveImage.className = "saveImg";
    saveButton.appendChild(saveImage);
    //saveButton.className = "buttons";
    saveButton.className = "saveButton";
    saveButton.style.display = "none"; // Initially hide Save button unless 'Edit' is clicked.

    /*saveButton.onclick = function() {
            //saveWrapper();
        }; */
    cell5.appendChild(saveButton);

    // Create "Edit" button with image
    let editButton = document.createElement("button");
    let editImage = document.createElement("img");
    editImage.src = "images/Edit.jpg";
    editImage.alt = "Edit";
    editImage.style.width = "20px"; // Set desired width
    editImage.style.height = "20px"; // Set desired height
    editImage.className = "editImg";
    editButton.appendChild(editImage);
    //editButton.className = "buttons";
    editButton.className = "editButton";
    editButton.onclick = function () {
      console.log("I click and look at looking Contact id: " + contact.ID); // Debugging
      editContact(
        contact.Name,
        contact.Phone,
        contact.Email,
        contact.ID,
        saveButton,
        editButton,
        row
      );
      // Uncomment if you want to show/hide buttons on edit
      // saveButton.style.display = "inline";
      // editButton.style.display = "none";
    };
    cell5.appendChild(editButton);
  });
}

// Gracie
function addContact() {
  // readCookie allows program to fetch the userId.
  readCookie();

  // Validation
  if (!validateForm()) {
    return;
  }

  // Retrieving values from the form
  var firstName = document.getElementById("firstName").value;
  var lastName = document.getElementById("lastName").value;
  var phone = document.getElementById("Phone").value || "";
  var email = document.getElementById("Email").value || "";

  // AJAX request to add contact to database
  var tmp = {
    contact: { Name: firstName + " " + lastName, Phone: phone, Email: email },
    userId: userId, // Assuming userId is defined somewhere in your code
  };

  var jsonPayload = JSON.stringify(tmp);
  var url = urlBase + "/AddContact." + extension;
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        var jsonObject = JSON.parse(xhr.responseText);

        // Clear form fields after successful addition
        document.getElementById("firstName").value = "";
        document.getElementById("lastName").value = "";
        document.getElementById("Phone").value = "";
        document.getElementById("Email").value = "";

        // Hide the contact form
        document.getElementById("form-container").style.display = "none"; // Hide the form

        // Show success message
        var messageDisplay = document.getElementById("messageDisplay");
        messageDisplay.innerText = "Contact added. Please wait...";
        messageDisplay.style.display = "block"; // Ensure the message is visible

        // Clear message and refresh the table after 2 seconds
        setTimeout(function () {
          messageDisplay.style.display = "none"; // Hide the message
          showHideForms(); // Show the contact table again
          loadContacts(); // Reload the contacts in the table
        }, 2000); // 2000 milliseconds = 2 seconds
      } else {
        document.getElementById("addResult").innerHTML =
          "Error: " + xhr.status + " " + xhr.statusText;
      }
    }
  };

  xhr.send(jsonPayload);
}

//Show table again.
function showTable() {
  let table = document.getElementById("contactTable");
  let tableContainer = document.getElementById("table-container");
  let contactForm = document.getElementById("contactForm");
  let formContainer = document.getElementById("form-container");
  contactForm.style.display = "none";
  formContainer.style.display = "none";
  table.style.visibility = "visible";
  tableContainer.style.visibility = "visible";
}

function doSignUp() {
  firstName = document.getElementById("firstName").value;
  lastName = document.getElementById("lastName").value;
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;

  if (!firstName || !lastName || !username || !password) {
    document.getElementById("registerResult").innerHTML =
      "All fields must be completed.";
    return;
  }

  let passwordFeedback = validatePassword(password);
  if (passwordFeedback !== "Password meets all requirements.") {
    document.getElementById("registerResult").innerHTML = passwordFeedback;
    return;
  }

  /*
    // Validate other fields
    if (!checkSignUp(firstName, lastName, username, password)) {
        document.getElementById("registerResult").innerHTML = "Please fill out all fields.";
        return;
    }  */

  document.getElementById("registerResult").innerHTML = "";

  let tmp = {
    firstName: firstName,
    lastName: lastName,
    username: username,
    password: password,
  };
  let jsonPayload = JSON.stringify(tmp);
  let url = urlBase + "/Signup." + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  xhr.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status == 403) {
        document.getElementById("registerResult").innerHTML =
          "User already exists.";
        return;
      }

      if (this.status == 200) {
        let jsonObject = JSON.parse(xhr.responseText);
        userId = jsonObject.id;
        document.getElementById("registerResult").innerHTML = "User added";
        firstName = jsonObject.firstName;
        lastName = jsonObject.lastName;
        //saveCookie(); Commented this out for now (Veronica)
      } else {
        document.getElementById("registerResult").innerHTML =
          "Error: " + this.status + " " + xhr.statusText;
      }
    }
  };

  xhr.send(jsonPayload);
}

function doLogin() {
  userId = 0;
  firstName = "";
  lastName = "";

  let login = document.getElementById("loginName").value;
  let password = document.getElementById("loginPassword").value;

  console.log("Login Attempt:", login); // Debugging output
  console.log("Password Attempt:", password); // Debugging output

  document.getElementById("loginResult").innerHTML = "";

  let tmp = { login: login, password: password };
  let jsonPayload = JSON.stringify(tmp);
  let url = urlBase + "/Login." + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  xhr.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status == 200) {
        let jsonObject = JSON.parse(xhr.responseText);
        userId = jsonObject.id;

        console.log("Server Response:", jsonObject); // Debugging output

        if (userId < 1) {
          document.getElementById("loginResult").innerHTML =
            "User/Password combination incorrect";
        } else {
          firstName = jsonObject.firstName;
          lastName = jsonObject.lastName;
          saveCookie();
          window.location.href = "manager.html";
        }
      } else {
        document.getElementById("loginResult").innerHTML =
          "Error: " + this.status + " " + xhr.statusText;
      }
    }
  };

  xhr.send(jsonPayload);
}

//Edited this to store all components separately in the cookie (Veronica)
function saveCookie() {
  let minutes = 20;
  let date = new Date();
  date.setTime(date.getTime() + minutes * 60 * 1000);

  document.cookie =
    "firstName=" +
    encodeURIComponent(firstName) +
    ";expires=" +
    date.toGMTString() +
    ";path=/";
  document.cookie =
    "lastName=" +
    encodeURIComponent(lastName) +
    ";expires=" +
    date.toGMTString() +
    ";path=/";
  document.cookie =
    "userId=" + userId + ";expires=" + date.toGMTString() + ";path=/";

  //document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();

  // document.cookie = "firstName=" + encodeURIComponent(firstName) + ";lastName=" + encodeURIComponent(lastName) + ";userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie() {
  userId = -1;
  let data = document.cookie;
  let splits = data.split(";");
  for (let i = 0; i < splits.length; i++) {
    let thisOne = splits[i].trim();
    let tokens = thisOne.split("=");
    if (tokens[0] === "firstName") {
      firstName = decodeURIComponent(tokens[1]);
    } else if (tokens[0] === "lastName") {
      lastName = decodeURIComponent(tokens[1]);
    } else if (tokens[0] === "userId") {
      userId = parseInt(tokens[1].trim());
    }
  }

  if (userId < 0) {
    window.location.href = "index.html";
  }
}

function doLogout() {
  userId = 0;
  firstName = "";
  lastName = "";
  document.cookie =
    "firstName=;lastName=;userId=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  window.location.href = "index.html";
}

function checkSignUp(firstName, lastName, username, password) {
  // Validate all fields
  if (
    firstName === "" ||
    lastName === "" ||
    username === "" ||
    password === ""
  ) {
    return "All fields must be filled out.";
  }

  // Check password requirements
  var passwordFeedback = validatePassword(password);
  if (passwordFeedback === "Password meets all requirements.") {
    return true; // All requirements are met
  } else {
    return passwordFeedback; // Return specific feedback
  }
}

// Function to validate the password
function validatePassword(password) {
  const lengthIcon = document.getElementById("length-icon");
  const letterIcon = document.getElementById("letter-icon");
  const numberIcon = document.getElementById("number-icon");
  const specialIcon = document.getElementById("special-icon");

  // Reset icons to X marks
  lengthIcon.textContent = "\u274C";
  letterIcon.textContent = "\u274C";
  numberIcon.textContent = "\u274C";
  specialIcon.textContent = "\u274C";

  var feedback = [];

  if (password.length < 8 || password.length > 32) {
    feedback.push("");
  } else {
    lengthIcon.textContent = "\u2714";
  }

  if (!/[A-Za-z]/.test(password)) {
    feedback.push("");
  } else {
    letterIcon.textContent = "\u2714";
  }

  if (!/\d/.test(password)) {
    feedback.push("");
  } else {
    numberIcon.textContent = "\u2714";
  }

  if (!/[@$!%*?&]/.test(password)) {
    feedback.push("");
  } else {
    specialIcon.textContent = "\u2714";
  }

  if (feedback.length > 0) {
    return "Password doesn't meet the requirements.";
  } else {
    return "Password meets all requirements.";
  }
}

// Function to handle real-time password feedback
function showPasswordFeedback() {
  var password = document.getElementById("loginPassword").value;
  var feedback = validatePassword(password);
  var feedbackElement = document.getElementById("password-feedback");

  // Clear previous feedback
  feedbackElement.innerText = feedback;
}

// Attach the function to the input event
document
  .getElementById("loginPassword")
  .addEventListener("input", showPasswordFeedback);

function addCheck(firstName, lastName, Phone, Email) {
  return firstName !== "" && lastName !== "" && Phone !== "" && Email !== "";
}
