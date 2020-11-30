//THIS FILE HOLDS METHODS FOR BROWSING TRANSACTIONS; DEFINITELY SHOULD BE SPLIT UP LATER

/*
<tr>
    <th>ID</th>
    <th>Item IDs</th>
    <th>Date</th>
    <th>Subtotal</th>
    <th>Discount</th>
    <th>Payment Type</th>
    <th>Employee ID</th>
    <th>Customer Email</th>
</tr>  
*/


function loadAllTransactions() {
    const url = "https://localhost:5001/api/transaction";
    var html = ``;
    
    fetch(url)
        .then(response => response.json())
        .then(transactions => {
            transactions.forEach(transaction => {
                //formatting the data
                const subtotal = transaction.subtotal.toFixed(2);
                const discount = transaction.amtDiscounted.toFixed(2);
                var tdate = new Date(transaction.transactionDate);
                
                //month value; i want this 1-indexed so i added one
                var month = 1 + tdate.getMonth();

                if (month < 10) { month = `0${month}`};

                //year value
                var year = tdate.getFullYear();

                //display format
                tdate = tdate.toDateString();

                html +=
                `<tr month="${month}/${year}" subtotal=${subtotal} id=transaction${transaction.transactionID} filterStatus="">
                    <td><input id=checkbox${transaction.transactionID} type="checkbox"></td>
                    <td>${transaction.transactionID}</td>
                    <td>${transaction.itemIDs}</td>
                    <td>${tdate}</td>
                    <td>${subtotal}</td>
                    <td>${discount}</td>
                    <td>${transaction.paymentType}</td>
                    <td>${transaction.employeeID}</td>
                    <td>${transaction.customerEmail}</td>
                </tr>`;
            });

            document.querySelector("#transactions").innerHTML += html;
        })

    //code to load all cards from the back-end into array
    const allTransactions = [];

    //adding each transaction to the DOM using a for each loop
    allTransactions.forEach(transaction => {
        //this is the html of a transaction; i'm guessing it'll go in a new table row? subject to change
        var html =
        `<tr id=transaction${transaction.id} filterStatus="">
            <td>${transaction.date}</td>
            <td>${transaction.transactions}</td>
            <td>${transaction.discount}</td>
            <td>${transaction.subtotal}</td>
            <td>${transaction.paymentId}</td>
        </tr>`;

        //this line needs to insert the display somewhere; for now it can just be inside an transaction div
        document.querySelector("#transactions").innerHTML += html;
    });   
}

function clearAllFilters() {
    //reading all the transaction divs from the front-end
    const transactionRows = document.querySelector("#transactions").children;

    //looping through divs; showing all of them
    for (let i = 0; i < transactionRows.length; i++) {
        transactionRows[i].GetAttribute(filterStatus) = "";
        transactionRows[i].style.display = "inline";
    }    
}

function filterByID() {
    //reading all the transaction divs from the front-end
    const transactionRows = document.querySelector("#transactions").children;
    //getting the user's filter input
    const filterId = document.querySelector("#transactionIDInput").value;

    //looping through divs
    for (let i = 0; i < transactionRows.length; i++) {
        //checking to see if the filter input is part of the transaction's field
        if (!transactionRows[i].id.contains(filterId)) {
            //hiding transactions that fail the filter
            transactionRows[i].style.display = "none";
            //updating filtered out status
            transactionRows[i].filterStatus += "id";        
        }
        else {
            //if the filter field hasn't been failed, remove field from the filter status
            transactionRows[i].filterStatus = transactionRows[i].filterStatus.replaceAll("id", "");
            //show the div if it isn't filtered by anything else
            if (transactionRows[i].filterStatus === "") {
                transactionRows[i].style.display = "inline";
            };
        }
    }
}

function filterByMinDate() {
    //reading all the transaction divs from the front-end
    const transactionRows = document.querySelector("#transactions").children;
    //getting the user's filter input
    const filterMinYear = document.querySelector("#transactionMinDateInput").value;

    //looping through divs
    for (let i = 0; i < transactionRows.length; i++) {
        //checking to see if the filter input is part of the transaction's field
        if (!transactionRows[i].date > filterMinYear) {
            //hiding transactions that fail the filter
            transactionRows[i].style.display = "none";
            //updating filtered out status
            transactionRows[i].filterStatus += "mindate"; 
        }
        else {
            //if the filter field hasn't been failed, remove field from the filter status
            transactionRows[i].filterStatus = transactionRows[i].filterStatus.replaceAll("mindate", "");
            //show the div if it isn't filtered by anything else
            if (transactionRows[i].filterStatus === "") {
                transactionRows[i].style.display = "inline";
            };
        }
    }
}

