//Require in necessary packages.
const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");

//Establish connection to local database.
const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "employees_db",
});

//Wrap the initial prompt in an init() to be able to call it within individual functions and continuously restart after completing each selected task.
function init() {
  inquirer
    .prompt([
      {
        type: "list",
        loop: false,
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
          addDepartment();
          break;
        case "add a role":
          addRole();
          break;
        case "add an employee":
          addEmployee();
          break;
        case "update an employee role":
          updateRole();
          break;
        case "exit":
          console.log("Goodbye.");
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
    'SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id',
    (err, results) => {
      console.table(results);
      init();
    }
  );
}

function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "dept",
        message: "What is the name of the department?",
      },
    ])
    .then((data) => {
      let department = data.dept;
      db.query(
        "INSERT INTO department SET name = ?",
        department,
        (err, resuls) => {
          if (err) {
            throw err;
          }
          console.log("Department added to database.");
          init();
        }
      );
    });
}

function addRole() {
  db.query("SELECT * FROM department", (err, results) => {
    const deptChoices = results.map(({ id, name }) => ({
      name: name,
      value: id,
    }));
    inquirer
      .prompt([
        {
          type: "input",
          name: "role",
          message: "What is the name of the role?",
        },
        {
          type: "input",
          name: "salary",
          message: "What is the salary of the role?",
        },
        {
          type: "list",
          loop: false,
          name: "department_id",
          message: "What department does the role belong to?",
          choices: deptChoices,
        },
      ])
      .then((data) => {
        let role = data.role;
        let salary = data.salary;
        let departmentID = data.department_id;
        db.query(
          "INSERT INTO role SET title = ?, salary = ?, department_id = ?",
          [role, salary, departmentID],
          (err, results) => {
            if (err) {
              throw err;
            }
            console.log("Role added to database.");
            init();
          }
        );
      });
  });
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
      db.query(
        "SELECT id AS value, title AS name FROM role",
        (err, results) => {
          db.query(
            'SELECT CONCAT(first_name, " ", last_name) AS name, id AS value FROM employee WHERE manager_id is null',
            (err, mResults) => {
              inquirer
                .prompt([
                  {
                    type: "list",
                    loop: false,
                    name: "role_id",
                    message: "What is the employee's role?",
                    choices: results,
                  },
                  {
                    type: "list",
                    loop: false,
                    name: "manager",
                    message: "Who is this emlpoyee's manager?",
                    choices: mResults,
                  },
                ])
                .then((data) => {
                  let roleID = data.role_id;
                  let manager = data.manager;
                  db.query(
                    "INSERT INTO employee SET first_name = ?, last_name = ?, role_id = ?, manager_id = ?",
                    [employeeFirstName, employeeLastName, roleID, manager],
                    (err, results) => {
                      if (err) {
                        throw err;
                      }
                      console.log("Employee added to database.");
                      init();
                    }
                  );
                });
            }
          );
        }
      );
    });
}

function updateRole() {
  db.query(
    'SELECT id AS value, CONCAT(first_name, " ", last_name) AS name FROM employee',
    (err, results) => {
      db.query(
        "SELECT id AS value, title AS name FROM role",
        (err, roleResults) => {
          inquirer
            .prompt([
              {
                type: "list",
                loop: false,
                name: "employee",
                message: "Which employee's role would you like to update?",
                choices: results,
              },
              {
                type: "list",
                loop: false,
                name: "role",
                message: "What would you like to update their role to?",
                choices: roleResults,
              },
            ])
            .then((data) => {
              let employee = data.employee;
              let updatedRole = data.role;
              db.query(
                "UPDATE employee SET role_id = ? WHERE id = ?",
                [updatedRole, employee],
                (err, results) => {
                  if (err) {
                    throw err;
                  }
                  console.log("Employee's role updated in database.");
                  init();
                }
              );
            });
        }
      );
    }
  );
}

init();
