//this function is for generating a Revenue Over Time report
function GenerateROTReport()
{
    //reading in all the transactions; [1] specifies to avoid the header
    var transactions = document.querySelector("#transactions").children[1].children;
    transactions = Array.from(transactions);
    
    //filtering out any transactions that aren't selected
    transactions = transactions.filter(transaction => transaction.children[0].children[0].checked);

    //sorting the transaction by date for the control break
    transactions.sort((a, b) => a.getAttribute("month").localeCompare(b.getAttribute("month")));

    //making a temporary array to be given to transactions later
    var temp = [];

    //converting each transaction into a simpler object with a subtotal and date
    transactions.forEach(transaction => {
        temp.push({
            subtotal: parseFloat(transaction.getAttribute("subtotal")),
            month: transaction.getAttribute("month")
        });
  });

    //updating transactions
    transactions = temp;

    //making arrays for the revenue amounts and months
    var amounts = [];
    var months = [];

    var currentMonth = transactions[0].month;
    var currentAmount = 0;

    transactions.forEach(transaction => {
        if (transaction.month === currentMonth) {
            currentAmount += transaction.subtotal;
        } else {
            months.push(currentMonth);
            amounts.push(currentAmount);

            currentAmount = transaction.subtotal;
            currentMonth = transaction.month;
        }
    });

    months.push(currentMonth);
    amounts.push(currentAmount);

    displayChart(months, amounts);
}

function displayChart(months, amounts) {
    //resetting the chart
    document.getElementById('chartDisplay').innerHTML = ``;

    //loading the api stuff we'll need
    google.charts.load('current', {'packages':['corechart']});

    //this is a required callback based on documentation; basically the chart draws itself once the api is loaded
    google.charts.setOnLoadCallback(drawChart);

        //this is the function that is called when the API is loaded; you could probably just throw this code in-line but i wanted to stay close to the documentation
        function drawChart() {

        //making a new data table, which is how we process the data into the chart
        var data = new google.visualization.DataTable();
        //columns mean axises, we have month and revenue
        data.addColumn('string', 'Month');
        data.addColumn('number', 'Revenue');

        //for every month we have, add a row with the month and revenue amount
        for (var i = 0; i < months.length; i++) {
            data.addRow([months[i], amounts[i]]);
        }

        //setting the title and size of the chart; the first bit hides the series legend
        var options = {
            series: {0:{color: '#8B0000', visibleInLegend: false}},
            'title':'Revenue Per Month',
            'width':450,
            'height':450,
            hAxis: {
                title: 'Month'
            },
            vAxis: {
                title: 'Revenue (USD)',
                ticks: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]
            }
        };

        //making a chart and giving it a location in the DOM
        var chart = new google.visualization.ColumnChart(document.getElementById('chartDisplay'));
        //actually drawing the chart with our data and options
        chart.draw(data, options);
        }
}