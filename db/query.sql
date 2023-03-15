--View all departments--
SELECT * FROM department

--View all roles--
SELECT role.id, role.title, department.name, role.salary FROM role
LEFT JOIN department 
ON role.department_id = department.id;

--View all employees--
SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary FROM employee 
LEFT JOIN role 
ON employee.role_id = role.id 
LEFT JOIN department 
ON role.department_id = department.id
--ADD MANAGER NAME!!!!--