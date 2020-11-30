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

//this is the method for removing an item from the cart in the cart screen, must be renamed later lol
function removeItemLater(e) {
    e.preventDefault();

    //the idea here is that we're going to edit the locally storaged cart items, then reload the display
    const idToRemove = e.target.parentElement.id;
    var cartItems = localStorage.getItem("cartItems");

    //taking out the ID
    cartItems = cartItems.replaceAll(idToRemove, "");

    //removing leading comma from the items list if necessary
    if (cartItems[0] === ',') {
        cartItems = cartItems.substring(1);
    } else if (cartItems.slice(-1) === ',') {
        //slicing off a trailing comma if there is one
        cartItems = cartItems.slice(0, -1);
    }
    //cleaning up duplicate commas if necessary
    cartItems = cartItems.replaceAll(',,', ",");

    //updating the cart items; if the user removes the last item the system will just ignore it, might be good to do an alert later
    if (cartItems !== "") {
        localStorage.setItem("cartItems", cartItems);
    }

    //refreshing the cart display
    loadCart();
}

function loadCart() {
    const itemString = localStorage.getItem("cartItems");

    //resetting the cart table so it only has the header row
    document.getElementById("cartTable").innerHTML = `
    <tr>
        <th>Product</th>
        <th>ID</th>
        <th>Subtotal</th>
    </tr>
    `;

    fetch(`https://localhost:5001/api/items/cartinfo/${itemString}`)
        .then(response => response.json())
        .then(cartInfo => {
            const items = cartInfo.items;

            for (let i = 0; i < items.length; i++) {
                //these elements are how the items are structured in the cart
                var newRow = document.createElement('tr');
                var itemData = document.createElement('td');
                var outerDiv = document.createElement('div');

                //this is the placeholder image, the src can be made dynamic in the future
                var staticImg = document.createElement('img');
                staticImg.src = "./resources/images/logoPlaceholder.png";
                
                outerDiv.className = "cart-info";

                //this is the actual div for the item info
                var dataDiv = document.createElement('div');
                dataDiv.id = items[i].itemID;
                //name p
                var nameP = document.createElement('p');
                nameP.textContent = items[i].itemName;
                //price small
                var priceSmall = document.createElement('small');
                priceSmall.textContent = `Price: $${items[i].itemPrice}`;
                //line break
                var lineBreak = document.createElement('br');
                //remove tag
                var removeA = document.createElement('a');
                removeA.href = '#';
                removeA.textContent = "Remove";
                removeA.addEventListener("click", removeItemLater);

                //structing the elements
                dataDiv.appendChild(nameP);
                dataDiv.appendChild(priceSmall);
                dataDiv.appendChild(lineBreak);
                dataDiv.appendChild(removeA);

                outerDiv.appendChild(staticImg);
                outerDiv.appendChild(dataDiv);

                itemData.appendChild(outerDiv);

                //building the td for the id
                var idData = document.createElement('td');
                idData.innerHTML = items[i].itemID;

                //building the td for the price
                var priceData = document.createElement('td');
                priceData.innerHTML = "$ " + items[i].itemPrice.toFixed(2); 

                newRow.appendChild(itemData);
                newRow.appendChild(idData);
                newRow.appendChild(priceData);

                //inserting the new row
                document.querySelector("#cartTable").appendChild(newRow);
            }

            document.querySelector("#cartSubtotal").innerHTML = '$' + cartInfo.subtotal.toFixed(2);
            document.querySelector("#cartTax").innerHTML = '$' + cartInfo.tax.toFixed(2);
            document.querySelector("#cartTotal").innerHTML = '$' + cartInfo.total.toFixed(2);
        }).catch(error => console.log(error));
}