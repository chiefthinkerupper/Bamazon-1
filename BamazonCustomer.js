// Node npm var declarations
var mysql = require('mysql');
var inquirer = require('inquirer');
//creates a connection to MySQL database
var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: 'Fl0r1d@!',
	database: 'Bamazon'
})
//Provides status of SQL connection
connection.connect(function(err) {
	if (err) throw err;
	console.log('connected as id' + connection.threadId);
	start();
})
// performs inital query of Products table from database
var start = function() {
    connection.query('SELECT * FROM Products', function(err, res) {
        console.log('---------------------------------');
        console.log('Available Bamazon Products');
        console.log('---------------------------------\n');
        for (var i=0; i < res.length; i++) {
		console.log(res[i].ItemID + " || " + res[i].ProductName + " || Price: " + res[i].Price + " || Quantity: " + res[i].stockQuantity + '\n');	
		}
        buyItem();
        })
    }
//Prompts the customer on which item to buy
var buyItem = function() {
	inquirer.prompt({
		name: "Item",
		type: "input",
        message: "Choose the ID of the Item you would like to buy",
		validate: function(value) {
			
            if (isNaN(value) == false) {
                return true;
            } else {
                console.log("\nPlease enter only the Item number of the item you'd like to buy\n");
                return false;
            }
        }
    }, {
        name: "Qty",
        type: "input",
        message: "How many would you like to buy?",
        validate: function(value) {
            
            if (isNaN(value) == false) {
                return true;
            } else {
                console.log("\nPlease enter a valid Quantity\n");
                return false;
            }
        }
        }).then(function(answer) {
			console.log(answer);
            var ItemInt = parseInt(answer.Qty);
            // console.log(ItemInt);
            //     connection.query("SELECT * FROM Products WHERE ?", [{ItemID: answer}], function(err, data) { 
            //         if (err) throw err;
            //         if (data[0].stockQuantity < ItemInt) {
            //            console.log("We're sorry, that Item is currently out of stock");
            //            start(); 
            //         } else {
            //             var updateQty = data[0].stockQuantity - ItemInt
            //         console.log("Purchase successfull!");
            //         start();
                // }               
            });
        // });
    };




