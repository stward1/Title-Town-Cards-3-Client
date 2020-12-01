//THIS FILE HOLDS METHODS FOR BROWSING ITEMS; DEFINITELY SHOULD BE SPLIT UP LATER

//global API url
const itemURL = `http://title-town-cards-3-api.herokuapp.com/api/items/`

function saveCart() {
    //getting the comma delimited string of items
    const itemString = document.querySelector("#cart").getAttribute("items");
    if (itemString !== '') {
        //saving the item string to local storage; this will let us load the cart info from the back end later
        localStorage.setItem('cartItems', itemString);
        //redirecting to the customer cart page (this should probably be made conditional for when employees check out later)
        window.location.href = "customerCart.html";
    }
}

function addItemToCart(e) {
    //stopping the a tag from linking
    e.preventDefault();
    
    //some of the logic here will depend on what e.target is; i'm going to assume we need to go one parent layer up
    const itemDiv = e.target.parentElement
    //we haven't really defined the HTML for a cart yet so i'll have to make some guesses about the attribute structure
    const cart = document.getElementById("cart");

    //we might have a list or long string of item IDs in the cart, DEBUG HERE
    if (cart.getAttribute("items") !== "") {
        cart.setAttribute("items", cart.getAttribute("items") + ',' + itemDiv.id);
    } else {
        cart.setAttribute("items", itemDiv.id);
    }
    //adding the price to the subtotal
    cart.setAttribute("subtotal", (parseFloat(cart.getAttribute("subtotal")) + parseFloat(itemDiv.getAttribute("price"))).toFixed(2));
    //the tax is always 10% of the subtotal; it's easier to do this than to iterate
    cart.setAttribute("tax", parseFloat(parseFloat(cart.getAttribute("subtotal")) * 0.1).toFixed(2));
    //rewards points is subtotal divided by 10 rounded down
    cart.setAttribute("rewards", Math.floor(parseFloat(cart.getAttribute("subtotal")) / 10).toFixed(2));

    //changing the button (which we're assuming is e) so it will look different and remove the item
    //e.target.class = "btn btn-secondary";
    e.target.textContent = "Remove Item";
    //now the button should remove the item if clicked again
    e.target.removeEventListener('click', addItemToCart);
    e.target.addEventListener("click", removeItemFromCart);

    //updating cart display
    document.getElementById("cartSubtotalDisplay").textContent = cart.getAttribute("subtotal");
    document.getElementById("cartItemsDisplay").textContent = cart.getAttribute("items");
    document.getElementById("cartTaxDisplay").textContent = cart.getAttribute("tax");
    document.getElementById("cartRewardsDisplay").textContent = cart.getAttribute("rewards");
}

function removeItemFromCart(e) {
    e.preventDefault();

    //the parent logic is the same here
    const itemDiv = e.target.parentElement;

    //we're basically just undoing what we did for the add function; DEBUG HERE if add function is revised
    const cart = document.getElementById("cart");

    //we might have a list or long string of item IDs in the cart, DEBUG HERE
    cart.setAttribute("items", cart.getAttribute("items").replaceAll(itemDiv.id, ""));
    //removing leading comma from the items list if necessary
    if (cart.getAttribute("items")[0] === ',') {
        cart.setAttribute("items", cart.getAttribute("items").substring(1));
    } else if (cart.getAttribute("items").slice(-1) === ',') {
        //slicing off a trailing comma if there is one
        cart.setAttribute("items", cart.getAttribute("items").slice(0, -1));
    }
    //cleaning up duplicate commas if necessary
    cart.setAttribute("items", cart.getAttribute("items").replaceAll(',,', ","));
    
    //subtracting the price from the subtotal
    cart.setAttribute("subtotal", (parseFloat(cart.getAttribute("subtotal")) - parseFloat(itemDiv.getAttribute("price"))).toFixed(2));
    //the tax is always 10% of the subtotal; it's easier to do this than to iterate
    cart.setAttribute("tax", parseFloat(parseFloat(cart.getAttribute("subtotal")) * 0.1).toFixed(2));
    //rewards points is subtotal divided by 10 rounded down
    cart.setAttribute("rewards", Math.floor(parseFloat(cart.getAttribute("subtotal")) / 10).toFixed(2));

    //making the button look normal again
    //e.target.class = "btn btn-primary";
    e.target.textContent = "Add to Cart";
    //the button will now add items again
    e.target.removeEventListener('click', removeItemFromCart);
    e.target.addEventListener("click", addItemToCart);

    //updating the cart display
    document.getElementById("cartSubtotalDisplay").textContent = cart.getAttribute("subtotal");
    document.getElementById("cartItemsDisplay").textContent = cart.getAttribute("items");
    document.getElementById("cartTaxDisplay").textContent = cart.getAttribute("tax");
    document.getElementById("cartRewardsDisplay").textContent = cart.getAttribute("rewards");
}

