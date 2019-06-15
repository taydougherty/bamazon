var mysql = require("mysql");
var inquirer = require("inquirer");
var keys = require("./keys.js");

var connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: keys.sqlPw,
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  runSearch();
});

function runSearch() {
    inquirer
    .prompt(
        {
            type: "list",
            name: "choices",
            message: "What would you like to do?",
            choices: [
            "View Products for Sale",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product",
            "Exit Search"
            ]}
    )
    .then(function(answer) {
        switch(answer.choices) {
            case "View Products for Sale":
                displayProduct();
                break;
        
              case "View Low Inventory":
                displayLowInvestory();
                break;
        
              case "Add to Inventory":
                addInventory();
                break;
        
              case "Add New Product":
                addProduct();
                break;
        
              case "Exit Search":
                connection.end();
                break;  
        }
        
    })
};

function displayProduct() {
    console.log("Take a look at what we have in store!\n");
    connection.query("SELECT item_id, product_name, department_name, price FROM products", function(err, res) {
      if (err) throw err;
      console.table(res);
      runSearch();
    });
};

function displayLowInvestory(){
    console.log("We're running low on these items - get them while they're still in stock!\n");
    connection.query("SELECT item_id, product_name, department_name, price FROM products WHERE stock_quantity < 5", function(err, res) {
        if (err) throw err;
        console.table(res);
        runSearch();
      });
};

function addInventory(){
    inquirer
    .prompt([{
        name: "id",
        type: "input",
        message: "What is the ID of the product you're looking for?"
      },
      {
          name: "quantity",
          type: "input",
          message: "How many would you like to add to the stock?"
      }
    ])
    .then(function(answer) {
        console.log("Updating requested product quantity...\n");
        connection.query("UPDATE products SET ? WHERE ?",
        [
            {
                item_id: answer.id
            },
            {
                stock_quantity: answer.quantity
            }
        ], function(err, res) {
            if (err) throw err;
            console.log("Updated your stock!");
            runSearch();
          });
        })
};

function addProduct(){
    inquirer
    .prompt([{
        name: "id",
        type: "input",
        message: "What is the ID of the new product?"
      },
      {
        name: "name",
        type: "input",
        message: "What is the name of the new product?"
      },
      {
        name: "department",
        type: "input",
        message: "What department is the new product in?"
      },
      {
        name: "price",
        type: "input",
        message: "What is the price of the new product?"
      },
      {
          name: "quantity",
          type: "input",
          message: "How many would you like to add?"
      }
    ])
    .then(function(answer) {
        console.log("Inserting your new product...\n");
        connection.query("INSERT INTO products SET ?",
            {
                item_id: answer.id,
                product_name: answer.name,
                department_name: answer.department,
                price: answer.price,
                stock_quantity: answer.quantity
            }, 
            function(err, res) {
            if (err) throw err;
            console.log("Your new product has been added!");
            runSearch();
          });
        })
};