function filterByMaxDate() {
    //reading all the transaction divs from the front-end
    const transactionRows = document.querySelector("#transactions").children;
    //getting the user's filter input
    const filterMaxDate = document.querySelector("#transactionMaxDateInput").value;

    //looping through divs
    for (let i = 0; i < transactionRows.length; i++) {
        //checking to see if the filter input is part of the transaction's field
        if (!transactionRows[i].date < filterMaxDate) {
            //hiding transactions that fail the filter
            transactionRows[i].style.display = "none";
            //updating filtered out status
            transactionRows[i].filterStatus += "maxdate"; 
        }
        else {
            //if the filter field hasn't been failed, remove field from the filter status
            transactionRows[i].filterStatus = transactionRows[i].filterStatus.replaceAll("maxdate", "");
            //show the div if it isn't filtered by anything else
            if (transactionRows[i].filterStatus === "") {
                transactionRows[i].style.display = "inline";
            };
        }
    }
}

//RESUME HERE WITH TRANSACTION FILTERING

function filterByMinPrice() {
    //reading all the transaction divs from the front-end
    const transactionRows = document.querySelector("#transactions").children;
    //getting the user's filter input
    const filterMinPrice = document.querySelector("#transactionMinPriceInput").value;

    //looping through divs
    for (let i = 0; i < transactionRows.length; i++) {
        //checking to see if the filter input is part of the transaction's field
        if (!transactionRows[i].price > filterMinPrice) {
            //hiding transactions that fail the filter
            transactionRows[i].style.display = "none";
            //updating filtered out status
            transactionRows[i].filterStatus += "minprice"; 
        }
        else {
            //if the filter field hasn't been failed, remove field from the filter status
            transactionRows[i].filterStatus = transactionRows[i].filterStatus.replaceAll("minprice", "");
            //show the div if it isn't filtered by anything else
            if (transactionRows[i].filterStatus === "") {
                transactionRows[i].style.display = "inline";
            };
        }
    }
}

function filterByMaxPrice() {
    //reading all the transaction divs from the front-end
    const transactionRows = document.querySelector("#transactions").children;
    //getting the user's filter input
    const filterMaxPrice = document.querySelector("#transactionMaxPriceInput").value;

    //looping through divs
    for (let i = 0; i < transactionRows.length; i++) {
        //checking to see if the filter input is part of the transaction's field
        if (!transactionRows[i].price < filterMaxPrice) {
            //hiding transactions that fail the filter
            transactionRows[i].style.display = "none";
            //updating filtered out status
            transactionRows[i].filterStatus += "maxprice"; 
        }
        else {
            //if the filter field hasn't been failed, remove field from the filter status
            transactionRows[i].filterStatus = transactionRows[i].filterStatus.replaceAll("maxprice", "");
            //show the div if it isn't filtered by anything else
            if (transactionRows[i].filterStatus === "") {
                transactionRows[i].style.display = "inline";
            };
        }
    }
}

function filterByMinCost() {
    //reading all the transaction divs from the front-end
    const transactionRows = document.querySelector("#transactions").children;
    //getting the user's filter input
    const filterMinCost = document.querySelector("#transactionMinCostInput").value;

    //looping through divs
    for (let i = 0; i < transactionRows.length; i++) {
        //checking to see if the filter input is part of the transaction's field
        if (!transactionRows[i].cost > filterMinCost) {
            //hiding transactions that fail the filter
            transactionRows[i].style.display = "none";
            //updating filtered out status
            transactionRows[i].filterStatus += "mincost"; 
        }
        else {
            //if the filter field hasn't been failed, remove field from the filter status
            transactionRows[i].filterStatus = transactionRows[i].filterStatus.replaceAll("mincost", "");
            //show the div if it isn't filtered by anything else
            if (transactionRows[i].filterStatus === "") {
                transactionRows[i].style.display = "inline";
            };
        }
    }
}

function filterByMaxCost() {
    //reading all the transaction divs from the front-end
    const transactionRows = document.querySelector("#transactions").children;
    //getting the user's filter input
    const filterMaxCost = document.querySelector("#transactionMaxCostInput").value;

    //looping through divs
    for (let i = 0; i < transactionRows.length; i++) {
        //checking to see if the filter input is part of the transaction's field
        if (!transactionRows[i].cost < filterMaxCost) {
            //hiding transactions that fail the filter
            transactionRows[i].style.display = "none";
            //updating filtered out status
            transactionRows[i].filterStatus += "maxcost"; 
        }
        else {
            //if the filter field hasn't been failed, remove field from the filter status
            transactionRows[i].filterStatus = transactionRows[i].filterStatus.replaceAll("maxcost", "");
            //show the div if it isn't filtered by anything else
            if (transactionRows[i].filterStatus === "") {
                transactionRows[i].style.display = "inline";
            };
        }
    }
}