function loadAllItemsForShopping() {
    fetch(itemURL)
        .then(response => response.json())
        .then(items => {
            items.forEach(item => {
                //making the new div with all the attributes
                var newDiv = document.createElement("div");
                newDiv.className = "inv-item";
                newDiv.id = `${item.itemID}`;
                newDiv.setAttribute("type", "");
                newDiv.setAttribute("filterStatus", "");
                newDiv.setAttribute("name", `"${item.itemName}"`);
                newDiv.setAttribute("year", item.itemYear);
                newDiv.setAttribute("price", item.itemPrice);
                newDiv.setAttribute("cost", item.itemCost);
                newDiv.setAttribute("description", `"${item.itemMemorabiliaDescription}"`);
                newDiv.setAttribute("condition", `"${item.itemCardCondition}"`);
                newDiv.setAttribute("team", `"${item.itemCardTeam}"`);
                newDiv.setAttribute("sport", `"${item.itemCardSport}"`);
                newDiv.setAttribute("isPurchased", item.itemIsPurchased);                
                var html= '';

                //this is how we see if an item is a card or memorabilia; this case is a card
                if (item.itemCardCondition !== "") {
                    //fixing the type attribute for card
                    newDiv.setAttribute("type", "card"); 
                    //html for a new card
                    html =
                    `
                        <img src="./resources/images/logoPlaceholder.png">
                        <h4>${item.itemName}</h4><br>
                        <span><strong>ID:</strong> ${item.itemID}</span><br>
                        <span><strong>Year:</strong> ${item.itemYear}</span><br>
                        <span><strong>Price:</strong> ${item.itemPrice}</span><br>
                        <span><strong>Condition:</strong> ${item.itemCardCondition}</span><br>
                        <span><strong>Team:</strong> ${item.itemCardTeam}</span><br>
                        <span><strong>Sport:</strong> ${item.itemCardSport}</span><br>
                        <a href="#" class="cart-btn">Add To Cart</a>                    
                    `;
                } else {
                    //typing memorabilia
                    newDiv.setAttribute("type", "memorabilia"); 
                    //html for a new card
                    html =
                    `
                        <img src="./resources/images/logoPlaceholder.png">
                        <h4>${item.itemName}</h4><br>
                        <span><strong>ID:</strong> ${item.itemID}</span><br>
                        <span><strong>Year:</strong> ${item.itemYear}</span><br>
                        <span><strong>Price:</strong> ${item.itemPrice}</span><br>
                        <span><strong>Description:</strong> ${item.itemMemorabiliaDescription}</span><br><br>
                        <a href="#" class="cart-btn">Add To Cart</a>                    
                    `;
                }

                //adding the html into the new div
                newDiv.innerHTML = html;
                //for purchased items, hide by default
                if (item.itemIsPurchased === true) {
                    newDiv.style.display = "none";
                    //altering the add button so it isn't usable
                    newDiv.lastElementChild.textContent = "UNAVAILABLE";
                    newDiv.lastElementChild.style = "pointer-events: none; cursor: default";
                } else {
                    //adding the add function if not purchased
                    newDiv.lastElementChild.addEventListener('click', addItemToCart);
                }                

                //this line needs to insert the display somewhere; for now it can just be inside an item div
                document.querySelector("#items").appendChild(newDiv);              
            })
        }).catch(error => console.log(error));
}

function loadAllItemsForEditing() {
    //emptying the div first, this is necessary to stop duplication when updating/deleting
    document.querySelector("#items").innerHTML = ``;

    fetch(itemURL)
        .then(response => response.json())
        .then(items => {
            items.forEach(item => {
                //making the new div with all the attributes
                var newDiv = document.createElement("div");
                newDiv.className = "inv-item";
                newDiv.id = `${item.itemID}`;
                newDiv.setAttribute("type", "");
                newDiv.setAttribute("filterStatus", "");
                newDiv.setAttribute("name", `"${item.itemName}"`);
                newDiv.setAttribute("year", item.itemYear);
                newDiv.setAttribute("price", item.itemPrice);
                newDiv.setAttribute("cost", item.itemCost);
                newDiv.setAttribute("description", `"${item.itemMemorabiliaDescription}"`);
                newDiv.setAttribute("condition", `"${item.itemCardCondition}"`);
                newDiv.setAttribute("team", `"${item.itemCardTeam}"`);
                newDiv.setAttribute("sport", `"${item.itemCardSport}"`);
                newDiv.setAttribute("isPurchased", item.itemIsPurchased);                
                var html= '';

                //this is how we see if an item is a card or memorabilia; this case is a card
                if (item.itemCardCondition !== "") {
                    //fixing the type attribute for card
                    newDiv.setAttribute("type", "card"); 
                    //html for a new card
                    html =
                    `
                        <img src="./resources/images/logoPlaceholder.png">
                        <h4>${item.itemName}</h4><br>
                        <span><strong>ID:</strong> ${item.itemID}</span><br>
                        <span><strong>Year:</strong> ${item.itemYear}</span><br>
                        <span><strong>Price:</strong> ${item.itemPrice}</span><br>
                        <span><strong>Condition:</strong> ${item.itemCardCondition}</span><br>
                        <span><strong>Team:</strong> ${item.itemCardTeam}</span><br>
                        <span><strong>Sport:</strong> ${item.itemCardSport}</span><br>
                        <button type="button" class="cart-btn btn" data-toggle="modal" data-target="#modifyModal">Modify/Delete</button>                  
                    `;
                } else {
                    //typing memorabilia
                    newDiv.setAttribute("type", "memorabilia"); 
                    //html for a new card
                    html =
                    `
                        <img src="./resources/images/logoPlaceholder.png">
                        <h4>${item.itemName}</h4><br>
                        <span><strong>ID:</strong> ${item.itemID}</span><br>
                        <span><strong>Year:</strong> ${item.itemYear}</span><br>
                        <span><strong>Price:</strong> ${item.itemPrice}</span><br>
                        <span><strong>Description:</strong> ${item.itemMemorabiliaDescription}</span><br><br>
                        <button type="button" class="cart-btn btn" data-toggle="modal" data-target="#modifyModal">Modify/Delete</button>                  
                    `;
                }

                //adding the html into the new div
                newDiv.innerHTML = html;
                //for purchased items, hide by default
                if (item.itemIsPurchased === true) {
                    newDiv.style.display = "none";
                    //altering the add button so it isn't usable
                    newDiv.lastElementChild.textContent = "UNAVAILABLE";
                    newDiv.lastElementChild.style = "pointer-events: none; cursor: default";
                } else {
                    //adding the add function if not purchased
                    newDiv.lastElementChild.addEventListener('click', loadModifyModal);
                }                

                //this line needs to insert the display somewhere; for now it can just be inside an item div
                document.querySelector("#items").appendChild(newDiv);              
            })
        }).catch(error => console.log(error));
}

