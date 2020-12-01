//global customer url
const customerURL = `http://title-town-cards-3-api.herokuapp.com/api/customer/`;

//global employee url
const employeeURL = `http://title-town-cards-3-api.herokuapp.com/api/employee/`;

function addCustomer() {
    //reading in the sign up fields
    const firstName = document.querySelector("#firstName").value;
    const lastName = document.querySelector("#lastName").value;
    const email = document.querySelector("#email").value;
    const phone = document.querySelector("#phoneNum").value;
    const password = document.querySelector("#password").value;
    const verifyPassword = document.querySelector("#verifyPassword").value;

    console.log(firstName, lastName, email, phone, password);

    const url = customerURL;

    fetch(url, {
        method: 'POST',
        headers: {
            "Accept": "application/json",
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            //get these from the dom at some point; these are hardcoded for now
            FirstName: firstName,
            LastName: lastName,
            Email: email,
            Password: password,
            PhoneNumber: phone,
            RewardsPoints: 0
        })
    }).then(response => {
        //temporary console log
        document.querySelector("#firstName").value = "";
        document.querySelector("#lastName").value = "";
        document.querySelector("#email").value = "";
        document.querySelector("#phoneNum").value = "";
        document.querySelector("#password").value = "";
        document.querySelector("#verifyPassword").value = "";
    }).catch(error => console.log(error));
}

//for whatever reason customer login fails the first time you run it, unless you auto reload it
//i wish i knew why lol, but this is gonna have to work for now; this method is just called whenever the page loads
function loginFixer() {
    var url = window.location.href;

    //if the url doesn't have this suffix already, add it and reload; i have no clue why but this seems to be necessary
    if (!url.includes('?#')) {
        url += '?#';
        window.location.replace(url);
    }
}

function logInCustomer() {
    const email = document.querySelector("#uname").value;
    const password = document.querySelector("#psw").value;

    console.log(email, password);

    const url = customerURL;

    fetch(url, {
        method: 'PUT',
        headers: {
            "Accept": "application/json",
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            //get these from the dom at some point; these are hardcoded for now
            Email: email,
            Password: password
        })
    }).then(response => response.json()).then(num => {
        //-1 means the customer doesn't exist, so we keep them as a guest; anything else means the customer is signed in
        if (num === -1) {
            alert("Incorrect log-in information, please try again.");
            localStorage.setItem("customer", "GUEST");
            localStorage.removeItem("rewardsPoints");
        } else {
            alert("SUCCESS: You are now logged in as " + email);
            localStorage.setItem("rewardsPoints", num);
            localStorage.setItem("customer", email);   
            //clearing the sign in fields if the customer signed in
            document.querySelector("#uname").value = '';
            document.querySelector("#psw").value = '';
        }
    })
    .catch(error => console.log(error));
}

//this function adds a new employee to the database
function addEmployee() {
    //reading in the sign up fields
    const firstName = document.querySelector("#fname").value;
    const lastName = document.querySelector("#lname").value;
    const address = document.querySelector("#addr").value;
    const ssn = parseInt(document.querySelector("#ssn").value);
    const birthdate = document.querySelector("#dob").value;
    const username = document.querySelector("#uname").value;
    const password = document.querySelector("#psw").value;
    const verifyPassword = document.querySelector("#vpsw").value;

    console.log(firstName, lastName, address, ssn, birthdate, username, password);

    const url = employeeURL;

    fetch(url, {
        method: 'POST',
        headers: {
            "Accept": "application/json",
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            //get these from the dom at some point; these are hardcoded for now
            FirstName: firstName,
            LastName: lastName,
            Address: address,
            SSN: ssn,
            BirthDate: birthdate,
            Username: username,
            Password: password
        })
    }).then(response => {
        //temporary console log
        document.querySelector("#fname").value = "";
        document.querySelector("#lname").value = "";
        document.querySelector("#addr").value = "";
        document.querySelector("#ssn").value = "";
        document.querySelector("#dob").value = "";
        document.querySelector("#uname").value = "";
        document.querySelector("#psw").value = "";
        document.querySelector("#vpsw").value = "";
    }).catch(error => console.log(error));
}

//this method is for logging an employee in
function logInEmployee() {
    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;

    console.log(username, password);

    const url = employeeURL;

    fetch(url, {
        method: 'PUT',
        headers: {
            "Accept": "application/json",
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            //get these from the dom at some point; these are hardcoded for now
            Username: username,
            Password: password
        })
    }).then(response => response.json()).then(num => {
        //-1 means the customer doesn't exist, so we keep them as a guest; anything else means the customer is signed in
        if (num === -1) {
            alert("Incorrect log-in information, please try again.");
            localStorage.setItem("employee", 0);
        } else {
            alert("SUCCESS: You are now logged in as " + username + " (ID: " + num + ")");
            localStorage.setItem("employee", num);   
            //clearing the sign in fields if the customer signed in
            document.querySelector("#username").value = '';
            document.querySelector("#password").value = '';
        }
    })
    .catch(error => console.log(error));
}