var mysql = require("mysql");
var inquirer = require("inquirer");
var keys = require("./keys.js");
var table = require("table");

var connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: keys.sqlPw,
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  displayProduct();
});

function displayProduct() {
    console.log("Take a look at what we have in store!\n");
    connection.query("SELECT item_id, product_name, department_name, price FROM products", function(err, res) {
      if (err) throw err;
      console.table(res);
      itemSearch();
    });
  }

function itemSearch() {
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
      console.log("Submitting your order...\n");
      connection.query("SELECT * FROM products WHERE ?", 
        {
          item_id: answer.id
        }, 
        function(err, res) {
          if (err) throw err;

          var quantity = res[0].stock_quantity;
          var finalPrice = answer.quantity * res[0].price;        
      
          if(quantity > answer.quantity){
              connection.query("UPDATE products SET ? WHERE ?",
                [
                    {
                      stock_quantity: quantity - answer.quantity
                    }, 
                    {
                      item_id: answer.id
                    }
                ],
                function(err, res) {
                  if(err) throw err;
                  
                  console.log("Order complete! Your total is $" + finalPrice + "\n");
                  connection.end();
                } 
              );
              
            } else {
              console.log("Sorry we're out of stock!\n");
              connection.end();
            }
          });
      
    });
};