function loadCardModal() {
    document.querySelector("#creationTitle").textContent = "Create Card";
    document.querySelector("#confirmMemorabilia").style = "display: none;";
    document.querySelector("#confirmCard").style = "display: inline;";

    var html = `
    <span><input id="newName" type="text" style="height: 20px" placeholder="Name Here"></span><br>
    <span><input id="newYear" type="number" style="height: 20px" placeholder="Year Here"></span><br>
    <span><input id="newPrice" type="number" style="height: 20px" placeholder="Price Here"></span><br>
    <span><input id="newCost" type="number" style="height: 20px" placeholder="Cost Here"></span><br>
    `;

    document.querySelector("#cardCreationFields").style = "display: inline;";
    document.querySelector("#memorabiliaCreationFields").style = "display: none;";
    
    html += `
    <span><input id="newCondition" type="text" style="height: 20px" placeholder="Condition Here"></span><br>
    <span><input id="newTeam" type="text" style="height: 20px" placeholder="Team Here"></span><br>
    <span><input id="newSport" type="text" style="height: 20px" placeholder="Sport Here"></span><br>`;

    document.querySelector("#creationInputs").innerHTML = html;
}

function loadMemorabiliaModal() {
    document.querySelector("#creationTitle").textContent = "Create Memorabilia";
    document.querySelector("#confirmMemorabilia").style = "display: inline;";
    document.querySelector("#confirmCard").style = "display: none;";

    var html = `
    <span><input id="newName" type="text" style="height: 20px" placeholder="Name Here"></span><br>
    <span><input id="newYear" type="number" style="height: 20px" placeholder="Year Here"></span><br>
    <span><input id="newPrice" type="number" style="height: 20px" placeholder="Price Here"></span><br>
    <span><input id="newCost" type="number" style="height: 20px" placeholder="Cost Here"></span><br>
    `;

    document.querySelector("#cardCreationFields").style = "display: none;";
    document.querySelector("#memorabiliaCreationFields").style = "display: inline;";
    
    html += `
    <span><input id="newDescription" type="text" style="height: 20px" placeholder="Description Here"></span><br>`;
    document.querySelector("#creationInputs").innerHTML = html;
}

//this function is a better way to check for card/memorabilia because sometimes a field will end up as ""
function isCard(itemDiv) {
    var condition = itemDiv.getAttribute("condition");
    //replacing "" with nothing
    condition = condition.replaceAll(`""`, "");
    
    if (condition !== "") {
        return true;
    }

    return false;
}

function loadModifyModal(e) {
    const itemDiv = e.target.parentElement;
    
    //this is the html for inputs that happens for cards and memorabilia
    var html = `
    <h4 id="currentItemId">${itemDiv.getAttribute("id")}</h4><br>
    <span><input id="modName" type="text" style="height: 20px" value=${itemDiv.getAttribute("name")}></span><br>
    <span><input id="modYear" type="number" style="height: 20px" value="${itemDiv.getAttribute("year")}"></span><br>
    <span><input id="modPrice" type="number" style="height: 20px" value="${itemDiv.getAttribute("price")}"></span><br>`;

    //this is for items that are cards
    if (isCard(itemDiv))
    {
        //updating the modal for card editing
        document.querySelector("#cardModalFields").style = "display: inline;";
        document.querySelector("#memorabiliaModalFields").style = "display: none;";
        
        html += `
        <span><input id="modCondition" type="text" style="height: 20px" value=${itemDiv.getAttribute("condition")}></span><br>
        <span><input id="modTeam" type="text" style="height: 20px" value=${itemDiv.getAttribute("team")}></span><br>
        <span><input id="modSport" type="text" style="height: 20px" value=${itemDiv.getAttribute("sport")}></span><br>`;
    } else {
        //this is for memorabilia editing
        document.querySelector("#cardModalFields").style = "display: none;";
        document.querySelector("#memorabiliaModalFields").style = "display: inline;";

        html += 
        `<span><input id="modDescription" type="text" style="height: 20px" value=${itemDiv.getAttribute("description")}></span><br>`;
    }

    document.querySelector("#modifyInputs").innerHTML = html;
}

//this is the method to add a card to the database
function addCard() {
    //reading in the card fields
    const newName = document.querySelector("#newName").value;
    const newYear = parseInt(document.querySelector("#newYear").value);
    const newPrice = parseFloat(document.querySelector("#newPrice").value);
    const newCost = parseFloat(document.querySelector("#newCost").value);

    var newCondition = document.querySelector("#newCondition").value;
    const newTeam = document.querySelector("#newTeam").value;
    const newSport = document.querySelector("#newSport").value;
    
    //there's some front end logic that relies on conditions not being blank, so this is a default value basically
    if (newCondition === '') {
        newCondition = "Unspecified";
    }

    const url = itemURL;

    //post request
    fetch(url, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            ItemName: newName,
            ItemYear: newYear,
            ItemPrice: newPrice,
            ItemCost: newCost,
            ItemMemorabiliaDescription: "",
            ItemCardSport: newSport,
            ItemCardTeam: newTeam,
            ItemCardCondition: newCondition
        })
    }).then(response => {
        //after adding the item, we refresh the page
        loadAllItemsForEditing();
    }).catch(error => console.log(error));  //logs errors if they arise
}

function addMemorabilia() {
    //reading in the memorabilia fields
    const newName = document.querySelector("#newName").value;
    const newYear = parseInt(document.querySelector("#newYear").value);
    const newPrice = parseFloat(document.querySelector("#newPrice").value);
    const newCost = parseFloat(document.querySelector("#newCost").value);

    const newDescription = document.querySelector("#newDescription").value;

    const url = itemURL;

    //post request
    fetch(url, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            ItemName: newName,
            ItemYear: newYear,
            ItemPrice: newPrice,
            ItemCost: newCost,
            ItemMemorabiliaDescription: newDescription,
            ItemCardSport: "",
            ItemCardTeam: "",
            ItemCardCondition: ""
        })
    }).then(response => {
        //after adding the item, we refresh the page
        loadAllItemsForEditing();
    }).catch(error => console.log(error));  //logs errors if they arise
}

