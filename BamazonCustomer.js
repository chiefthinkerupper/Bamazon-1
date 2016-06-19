var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: 'Fl0r1d@!',
	database: 'Bamazon'
})

connection.connect(function(err) {
	if (err) throw err;
	console.log('connected as id' + connection.threadId);
	start();
})

var start = function() {
    connection.query('SELECT * FROM Products', function(err, res) {
        console.log('---------------------------------');
        console.log('Available Bamazon Products');
        console.log('---------------------------------');
        for (var i=0; i < res.length; i++) {
		console.log(res[i].ItemID + " || " + res[i].ProductName + " || " + res[i].Price + " || " + res[i].stockQuantity);	
		}
        buyItem();
        })
    }

var buyItem = function() {
	connection.query('SELECT * FROM Products', function(err, res) {
	inquirer.prompt({
		name: "choice",
		type: "rawlist",
		choices: function(value) {
			var choiceArray = [];
			for (var i = 0; i < res.length; i++) {
                    choiceArray.push(res[i].ProductName +': '+ res[i].Price);
                }
                return choiceArray;
            },
        	message: "Choose the ID of the Item you would like to buy"
		}).then(function(answer) {
			for (var i = 0; i < res.length; i++) {
	                if (res[i].ItemID == answer.choice) {
	                    var chosenItem = res[i];
                        inquirer.prompt({
                        	name: "buy",
                        	type: "input",
                        	message: "How many would you like to buy?"
                    }).then(function(answer) {
                        if (chosenItem.stockQuantity < parseInt(answer.buy)) {
                            connection.query("UPDATE Products SET ? WHERE ?", [{
                                stockQuantity: answer.buy
                            }, {
                                id: chosenItem.id
                            }], function(err, res) {
                                console.log("Purchase successfull!");
                                start();
                            });
                        } else {
                            console.log("We're sorry, that Item is currently out of stock");
                            start();
                        }
                    })
                }
            }
        })
	})
}
