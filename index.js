const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");

const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "employees_db",
});

function init() {
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
          viewAllDepartments();
          break;
        case "view all roles":
          viewAllRoles();
          break;
        case "view all employees":
          viewAllEmployees();
          break;
        case "add a department":
          // console.log("Let's add a department.");
          break;
        case "add a role":
          // console.log("Let's add a role.");
          break;
        case "add an employee":
          addEmployee();
          break;
        case "update an employee role":
          // console.log("Let's update an employee role.");
          break;
        case "exit":
          process.exit();
      }
    });
}

function viewAllDepartments() {
  db.query("SELECT * FROM department", (err, results) => {
    console.table(results);
    init();
  });
}

function viewAllRoles() {
  db.query(
    "SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department ON role.department_id = department.id;",
    (err, results) => {
      console.table(results);
      init();
    }
  );
}

function viewAllEmployees() {
  db.query(
    "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id",
    (err, results) => {
      console.table(results);
      init();
    }
  );
}

function addEmployee() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "What is the employee's first name?",
      },
      {
        type: "input",
        name: "lastName",
        message: "What is the employee's last name?",
      },
    ])
    .then((data) => {
      let employeeFirstName = data.firstName;
      let employeeLastName = data.lastName;
      db.query("SELECT * FROM role", (err, results) => {
        const roleChoices = results.map(({ id, title }) => ({
          name: title,
          value: id,
        }));
        inquirer
          .prompt([
            {
              type: "list",
              name: "role_id",
              message: "What is the employee's role?",
              choices: roleChoices,
            },
          ])
          .then((data) => {
            let roleID = data.role_id;
            db.query(
              "INSERT INTO employee SET first_name = ?, last_name = ?, role_id = ?",
              [employeeFirstName, employeeLastName, roleID],
              (err, results) => {
                if (err) {
                  throw err;
                }
                init();
              }
            );
          });
      });
    });
}

init();