//this method just handles diverting an item into modify card or memorabilia
function modifyItem() {
    //the fastest way to do this is to just check and see which fields are displayed
    if (document.querySelector("#cardModalFields").style.display === "inline")
    {
        modifyCard();
    } else {
        modifyMemorabilia();
    }
}

function modifyCard() {
    //reading in all the values
    const itemId = parseInt(document.querySelector("#currentItemId").textContent);
    const newName = document.querySelector("#modName").value;
    const newYear = parseFloat(document.querySelector("#modYear").value);
    const newPrice = parseFloat(document.querySelector("#modPrice").value);
    const newCondition = document.querySelector("#modCondition").value;
    const newTeam = document.querySelector("#modTeam").value;
    const newSport = document.querySelector("#modSport").value;

    const url = `${itemURL}${itemId}`;
    
    fetch(url, {
        method: "PUT",
        headers: {
            "Accept": "application/json",
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            ItemID: itemId,
            ItemName: newName,
            ItemPrice: newPrice,
            ItemYear: newYear,
            ItemCardCondition: newCondition,
            ItemCardTeam: newTeam,
            ItemCardSport: newSport
        })
    }).then(response => {
        loadAllItemsForEditing();
    }).catch(error => console.log(error));
}

function modifyMemorabilia() {
    //reading in all the values
    const itemId = parseInt(document.querySelector("#currentItemId").textContent);
    const newName = document.querySelector("#modName").value;
    const newYear = parseFloat(document.querySelector("#modYear").value);
    const newPrice = parseFloat(document.querySelector("#modPrice").value);
    const newDescription = document.querySelector("#modDescription").value;

    const url = `${itemURL}${itemId}`;
    
    fetch(url, {
        method: "PUT",
        headers: {
            "Accept": "application/json",
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            ItemID: itemId,
            ItemName: newName,
            ItemPrice: newPrice,
            ItemYear: newYear,
            ItemMemorabiliaDescription: newDescription
        })
    }).then(response => {
        loadAllItemsForEditing();
    }).catch(error => console.log(error));
}

//this function is for deleting an item
function deleteItem() {
    //grabbing the id to delete
    const itemId = parseInt(document.querySelector("#currentItemId").textContent);

    const url = `${itemURL}${itemId}`;
    
    fetch(url, {
        method: "DELETE",
        headers: {
            "Accept": "application/json",
            "Content-type": "application/json"
        }
    }).then(response => {
        loadAllItemsForEditing();
    }).catch(error => console.log(error));
}

//this function returns a boolean based on the filter status, purchase status, and card/memorabilia
function shouldBeShown(itemDiv) {
    return isFilterPassed(itemDiv) && isPurchaseStatusPassed(itemDiv) && isShownType(itemDiv);
}

//this function shows/hides all items appropriately
function updateItemDisplay(items) {
    for (let i = 0; i < items.length; i++) {
        if (shouldBeShown(items[i])) {
            items[i].style.display = "inline";
        } else {
            items[i].style.display = "none";
        }
    }
}

//checking for no filters
function isFilterPassed(itemDiv) {
    if (itemDiv.getAttribute("filterStatus") === "") {
        return true;
    } else {
        return false;
    }
}

//checking to see if a div should be hidden based on purchase status
function isPurchaseStatusPassed(itemDiv) {
    if (itemDiv.getAttribute("isPurchased") === "true") {
        if (document.querySelector("#purchasedFilter").getAttribute("status") === "shown") {
            return true;
        } else {
            return false;
        }
    } else {
        return true;
    }
}

//checking for card/memorabilia show status
function isShownType(itemDiv) {
    if (itemDiv.getAttribute("type") === "card") {
        if (document.querySelector("#cardFilter").getAttribute("status") === "shown") {
            return true;
        } else {
            return false;
        }
    } else {
        if (document.querySelector("#memorabiliaFilter").getAttribute("status") === "shown") {
            return true;
        } else {
            return false;
        }
    }
}

function clearAllFilters() {
    //reading all the item divs from the front-end
    const itemDivs = document.querySelector("#items").children;
    //reading all the filter inputs
    const filterInputs = document.querySelector("#filters").children;

    //clearing the filter inputs
    for (let i = 0; i < filterInputs.length; i++) {
        filterInputs[i].value = '';
    }

    //looping through divs; showing all of them
    for (let i = 0; i < itemDivs.length; i++) {
        itemDivs[i].setAttribute("filterStatus", "");
    }

    //updating item display
    updateItemDisplay(itemDivs);
}

function filterCards() {
    //reading all the item divs from the front-end
    const itemDivs = document.querySelector("#items").children;
    //getting the current status of the cards
    const status = document.querySelector("#cardFilter").getAttribute("status");

    //updating the filter element    
    if (status === "shown") {
        document.querySelector("#cardFilter").setAttribute("status", "hidden");
        document.querySelector("#cardFilter").textContent = "Show Cards";
        //updating the filters for all items when trying to hide cards
        for (let i = 0; i < itemDivs.length; i++) {
            if (itemDivs[i].getAttribute("type") === "card") {
                itemDivs[i].setAttribute("filterStatus", itemDivs[i].getAttribute("filterStatus") + "type");
            } else {
                itemDivs[i].setAttribute("filterStatus", itemDivs[i].getAttribute("filterStatus").replaceAll("type", ""));
            }
        }        
    } else {
        document.querySelector("#cardFilter").setAttribute("status", "shown");
        document.querySelector("#cardFilter").textContent = "Hide Cards";
        for (let i = 0; i < itemDivs.length; i++) {
            if (itemDivs[i].getAttribute("type") === "card") {
                itemDivs[i].setAttribute("filterStatus", itemDivs[i].getAttribute("filterStatus").replaceAll("type", ""));
            }
        }
    }
    //displaying items correctly
    updateItemDisplay(itemDivs);
}

