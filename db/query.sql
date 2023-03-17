--View all departments--
SELECT * FROM department

--View all roles--
SELECT role.id, role.title, department.name AS department, role.salary FROM role
LEFT JOIN department 
ON role.department_id = department.id;

--View all employees--
SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary FROM employee 
LEFT JOIN role 
ON employee.role_id = role.id 
LEFT JOIN department 
ON role.department_id = department.id
--ADD MANAGER NAME!!!--

--Add a department--
INSERT INTO department 
SET name = ?

--Add a role--
SELECT * FROM department
--then--
INSERT INTO role 
SET title = ?, salary = ?, department_id = ?

--Add an employee--
SELECT id AS value, title AS name FROM role
--then--
SELECT CONCAT(first_name, " ", last_name) AS name, id AS value FROM employee 
WHERE manager_id is null
--then--
INSERT INTO employee 
SET first_name = ?, last_name = ?, role_id = ?, manager_id = ?

--Update an employee role--
