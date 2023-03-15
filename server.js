const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");

const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "employees_db",
});

inquirer
  .prompt([
    {
      type: "list",
      name: "task",
      message: "What would you like to do?",
      choices: [
        "view all departments",
        "view all roles",
        "view all employees",
        "add a department",
        "add a role",
        "add an employee",
        "update an employee role",
        "exit",
      ],
    },
  ])
  .then((data) => {
    switch (data.task) {
      case "view all departments":
        console.log("Let's see all departments.");
        db.query("SELECT * FROM department", (err, results) => {
          console.log(results);
        });
        break;
      case "view all roles":
        console.log("Let's see all roles.");
        break;
      case "view all employees":
        console.log("Let's see all employees.");
        break;
      case "add a department":
        console.log("Let's add a department.");
        break;
      case "add a role":
        console.log("Let's add a role.");
        break;
      case "add an employee":
        console.log("Let's add an employee.");
        break;
      case "update an employee role":
        console.log("Let's update an employee role.");
        break;
      case "exit":
        console.log("Goodbye.");
        break;
    }
  });