function filterMemorabilia() {
    //reading all the item divs from the front-end
    const itemDivs = document.querySelector("#items").children;
    //getting the current status of the cards
    const status = document.querySelector("#memorabiliaFilter").getAttribute("status");

    //updating the filter element    
    if (status === "shown") {
        document.querySelector("#memorabiliaFilter").setAttribute("status", "hidden");
        document.querySelector("#memorabiliaFilter").textContent = "Show Memorabilia";
        //updating the filters for all items when trying to hide cards
        for (let i = 0; i < itemDivs.length; i++) {
            if (itemDivs[i].getAttribute("type") === "memorabilia") {
                itemDivs[i].setAttribute("filterStatus", itemDivs[i].getAttribute("filterStatus") + "type");
            } else {
                itemDivs[i].setAttribute("filterStatus", itemDivs[i].getAttribute("filterStatus").replaceAll("type", ""));
            }
        }        
    } else {
        document.querySelector("#memorabiliaFilter").setAttribute("status", "shown");
        document.querySelector("#memorabiliaFilter").textContent = "Hide Memorabilia";
        for (let i = 0; i < itemDivs.length; i++) {
            if (itemDivs[i].getAttribute("type") === "memorabilia") {
                itemDivs[i].setAttribute("filterStatus", itemDivs[i].getAttribute("filterStatus").replaceAll("type", ""));
            }
        }
    }
    //displaying items correctly
    updateItemDisplay(itemDivs);
}

function filterPurchased() {
    //reading all the item divs from the front-end
    const itemDivs = document.querySelector("#items").children;
    //getting the current status of the purchase filter
    const status = document.querySelector("#purchasedFilter").getAttribute("status");

    if (status === "hidden") {
        document.querySelector("#purchasedFilter").setAttribute("status", "shown");
        document.querySelector("#purchasedFilter").textContent = "Exclude Purchased Items";        
    } else {
        document.querySelector("#purchasedFilter").setAttribute("status", "hidden");
        document.querySelector("#purchasedFilter").textContent = "Include Purchased Items";
    }

    updateItemDisplay(itemDivs);
}

function filterByID() {
    //reading all the item divs from the front-end
    const itemDivs = document.querySelector("#items").children;
    //getting the user's filter input
    const filterId = document.querySelector("#itemIDInput").value;

    //looping through divs
    for (let i = 0; i < itemDivs.length; i++) {
        //checking to see if the filter input is part of the item's field
        if (!itemDivs[i].id.includes(filterId)) {
            //updating filtered out status
            itemDivs[i].setAttribute("filterStatus", itemDivs[i].getAttribute("filterStatus") + "id");        
        }
        else {
            //if the filter field hasn't been failed, remove field from the filter status
            itemDivs[i].setAttribute("filterStatus", itemDivs[i].getAttribute("filterStatus").replaceAll("id", ""));
        }
    }

    //updating display
    updateItemDisplay(itemDivs);
}

function filterByName() {
    //reading all the item divs from the front-end
    const itemDivs = document.querySelector("#items").children;
    //getting the user's filter input
    const filterName = document.querySelector("#itemNameInput").value;

    //looping through divs
    for (let i = 0; i < itemDivs.length; i++) {
        //checking to see if the filter input is part of the item's field
        if (!itemDivs[i].getAttribute("name").includes(filterName)) {
            //updating filtered out status
            itemDivs[i].setAttribute("filterStatus", itemDivs[i].getAttribute("filterStatus") + "name");        
        }
        else {
            //if the filter field hasn't been failed, remove field from the filter status
            itemDivs[i].setAttribute("filterStatus", itemDivs[i].getAttribute("filterStatus").replaceAll("name", ""));
        }
    }

    //updating display
    updateItemDisplay(itemDivs);
}

function filterByMinYear() {
    //reading all the item divs from the front-end
    const itemDivs = document.querySelector("#items").children;
    //getting the user's filter input
    const filterMinYear = parseInt(document.querySelector("#itemMinYearInput").value);

    //looping through divs
    for (let i = 0; i < itemDivs.length; i++) {
        //checking to see if the filter input is part of the item's field
        if (parseInt(itemDivs[i].getAttribute("year")) < filterMinYear) {
            //updating filtered out status
            itemDivs[i].setAttribute("filterStatus", itemDivs[i].getAttribute("filterStatus") + "minyear");        
        }
        else {
            //if the filter field hasn't been failed, remove field from the filter status
            itemDivs[i].setAttribute("filterStatus", itemDivs[i].getAttribute("filterStatus").replaceAll("minyear", ""));
        }
    }
    //updating display
    updateItemDisplay(itemDivs);
}

function filterByMaxYear() {
    //reading all the item divs from the front-end
    const itemDivs = document.querySelector("#items").children;
    //getting the user's filter input
    const filterMaxYear = parseInt(document.querySelector("#itemMaxYearInput").value);

    //looping through divs
    for (let i = 0; i < itemDivs.length; i++) {
        //checking to see if the filter input is part of the item's field
        if (parseInt(itemDivs[i].getAttribute("year")) > filterMaxYear) {
            //updating filtered out status
            itemDivs[i].setAttribute("filterStatus", itemDivs[i].getAttribute("filterStatus") + "maxyear");        
        }
        else {
            //if the filter field hasn't been failed, remove field from the filter status
            itemDivs[i].setAttribute("filterStatus", itemDivs[i].getAttribute("filterStatus").replaceAll("maxyear", ""));
        }
    }
    //updating display
    updateItemDisplay(itemDivs);
}

