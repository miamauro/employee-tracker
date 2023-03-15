SELECT * FROM employee
JOIN role
ON employee.role_id = role.id
JOIN department
ON department.id = role.department_id;