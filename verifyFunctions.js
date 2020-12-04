//this method returns a boolean for whether or not the user is signed in as a valid employee
function isEmployee() {
    if (localStorage.getItem("employee") === "0" || localStorage.getItem("employee") === null) {
        return false;
    }

    return true;
}

//this method secures the reporting functionality
function goToReporting() {
    if (!isEmployee()) {
        alert("ACCESS RESTRICTED: You must be signed in as an employee to access reporting.");

        window.location.replace("index.html");
    }
}

//this method secures the inventory edit functionality
function goToInvEdit() {
    if (!isEmployee()) {
        alert("ACCESS RESTRICTED: You must be signed in as an employee to access inventory editing.");

        window.location.replace("index.html");
    }    
}