function filterByMinPrice() {
    //reading all the item divs from the front-end
    const itemDivs = document.querySelector("#items").children;
    //getting the user's filter input
    const filterMinPrice = parseFloat(document.querySelector("#itemMinPriceInput").value);

    //looping through divs
    for (let i = 0; i < itemDivs.length; i++) {
        //checking to see if the filter input is part of the item's field
        if (parseFloat(itemDivs[i].getAttribute("price")) < filterMinPrice) {
            //updating filtered out status
            itemDivs[i].setAttribute("filterStatus", itemDivs[i].getAttribute("filterStatus") + "minprice");        
        }
        else {
            //if the filter field hasn't been failed, remove field from the filter status
            itemDivs[i].setAttribute("filterStatus", itemDivs[i].getAttribute("filterStatus").replaceAll("minprice", ""));
        }
    }
    //updating display
    updateItemDisplay(itemDivs);
}

function filterByMaxPrice() {
    //reading all the item divs from the front-end
    const itemDivs = document.querySelector("#items").children;
    //getting the user's filter input
    const filterMaxPrice = parseFloat(document.querySelector("#itemMaxPriceInput").value);

    //looping through divs
    for (let i = 0; i < itemDivs.length; i++) {
        //checking to see if the filter input is part of the item's field
        if (parseFloat(itemDivs[i].getAttribute("price")) > filterMaxPrice) {
            //updating filtered out status
            itemDivs[i].setAttribute("filterStatus", itemDivs[i].getAttribute("filterStatus") + "maxprice");        
        }
        else {
            //if the filter field hasn't been failed, remove field from the filter status
            itemDivs[i].setAttribute("filterStatus", itemDivs[i].getAttribute("filterStatus").replaceAll("maxprice", ""));
        }
    }
    //updating display
    updateItemDisplay(itemDivs);
}


function filterByCondition() {
    //reading all the item divs from the front-end
    const itemDivs = document.querySelector("#items").children;
    //getting the user's filter input
    const filterCardCondition = document.querySelector("#itemConditionInput").value;

    //looping through divs; may need to do some exception handling for memorabilia items (we could check for type filter status)
    for (let i = 0; i < itemDivs.length; i++) {
        //checking to see if the filter input is part of the item's field
        if (!itemDivs[i].getAttribute("condition").includes(filterCardCondition)) {
            //updating filtered out status
            itemDivs[i].setAttribute("filterStatus", itemDivs[i].getAttribute("filterStatus") + "condition"); 
        }
        else {
            //if the filter field hasn't been failed, remove field from the filter status
            itemDivs[i].setAttribute("filterStatus", itemDivs[i].getAttribute("filterStatus").replaceAll("condition", ""));
        }
    }
    //updating display
    updateItemDisplay(itemDivs);    
}

function filterByTeam() {
    //reading all the item divs from the front-end
    const itemDivs = document.querySelector("#items").children;
    //getting the user's filter input
    const filterCardTeam = document.querySelector("#itemTeamInput").value;

    //looping through divs; may need to do some exception handling for memorabilia items (we could check for type filter status)
    for (let i = 0; i < itemDivs.length; i++) {
        //checking to see if the filter input is part of the item's field
        if (!itemDivs[i].getAttribute("team").includes(filterCardTeam)) {
            //updating filtered out status
            itemDivs[i].setAttribute("filterStatus", itemDivs[i].getAttribute("filterStatus") + "team"); 
        }
        else {
            //if the filter field hasn't been failed, remove field from the filter status
            itemDivs[i].setAttribute("filterStatus", itemDivs[i].getAttribute("filterStatus").replaceAll("team", ""));
        }
    }
    //updating display
    updateItemDisplay(itemDivs);
}

function filterBySport() {
    //reading all the item divs from the front-end
    const itemDivs = document.querySelector("#items").children;
    //getting the user's filter input
    const filterCardSport = document.querySelector("#itemSportInput").value;

    //looping through divs; may need to do some exception handling for memorabilia items (we could check for type filter status)
    for (let i = 0; i < itemDivs.length; i++) {
        //checking to see if the filter input is part of the item's field
        if (!itemDivs[i].getAttribute("sport").includes(filterCardSport)) {
            //updating filtered out status
            itemDivs[i].setAttribute("filterStatus", itemDivs[i].getAttribute("filterStatus") + "sport"); 
        }
        else {
            //if the filter field hasn't been failed, remove field from the filter status
            itemDivs[i].setAttribute("filterStatus", itemDivs[i].getAttribute("filterStatus").replaceAll("sport", ""));
        }
    }
    //updating display
    updateItemDisplay(itemDivs);
}

function filterByDescription() {
    //reading all the item divs from the front-end
    const itemDivs = document.querySelector("#items").children;
    //getting the user's filter input
    const filterMemorabiliaDescription = document.querySelector("#itemDescriptionInput").value;

    //looping through divs; may need to do some exception handling for memorabilia items (we could check for type filter status)
    for (let i = 0; i < itemDivs.length; i++) {
        //checking to see if the filter input is part of the item's field
        if (!itemDivs[i].getAttribute("description").includes(filterMemorabiliaDescription)) {
            //updating filtered out status
            itemDivs[i].setAttribute("filterStatus", itemDivs[i].getAttribute("filterStatus") + "description"); 
        }
        else {
            //if the filter field hasn't been failed, remove field from the filter status
            itemDivs[i].setAttribute("filterStatus", itemDivs[i].getAttribute("filterStatus").replaceAll("description", ""));
        }
    }
    //updating display
    updateItemDisplay(itemDivs);
}

function sortUpdate(sort) {
    if (sort !== "asc"){
        return "asc";
    } else {
        return "desc";
    };
}


