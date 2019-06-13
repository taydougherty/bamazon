var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: "Dupn6hbe#",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  displayProduct();
});

function displayProduct() {
    connection.query("SELECT item_id, product_name, department_name, price FROM products", function(err, res) {
      if (err) throw err;
      console.log("Take a look at what we have in store!\n Item ID | Product | Department | Price($)");
        for(i = 0; i < res.length; i++){
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price);
        }
      itemSearch();
    //   connection.end();
    });
  }

inquirer
    .prompt([{
      name: "id",
      type: "input",
      message: "What is the ID of the product you're looking for?"
    },
    {
        name: "quantity",
        type: "input",
        message: "How many would you like to buy?"
    }
    ])
    .then(function(answer) {
      var query = "SELECT * FROM products WHERE ?";
      connection.query(query, { item_id: answer.id }, function(err, res) {
    
        // check if the quantity demanded is less than or equal to the stock quantity
        if()
        // if it is =< then display the price for the user (price x quantity)
        // if there is not enough then display "insufficient quantity"
        for (var i = 0; i < res.length; i++) {
            if()
          console.log("Position: " + res[i].position + " || Song: " + res[i].song + " || Year: " + res[i].year);
        }
      });
    });
