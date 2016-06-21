// Node npm var declarations
var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');
//creates a connection to MySQL database
var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: 'Password2016!',
	database: 'Bamazon'
})
//Provides status of SQL connection
connection.connect(function(err) {
	if (err) throw err;
	console.log('connected as id' + connection.threadId);
	appStart();
})

// New Table instance to format returned sql data
var table = new Table({
    head: ['ItemID', 'ProductName', 'Price', 'Quantity']
  , colWidths: [10, 40, 10, 10]
});

// performs inital query of Products table from database

//Prompts the customer on which item to buy
var appStart = function() {
	inquirer.prompt([{
		name: "Menu",
		type: "rawlist",
        message: "Welcome to the Bamazon management interface\n\n What would you would like to do?",
        choices:['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
    }]).then(function(answer) {

            // switch for different options

            switch(answer.Menu) {
                case 'View Products for Sale': 
                    productsForSale();
                    break;
                case 'View Low Inventory':
                    lowInventory();
                    break;
                case 'Add to Inventory':
                    addInventory();
                    break;
                case 'Add a New Product':
                    newProduct();
                    break;
            } // end of switch

        }); // end of inquirer prompt function
    
    function productsForSale() {
    connection.query('SELECT * FROM Products', function(err, res) {
        console.log('---------------------------------');
        console.log('Bamazon Current Inventory');
        console.log('---------------------------------\n');
        for (var i=0; i < res.length; i++) {
        var productArray = [res[i].ItemID, res[i].ProductName, res[i].Price, res[i].StockQuantity]
        table.push(productArray);
        // console.log(res[i].ItemID + " || " + res[i].ProductName + " || Price: " + res[i].Price + " || Quantity: " + res[i].StockQuantity + '\n');    
        }
        console.log(table.toString());
        connection.end();
        appStart();
        });
    }

}

    
                        




