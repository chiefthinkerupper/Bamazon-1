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
});
//Provides status of SQL connection
connection.connect(function(err) {
    if (err) throw err;
    console.log('connected as id' + connection.threadId);
    appStart();
});

console.log('------------------------------------------------');
console.log('Welcome to the Bamazon management interface');
console.log('------------------------------------------------\n');

//builds startup menu for manangement interface
var appStart = function() {
    inquirer.prompt([{
        name: "Menu",
        type: "rawlist",
        message: "What would you would like to do?",
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
                case 'Add New Product':
                    newProduct();
                    break;
            } // end of switch

        }); // end of inquirer prompt function
}  
    
    function appContinue() {
    inquirer.prompt({
                name: "continue",
                type: "confirm",
                message: "Would you like to go back to the main menu?",
            }).then(function(answer) {
                if (answer.continue == true) {
                    appStart();
                } else {
                    console.log("Ending session with Bamazon Manager!");
                    connection.end();
                }
            }); 
    };

    function productsForSale() {
    connection.query('SELECT * FROM Products', function(err, res) {
        console.log('---------------------------------');
        console.log('Bamazon Current Inventory');
        console.log('---------------------------------\n');
        // New Table instance to format returned sql data
            var table = new Table({
                head: ['ItemID', 'ProductName', 'Price', 'Quantity'],
                colWidths: [10, 40, 10, 10]
            });
        for (var i=0; i < res.length; i++) {
        var productArray = [res[i].ItemID, res[i].ProductName, res[i].Price, res[i].StockQuantity];
        table.push(productArray);
        // console.log(res[i].ItemID + " || " + res[i].ProductName + " || Price: " + res[i].Price + " || Quantity: " + res[i].StockQuantity + '\n');    
        }
        console.log(table.toString());
        appStart();
        });
    }

    function lowInventory() {
    connection.query('SELECT * FROM Products', function(err, res) {
        console.log('---------------------------------');
        console.log('Bamazon Low Inventory');
        console.log('---------------------------------\n');
        // New Table instance to format returned sql data
            var table = new Table({
                head: ['ItemID', 'ProductName', 'Price', 'Quantity'],
                colWidths: [10, 40, 10, 10]
            });
        for (var i=0; i < res.length; i++) {
            if (res[i].StockQuantity < 5) {
            var productArray = [res[i].ItemID, res[i].ProductName, res[i].Price, res[i].StockQuantity];
            table.push(productArray);
            }
        }
        console.log(table.toString());
        appStart();
        });
    }

    function addInventory() {
        connection.query('SELECT * FROM Products', function(err, res) {
        // New Table instance to format returned sql data
            var table = new Table({
                head: ['ItemID', 'ProductName', 'Price', 'Quantity'],
                colWidths: [10, 40, 10, 10]
            });
        for (var i=0; i < res.length; i++) {
        var productArray = [res[i].ItemID, res[i].ProductName, res[i].Price, res[i].StockQuantity];
        table.push(productArray);
        // console.log(res[i].ItemID + " || " + res[i].ProductName + " || Price: " + res[i].Price + " || Quantity: " + res[i].StockQuantity + '\n');    
        }
        console.log('\n\n\n');
        console.log(table.toString());
        console.log('\n');
        });
            inquirer.prompt([{
                name:'ItemID',
                type:'input',
                message: '\n\nEnter the ID of the Product you want to increase the inventory of'
            }, {
                name: 'qty',
                type:'input',
                message: 'Enter the quantity you want to add to inventory'
            }]).then(function(answer) {
                var addAmount = (parseInt(answer.qty));
                
                connection.query("SELECT * FROM Products WHERE ?", [{ItemID: answer.ItemID}], function(err, res) {
                            if(err) {
                                throw err;
                            } else {
                            var updateQty = (parseInt(res[0].StockQuantity) + addAmount);
                            console.log(updateQty);                      
                            }
                    connection.query('UPDATE products SET StockQuantity = ? WHERE ItemID = ?', [updateQty, answer.ItemID], function(err, results) {
                            if(err) {
                                throw err;
                            } else {
                            console.log('New Inventory Added!\n');
                            appContinue();                      
                            }
                    });

                });


                
        });
    }

    function newProduct() {
        inquirer.prompt([{
            name: "product",
            type: "input",
            message: "Type the name of the Product you want to add to Bamazon"
        }, {
            name: "department",
            type: "input",
            message: "Type the Department name of the Product you want to add to Bamazon"
        }, {
            name: "price",
            type: "input",
            message: "Enter the price of the product without currency symbols"
        }, {
            name: "quantity",
            type: "input",
            message: "Enter the amount you want to add to the inventory"
        }]).then(function(answers) {
            var ProductName = answers.product;
            var DepartmentName = answers.department;
            var Price = answers.price;
            var StockQuantity = answers.quantity;
            connection.query('INSERT INTO Products (ProductName, DepartmentName, Price, StockQuantity) VALUES (?, ?, ?, ?)', [ProductName, DepartmentName, Price, StockQuantity], function(err, data) {
                if (err) {
                    throw err;
                } else {
                console.log('\n\nProduct: ' + ProductName + ' added successfully!\n\n');
                appContinue();
                }
            });
        });
    }   



    
                        