//resume here, use the sort by name function as a guide
function sortByType() {
    //reading some kind of DOM element that will hold ascending or descending sort order
    var sort = document.querySelector("#typeSort").getAttribute("sort");
    
    //updating the sort order
    sort = sortUpdate(sort);

    //reading all the item divs from the front-end
    var itemDivs = document.querySelector("#items").children;

    //making itemDivs an array so we can sort it
    itemDivs = Array.from(itemDivs);

    if (sort === "asc") {
        //sorting the divs using a string comparison method
        itemDivs.sort((a, b) => a.getAttribute("type").localeCompare(b.getAttribute("type")));
    } else if (sort === "desc") {
        //using a negative to flip the sort around
        itemDivs.sort((a, b) => -a.getAttribute("type").localeCompare(b.getAttribute("type")));
    };

    //looping through divs; showing all of them
    for (let i = 0; i < itemDivs.length; i++) {
        document.querySelector("#items").appendChild(itemDivs[i]);
    };    
}

function sortByName() {
    //reading some kind of DOM element that will hold ascending or descending sort order
    var sort = document.querySelector("#nameSort").getAttribute("sort");
    
    //updating the sort order
    sort = sortUpdate(sort);
    //updating the saved sort in the DOM
    document.querySelector("#nameSort").setAttribute("sort", sort);
    //reading all the item divs from the front-end
    var itemDivs = document.querySelector("#items").children;

    //updating the sort button
    if (sort === "asc") {
        document.querySelector("#nameSort").textContent = `Sort By Name (desc)`;
    } else {
        document.querySelector("#nameSort").textContent = `Sort By Name (asc)`;
    };

    //making itemDivs an array so we can sort it
    itemDivs = Array.from(itemDivs);

    if (sort === "asc") {
        //sorting the divs using a string comparison method
        itemDivs.sort((a, b) => a.getAttribute("name").localeCompare(b.getAttribute("name")));
    } else if (sort === "desc") {
        //using a negative to flip the sort around
        itemDivs.sort((a, b) => -a.getAttribute("name").localeCompare(b.getAttribute("name")));
    };

    //looping through divs; showing all of them
    for (let i = 0; i < itemDivs.length; i++) {
        document.querySelector("#items").appendChild(itemDivs[i]);
    };    
}

function sortByYear() {
    //reading some kind of DOM element that will hold ascending or descending sort order
    var sort = document.querySelector("#yearSort").getAttribute("sort");
    
    //updating the sort order
    sort = sortUpdate(sort);
    //updating the saved sort in the DOM
    document.querySelector("#yearSort").setAttribute("sort", sort);
    //reading all the item divs from the front-end
    var itemDivs = document.querySelector("#items").children;

    //updating the sort button
    if (sort === "asc") {
        document.querySelector("#yearSort").textContent = `Sort By Year (desc)`;
    } else {
        document.querySelector("#yearSort").textContent = `Sort By Year (asc)`;
    };

    //making itemDivs an array so we can sort it
    itemDivs = Array.from(itemDivs);

    if (sort === "asc") {
        //sorting the divs using a number comparison method
        itemDivs.sort((a, b) => parseInt(a.getAttribute("year")) - parseInt(b.getAttribute("year")));
    } else if (sort === "desc") {
        //using a negative to flip the sort around
        itemDivs.sort((a, b) => -(parseInt(a.getAttribute("year")) - parseInt(b.getAttribute("year"))));
    };

    //looping through divs; showing all of them
    for (let i = 0; i < itemDivs.length; i++) {
        document.querySelector("#items").appendChild(itemDivs[i]);
    };    
}

function sortByPrice() {
    //reading some kind of DOM element that will hold ascending or descending sort order
    var sort = document.querySelector("#priceSort").getAttribute("sort");
    
    //updating the sort order
    sort = sortUpdate(sort);
    //updating the saved sort in the DOM
    document.querySelector("#priceSort").setAttribute("sort", sort);
    //reading all the item divs from the front-end
    var itemDivs = document.querySelector("#items").children;

    //updating the sort button
    if (sort === "asc") {
        document.querySelector("#priceSort").textContent = `Sort By Price (desc)`;
    } else {
        document.querySelector("#priceSort").textContent = `Sort By Price (asc)`;
    };

    //making itemDivs an array so we can sort it
    itemDivs = Array.from(itemDivs);

    if (sort === "asc") {
        //sorting the divs using a number comparison method
        itemDivs.sort((a, b) => parseFloat(a.getAttribute("price")) - parseFloat(b.getAttribute("price")));
    } else if (sort === "desc") {
        //using a negative to flip the sort around
        itemDivs.sort((a, b) => -(parseFloat(a.getAttribute("price")) - parseFloat(b.getAttribute("price"))));
    };

    //looping through divs; showing all of them
    for (let i = 0; i < itemDivs.length; i++) {
        document.querySelector("#items").appendChild(itemDivs[i]);
    };    
}

function sortByCost() {
    //reading some kind of DOM element that will hold ascending or descending sort order
    var sort = document.querySelector("#costSort").getAttribute("sort");
    
    //updating the sort order
    sort = sortUpdate(sort);

    //reading all the item divs from the front-end
    var itemDivs = document.querySelector("#items").children;

    //making itemDivs an array so we can sort it
    itemDivs = Array.from(itemDivs);

    if (sort === "asc") {
        //sorting the divs using a number comparison method
        itemDivs.sort((a, b) => parseFloat(a.getAttribute("cost")) - parseFloat(b.getAttribute("cost")));
    } else if (sort === "desc") {
        //using a negative to flip the sort around
        itemDivs.sort((a, b) => -(parseFloat(a.getAttribute("cost")) - parseFloat(b.getAttribute("cost"))));
    };

    //looping through divs; showing all of them
    for (let i = 0; i < itemDivs.length; i++) {
        itemDivs[i].filterStatus = "";
        itemDivs[i].style.display = "inline";
    };    
}