function filterByCondition() {
    //only cards have this field; hiding memorabilia
    filterOutMemorabila();
    //reading all the transaction divs from the front-end
    const transactionRows = document.querySelector("#transactions").children;
    //getting the user's filter input
    const filterCardCondition = document.querySelector("#cardConditionInput").value;

    //looping through divs; may need to do some exception handling for memorabilia transactions (we could check for type filter status)
    for (let i = 0; i < transactionRows.length; i++) {
        //checking to see if the filter input is part of the transaction's field
        if (!transactionRows[i].condition === filterCardCondition) {
            //hiding transactions that fail the filter
            transactionRows[i].style.display = "none";
            //updating filtered out status
            transactionRows[i].filterStatus += "condition"; 
        }
        else {
            //if the filter field hasn't been failed, remove field from the filter status
            transactionRows[i].filterStatus = transactionRows[i].filterStatus.replaceAll("condition", "");
            //show the div if it isn't filtered by anything else
            if (transactionRows[i].filterStatus === "") {
                transactionRows[i].style.display = "inline";
            };
        }
    }
}

function filterByTeam() {
    //only cards have this field; hiding memorabilia
    filterOutMemorabila();
    //reading all the transaction divs from the front-end
    const transactionRows = document.querySelector("#transactions").children;
    //getting the user's filter input
    const filterCardTeam = document.querySelector("#cardTeamInput").value;

    //looping through divs; may need to do some exception handling for memorabilia transactions (we could check for type filter status)
    for (let i = 0; i < transactionRows.length; i++) {
        //checking to see if the filter input is part of the transaction's field
        if (!transactionRows[i].condition.contains(filterCardTeam)) {
            //hiding transactions that fail the filter
            transactionRows[i].style.display = "none";
            //updating filtered out status
            transactionRows[i].filterStatus += "team"; 
        }
        else {
            //if the filter field hasn't been failed, remove field from the filter status
            transactionRows[i].filterStatus = transactionRows[i].filterStatus.replaceAll("team", "");
            //show the div if it isn't filtered by anything else
            if (transactionRows[i].filterStatus === "") {
                transactionRows[i].style.display = "inline";
            };
        }
    }
}

function filterBySport() {
    //only cards have this field; hiding memorabilia
    filterOutMemorabila();
    //reading all the transaction divs from the front-end
    const transactionRows = document.querySelector("#transactions").children;
    //getting the user's filter input
    const filterCardSport = document.querySelector("#cardSportInput").value;

    //looping through divs; may need to do some exception handling for memorabilia transactions (we could check for type filter status)
    for (let i = 0; i < transactionRows.length; i++) {
        //checking to see if the filter input is part of the transaction's field
        if (!transactionRows[i].sport === filterCardSport) {
            //hiding transactions that fail the filter
            transactionRows[i].style.display = "none";
            //updating filtered out status
            transactionRows[i].filterStatus += "sport"; 
        }
        else {
            //if the filter field hasn't been failed, remove field from the filter status
            transactionRows[i].filterStatus = transactionRows[i].filterStatus.replaceAll("sport", "");
            //show the div if it isn't filtered by anything else
            if (transactionRows[i].filterStatus === "") {
                transactionRows[i].style.display = "inline";
            };
        }
    }
}

function filterByDescription() {
    //only memorabilia has this field; hiding cards
    filterOutCards();
    //reading all the transaction divs from the front-end
    const transactionRows = document.querySelector("#transactions").children;
    //getting the user's filter input
    const filterMemorabiliaDescription = document.querySelector("#memorabiliaDescriptionInput").value;

    //looping through divs; may need to do some exception handling for memorabilia transactions (we could check for type filter status)
    for (let i = 0; i < transactionRows.length; i++) {
        //checking to see if the filter input is part of the transaction's field
        if (!transactionRows[i].description.contains(filterMemorabiliaDescription)) {
            //hiding transactions that fail the filter
            transactionRows[i].style.display = "none";
            //updating filtered out status
            transactionRows[i].filterStatus += "description"; 
        }
        else {
            //if the filter field hasn't been failed, remove field from the filter status
            transactionRows[i].filterStatus = transactionRows[i].filterStatus.replaceAll("description", "");
            //show the div if it isn't filtered by anything else
            if (transactionRows[i].filterStatus === "") {
                transactionRows[i].style.display = "inline";
            };
        }
    }
}

