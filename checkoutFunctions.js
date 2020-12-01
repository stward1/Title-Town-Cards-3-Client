function loadCartInfo() {
    //if the customer hasn't signed in by now we mark them as a guest
    if (localStorage.getItem("customer") === null || localStorage.getItem("customer") === "") {
        localStorage.setItem("customer", "GUEST");
    }    

    const itemString = localStorage.getItem("cartItems");

    fetch(`http://title-town-cards-3-api.herokuapp.com/api/items/cartinfo/${itemString}`)
    .then(response => response.json())
    .then(cartInfo => {

        //saving the rewards points from this transaction
        localStorage.setItem("newPoints", cartInfo.rewards);

        document.querySelector("#cartSubtotal").innerHTML = '$' + cartInfo.subtotal.toFixed(2);

        //insert discount here lol; because we said this is optional originally we may take this logic out for a button click event later
        if (localStorage.getItem("customer") === "GUEST" || parseInt(localStorage.getItem("rewardsPoints")) < 5) {
            //if the customer is a guest, the discount is 0 and the total is the total from cart info
            document.querySelector("#cartDiscount").innerHTML = '($0.00)';        
            document.querySelector("#cartTotal").innerHTML = '<b>$' + cartInfo.total.toFixed(2) + '</b>';
        } else {
            //if the customer isn't a guest, the discount is the same amount as tax (10% of the subtotal), which means the total is the subtotal
            //technically all the discount does is cancel out the sales tax; this would be easy math to fix later if the tax or rewards amount changed
            document.querySelector("#cartDiscount").innerHTML = '($' + cartInfo.tax.toFixed(2) + ')';
            document.querySelector("#cartTotal").innerHTML = '<b>$' + cartInfo.subtotal.toFixed(2) + '</b>';
        }

        document.querySelector("#cartTax").innerHTML = '$' + cartInfo.tax.toFixed(2);
    }).catch(error => console.log(error));   
}

//this function is for completing a transaction; activated on clicking the complete button
function completeTransaction() {
    //handling a bad input
    if (!isCardNumberValid()) {
        //error message; this should probably get made into a modal or something later, low priority though
        alert("Error: That card number is invalid, please try again...");

        //resetting the card inputs
        document.querySelector("#ccnum").value = '';
        document.querySelector("#ccnumMatch").value = '';        
    } else {
        //this function adds the transaction to the database 
        addTransaction();
    }
}

function addTransaction() {
    const url = 'http://title-town-cards-3-api.herokuapp.com/api/transaction/';

    const stringItems = localStorage.getItem("cartItems").split(',');
    var discount  = document.getElementById("cartDiscount").textContent;
    discount = discount.substring(2);
    discount = discount.substring(-1);
    discount = parseFloat(discount);

    var itemIDs = [];

    stringItems.forEach(item => itemIDs.push(parseInt(item)));

    fetch(url, {
        method: 'POST',
        headers: {
            "Accept": "application/json",
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            //get these from the dom at some point; these are hardcoded for now
            PaymentType: "Card",
            EmployeeID: parseInt(localStorage.getItem("employee")),
            CustomerEmail: localStorage.getItem("customer"),
            ItemIDs: itemIDs,
            AmtDiscounted: discount
        })
    }).then(response => {
        //these basically are just what we want to do back in the completeTransaction function, but the async stuff isn't worth messing with, we'll just do it here
        //emptying the cart
        localStorage.setItem("cartItems", "");
        updateRewardsPoints();
    }).catch(error => console.log(error));
}

//this happens immediately after the transaction is added
function updateRewardsPoints()
{
    var points = parseInt(localStorage.getItem("newPoints"));
    points += parseInt(localStorage.getItem("rewardsPoints"));

    if (parseInt(localStorage.getItem("rewardsPoints")) > 4) {
        console.log('correct1');
        points -= 5;
    }

    localStorage.setItem("rewardsPoints", points);

    if (localStorage.getItem("customer") !== "GUEST") {
        console.log('correctw');
        
        const url = `http://title-town-cards-3-api.herokuapp.com/api/customer/${localStorage.getItem("customer")}`;

        fetch(url, {
            method: 'PUT',
            headers: {
                "Accept": "application/json",
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                //get these from the dom at some point; these are hardcoded for now
                RewardsPoints: parseInt(localStorage.getItem("rewardsPoints")),
                Email: localStorage.getItem("customer")
            })
        }).then(response => response.json()
        .then(num => {
            localStorage.setItem("rewardsPoints", num)
            //sending the user to the success screen
            window.location.replace("orderThankYou.html");
        })).catch(error => console.log(error));        
    } else {
        window.location.replace("orderThankYou.html");
    }
}

function ShowNewPoints() {
    if (localStorage.getItem("customer") !== "GUEST") {
        document.querySelector("#pointsMessage").textContent = `You just earned ${localStorage.getItem("newPoints")} rewards points!`;
    } else {
        document.querySelector("#pointsMessage").textContent = `You could have earned ${localStorage.getItem("newPoints")} rewards points...`;
        //guests shouldn't have rewards points tracked; this doesn't really matter much but it's for clean-up
        localStorage.removeItem("rewardsPoints");
    }
    
    localStorage.removeItem("newPoints");
}

//this method is going to go through all the checks for card numbers
function isCardNumberValid() {
    //grabbing the card number(s)
    const cardNumber = parseInt(document.querySelector("#ccnum").value);
    const verifyNumber = parseInt(document.querySelector("#ccnumMatch").value);

    //identifier numbers are found in the first six digits of the card number
    const numberString = document.querySelector("#ccnum").value.slice(0, 6);
    const clippedNumber = parseInt(numberString);

    //if the card numbers don't match, return false
    if (cardNumber !== verifyNumber) { return false };

    //with the matching check passed, now all we need is one of these to be true for the card to be valid
    if (isCardAmex(clippedNumber)) { return true };
    if (isCardDiscover(clippedNumber)) { return true };
    if (isCardMastercard(clippedNumber)) { return true };
    if (isCardVisa(clippedNumber)) { return true };
}

//the following several methods are for card verification
//this logic is simple enough for the front end, but if it grew much more we'd likely want to put it in the back end
//we're just checking for IINs but we could potentially add a length checker too, but we never discussed that as in scope
function isCardAmex(number) {
    const stringNum = number.toString();

    if (stringNum.includes("34")) { return true };
    if (stringNum.includes("37")) { return true };

    return false;
}

function isCardDiscover(number) {
    if (String(number).includes("6011")) { return true };
    if (String(number).includes("64")) { return true };
    if (String(number).includes("65")) { return true };

    if (number >= 622126 && number <= 622925) { return true };
    if (number >= 624000 && number <= 626999) { return true };
    if (number >= 628200 && number <= 628899) { return true };

    return false;
}

function isCardMastercard(number) {
    //ok so this one is a little confusing, but i'm fairly confident the mastercard check is either starting with 51-55
    //getting the first two digits of the number
    const firstTwo = parseInt(String(number).slice(0, 2));

    if (firstTwo >= 51 && firstTwo <= 55) { return true };

    return false;
}

function isCardVisa(number) {
    //visa just has 4 as the first digit, so we just need the first digit
    const firstDigit = String(number).slice(0, 1);

    if (firstDigit === '4') { return true };

    return false;
}