function sortByCondition() {
    //reading some kind of DOM element that will hold ascending or descending sort order
    var sort = document.querySelector("#conditionSort").getAttribute("sort");
    
    //updating the sort order
    sort = sortUpdate(sort);

    //reading all the item divs from the front-end
    var itemDivs = document.querySelector("#items").children;

    //making itemDivs an array so we can sort it
    itemDivs = Array.from(itemDivs);

    if (sort === "asc") {
        //sorting the divs using a string comparison method
        itemDivs.sort((a, b) => a.getAttribute("condition").localeCompare(b.getAttribute("condition")));
    } else if (sort === "desc") {
        //using a negative to flip the sort around
        itemDivs.sort((a, b) => -a.getAttribute("condition").localeCompare(b.getAttribute("condition")));
    };

    //looping through divs; showing all of them
    for (let i = 0; i < itemDivs.length; i++) {
        itemDivs[i].filterStatus = "";
        itemDivs[i].style.display = "inline";
    };    
}

function sortByTeam() {
    //reading some kind of DOM element that will hold ascending or descending sort order
    var sort = document.querySelector("#teamSort").getAttribute("sort");
    
    //updating the sort order
    sort = sortUpdate(sort);

    //reading all the item divs from the front-end
    var itemDivs = document.querySelector("#items").children;

    //making itemDivs an array so we can sort it
    itemDivs = Array.from(itemDivs);

    if (sort === "asc") {
        //sorting the divs using a string comparison method
        itemDivs.sort((a, b) => a.getAttribute("team").localeCompare(b.getAttribute("team")));
    } else if (sort === "desc") {
        //using a negative to flip the sort around
        itemDivs.sort((a, b) => -a.getAttribute("team").localeCompare(b.getAttribute("team")));
    };

    //looping through divs; showing all of them
    for (let i = 0; i < itemDivs.length; i++) {
        itemDivs[i].filterStatus = "";
        itemDivs[i].style.display = "inline";
    };    
}

function sortBySport() {
    //reading some kind of DOM element that will hold ascending or descending sort order
    var sort = document.querySelector("#sportSort").getAttribute("sort");
    
    //updating the sort order
    sort = sortUpdate(sort);

    //reading all the item divs from the front-end
    var itemDivs = document.querySelector("#items").children;

    //making itemDivs an array so we can sort it
    itemDivs = Array.from(itemDivs);

    if (sort === "asc") {
        //sorting the divs using a string comparison method
        itemDivs.sort((a, b) => a.getAttribute("sport").localeCompare(b.getAttribute("sport")));
    } else if (sort === "desc") {
        //using a negative to flip the sort around
        itemDivs.sort((a, b) => -a.getAttribute("sport").localeCompare(b.getAttribute("sport")));
    };

    //looping through divs; showing all of them
    for (let i = 0; i < itemDivs.length; i++) {
        itemDivs[i].filterStatus = "";
        itemDivs[i].style.display = "inline";
    };    
}

function sortByDescription() {
    //reading some kind of DOM element that will hold ascending or descending sort order
    var sort = document.querySelector("#descriptionSort").getAttribute("sort");
    
    //updating the sort order
    sort = sortUpdate(sort);

    //reading all the item divs from the front-end
    var itemDivs = document.querySelector("#items").children;

    //making itemDivs an array so we can sort it
    itemDivs = Array.from(itemDivs);

    if (sort === "asc") {
        //sorting the divs using a string comparison method
        itemDivs.sort((a, b) => a.getAttribute("description").localeCompare(b.getAttribute("description")));
    } else if (sort === "desc") {
        //using a negative to flip the sort around
        itemDivs.sort((a, b) => -a.getAttribute("description").localeCompare(b.getAttribute("description")));
    };

    //looping through divs; showing all of them
    for (let i = 0; i < itemDivs.length; i++) {
        itemDivs[i].filterStatus = "";
        itemDivs[i].style.display = "inline";
    };    
}



//GET BACK TO THESE FOR EMPLOYEE BROWSING; they just need to be updated a little with one of the price filtering functions

function filterByMinCost() {
    //reading all the item divs from the front-end
    const itemDivs = document.querySelector("#items").children;
    //getting the user's filter input
    const filterMinCost = document.querySelector("#itemMinCostInput").value;

    //looping through divs
    for (let i = 0; i < itemDivs.length; i++) {
        //checking to see if the filter input is part of the item's field
        if (!itemDivs[i].cost > filterMinCost) {
            //hiding items that fail the filter
            itemDivs[i].style.display = "none";
            //updating filtered out status
            itemDivs[i].filterStatus += "mincost"; 
        }
        else {
            //if the filter field hasn't been failed, remove field from the filter status
            itemDivs[i].filterStatus = itemDivs[i].filterStatus.replaceAll("mincost", "");
            //show the div if it isn't filtered by anything else
            if (itemDivs[i].getAttribute("filterStatus") === "") {
                itemDivs[i].style.display = "inline";
            };
        }
    }
}

function filterByMaxCost() {
    //reading all the item divs from the front-end
    const itemDivs = document.querySelector("#items").children;
    //getting the user's filter input
    const filterMaxCost = document.querySelector("#itemMaxCostInput").value;

    //looping through divs
    for (let i = 0; i < itemDivs.length; i++) {
        //checking to see if the filter input is part of the item's field
        if (!itemDivs[i].cost < filterMaxCost) {
            //hiding items that fail the filter
            itemDivs[i].style.display = "none";
            //updating filtered out status
            itemDivs[i].filterStatus += "maxcost"; 
        }
        else {
            //if the filter field hasn't been failed, remove field from the filter status
            itemDivs[i].filterStatus = itemDivs[i].filterStatus.replaceAll("maxcost", "");
            //show the div if it isn't filtered by anything else
            if (itemDivs[i].getAttribute("filterStatus") === "") {
                itemDivs[i].style.display = "inline";
            };
        }
    }
}