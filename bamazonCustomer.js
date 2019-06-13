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
      connection.end();
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
      var query = "SELECT * FROM products WHERE ?";
      connection.query(query, { item_id: answer.id }, function(err, res) {
        
      var quantity = res[0].stock_quantity;
      var finalPrice = answer.quantity * res[0].price        
      
      if(quantity > answer.quantity){
          
          console.log("Submitting order...your total is $" + finalPrice);
          
          connection.query("UPDATE products SET? WHERE?",
             [
                {
                  stock_quantity: quantity - answer.quantity
                },
            ],
            function(err) {
              if(err) throw err;
              
              console.log("Your order is complete!");
            }   
        } else {
          console.log("Sorry we're out of stock!");
        }
      });
    });
};