function sortUpdate(sort) {
    if (sort === ""){
        return "asc";
    } else if (sort === "asc") {
        return "desc";
    } else {
        return "";
    };
}

//might want some kind of function to swap sort order icons either inside sortUpdate or somewhere

function sortByType() {
    //reading some kind of DOM element that will hold ascending or descending sort order
    var sort = document.querySelector("#typeSort").getAttribute("sort");
    
    //updating the sort order
    sort = sortUpdate(sort);

    //reading all the transaction divs from the front-end
    var transactionRows = document.querySelector("#transactions").children;

    //making transactionRows an array so we can sort it
    transactionRows = Array.from(transactionRows);

    if (sort === "asc") {
        //sorting the divs using a string comparison method
        transactionRows.sort((a, b) => a.getAttribute("type").localeCompare(b.getAttribute("type")));
    } else if (sort === "desc") {
        //using a negative to flip the sort around
        transactionRows.sort((a, b) => -a.getAttribute("type").localeCompare(b.getAttribute("type")));
    };

    //looping through divs; showing all of them
    for (let i = 0; i < transactionRows.length; i++) {
        transactionRows[i].filterStatus = "";
        transactionRows[i].style.display = "inline";
    };    
}

function sortByName() {
    //reading some kind of DOM element that will hold ascending or descending sort order
    var sort = document.querySelector("#nameSort").getAttribute("sort");
    
    //updating the sort order
    sort = sortUpdate(sort);

    //reading all the transaction divs from the front-end
    var transactionRows = document.querySelector("#transactions").children;

    //making transactionRows an array so we can sort it
    transactionRows = Array.from(transactionRows);

    if (sort === "asc") {
        //sorting the divs using a string comparison method
        transactionRows.sort((a, b) => a.getAttribute("name").localeCompare(b.getAttribute("name")));
    } else if (sort === "desc") {
        //using a negative to flip the sort around
        transactionRows.sort((a, b) => -a.getAttribute("name").localeCompare(b.getAttribute("name")));
    };

    //looping through divs; showing all of them
    for (let i = 0; i < transactionRows.length; i++) {
        transactionRows[i].filterStatus = "";
        transactionRows[i].style.display = "inline";
    };    
}

function sortByYear() {
    //reading some kind of DOM element that will hold ascending or descending sort order
    var sort = document.querySelector("#yearSort").getAttribute("sort");
    
    //updating the sort order
    sort = sortUpdate(sort);

    //reading all the transaction divs from the front-end
    var transactionRows = document.querySelector("#transactions").children;

    //making transactionRows an array so we can sort it
    transactionRows = Array.from(transactionRows);

    if (sort === "asc") {
        //sorting the divs using a number comparison method
        transactionRows.sort((a, b) => parseFloat(a.getAttribute("year")) - parseFloat(b.getAttribute("year")));
    } else if (sort === "desc") {
        //using a negative to flip the sort around
        transactionRows.sort((a, b) => -(parseFloat(a.getAttribute("year")) - parseFloat(b.getAttribute("year"))));
    };

    //looping through divs; showing all of them
    for (let i = 0; i < transactionRows.length; i++) {
        transactionRows[i].filterStatus = "";
        transactionRows[i].style.display = "inline";
    };    
}

function sortByPrice() {
    //reading some kind of DOM element that will hold ascending or descending sort order
    var sort = document.querySelector("#priceSort").getAttribute("sort");
    
    //updating the sort order
    sort = sortUpdate(sort);

    //reading all the transaction divs from the front-end
    var transactionRows = document.querySelector("#transactions").children;

    //making transactionRows an array so we can sort it
    transactionRows = Array.from(transactionRows);

    if (sort === "asc") {
        //sorting the divs using a number comparison method
        transactionRows.sort((a, b) => parseFloat(a.getAttribute("price")) - parseFloat(b.getAttribute("price")));
    } else if (sort === "desc") {
        //using a negative to flip the sort around
        transactionRows.sort((a, b) => -(parseFloat(a.getAttribute("price")) - parseFloat(b.getAttribute("price"))));
    };

    //looping through divs; showing all of them
    for (let i = 0; i < transactionRows.length; i++) {
        transactionRows[i].filterStatus = "";
        transactionRows[i].style.display = "inline";
    };    
}

