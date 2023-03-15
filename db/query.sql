--View all departments--
SELECT * FROM department

--View all roles--
SELECT * FROM role

--View all employees--
SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary FROM employee 
LEFT JOIN role 
ON employee.role_id = role.id 
LEFT JOIN department 
ON role.department_id = department.id
--ADD MANAGER NAME!!!!--