function sortByCost() {
    //reading some kind of DOM element that will hold ascending or descending sort order
    var sort = document.querySelector("#costSort").getAttribute("sort");
    
    //updating the sort order
    sort = sortUpdate(sort);

    //reading all the transaction divs from the front-end
    var transactionRows = document.querySelector("#transactions").children;

    //making transactionRows an array so we can sort it
    transactionRows = Array.from(transactionRows);

    if (sort === "asc") {
        //sorting the divs using a number comparison method
        transactionRows.sort((a, b) => parseFloat(a.getAttribute("cost")) - parseFloat(b.getAttribute("cost")));
    } else if (sort === "desc") {
        //using a negative to flip the sort around
        transactionRows.sort((a, b) => -(parseFloat(a.getAttribute("cost")) - parseFloat(b.getAttribute("cost"))));
    };

    //looping through divs; showing all of them
    for (let i = 0; i < transactionRows.length; i++) {
        transactionRows[i].filterStatus = "";
        transactionRows[i].style.display = "inline";
    };    
}

function sortByCondition() {
    //reading some kind of DOM element that will hold ascending or descending sort order
    var sort = document.querySelector("#conditionSort").getAttribute("sort");
    
    //updating the sort order
    sort = sortUpdate(sort);

    //reading all the transaction divs from the front-end
    var transactionRows = document.querySelector("#transactions").children;

    //making transactionRows an array so we can sort it
    transactionRows = Array.from(transactionRows);

    if (sort === "asc") {
        //sorting the divs using a string comparison method
        transactionRows.sort((a, b) => a.getAttribute("condition").localeCompare(b.getAttribute("condition")));
    } else if (sort === "desc") {
        //using a negative to flip the sort around
        transactionRows.sort((a, b) => -a.getAttribute("condition").localeCompare(b.getAttribute("condition")));
    };

    //looping through divs; showing all of them
    for (let i = 0; i < transactionRows.length; i++) {
        transactionRows[i].filterStatus = "";
        transactionRows[i].style.display = "inline";
    };    
}

function sortByTeam() {
    //reading some kind of DOM element that will hold ascending or descending sort order
    var sort = document.querySelector("#teamSort").getAttribute("sort");
    
    //updating the sort order
    sort = sortUpdate(sort);

    //reading all the transaction divs from the front-end
    var transactionRows = document.querySelector("#transactions").children;

    //making transactionRows an array so we can sort it
    transactionRows = Array.from(transactionRows);

    if (sort === "asc") {
        //sorting the divs using a string comparison method
        transactionRows.sort((a, b) => a.getAttribute("team").localeCompare(b.getAttribute("team")));
    } else if (sort === "desc") {
        //using a negative to flip the sort around
        transactionRows.sort((a, b) => -a.getAttribute("team").localeCompare(b.getAttribute("team")));
    };

    //looping through divs; showing all of them
    for (let i = 0; i < transactionRows.length; i++) {
        transactionRows[i].filterStatus = "";
        transactionRows[i].style.display = "inline";
    };    
}

function sortBySport() {
    //reading some kind of DOM element that will hold ascending or descending sort order
    var sort = document.querySelector("#sportSort").getAttribute("sort");
    
    //updating the sort order
    sort = sortUpdate(sort);

    //reading all the transaction divs from the front-end
    var transactionRows = document.querySelector("#transactions").children;

    //making transactionRows an array so we can sort it
    transactionRows = Array.from(transactionRows);

    if (sort === "asc") {
        //sorting the divs using a string comparison method
        transactionRows.sort((a, b) => a.getAttribute("sport").localeCompare(b.getAttribute("sport")));
    } else if (sort === "desc") {
        //using a negative to flip the sort around
        transactionRows.sort((a, b) => -a.getAttribute("sport").localeCompare(b.getAttribute("sport")));
    };

    //looping through divs; showing all of them
    for (let i = 0; i < transactionRows.length; i++) {
        transactionRows[i].filterStatus = "";
        transactionRows[i].style.display = "inline";
    };    
}

function sortByDescription() {
    //reading some kind of DOM element that will hold ascending or descending sort order
    var sort = document.querySelector("#descriptionSort").getAttribute("sort");
    
    //updating the sort order
    sort = sortUpdate(sort);

    //reading all the transaction divs from the front-end
    var transactionRows = document.querySelector("#transactions").children;

    //making transactionRows an array so we can sort it
    transactionRows = Array.from(transactionRows);

    if (sort === "asc") {
        //sorting the divs using a string comparison method
        transactionRows.sort((a, b) => a.getAttribute("description").localeCompare(b.getAttribute("description")));
    } else if (sort === "desc") {
        //using a negative to flip the sort around
        transactionRows.sort((a, b) => -a.getAttribute("description").localeCompare(b.getAttribute("description")));
    };

    //looping through divs; showing all of them
    for (let i = 0; i < transactionRows.length; i++) {
        transactionRows[i].filterStatus = "";
        transactionRows[i].style.display = "inline";
    };    
}