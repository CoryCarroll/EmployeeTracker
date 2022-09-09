// Getting required packages and files
const inquirer = require('inquirer');
const mysql = require('mysql2');
require('console.table');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Kyloren2018*!',
        database: 'employees_db'
    },
    console.log(`Connected to database.`)
);

db.connect(function (err) {
    if (err) throw err;
    init();
})

// array of questions
const startQuestions = [{
    type: 'list',
    name: 'options',
    message: 'What would you like to do?',
    options: ['View all departments', 'View all roles', 'View all employees', 'add a department', 'add a role', 'Add an employee', 'update an employee role']
}];

const addDept = [{
    type: 'list',
    message: 'What is the name of the Department?',
    name: 'dept'
}];

const addRole = [{
    type: 'list',
    message: 'What is the name of the role?',
    name: 'role'
}, {
    type: 'input',
    message: 'What is the name of the Department this role is in?',
    name: 'department'
}, {
    type: 'input',
    message: 'What is the Salary of this role?',
}];

function init() {
    inquirer
        .prompt(startQuestions)
        .then(function (answer) {
            switch (answer.option) {
                case 'view all departments':
                    viewDept();
                    break;
                case 'view all roles':
                    viewRoles();
                    break;
                case 'view all employees':
                    viewEmployees();
                    break;
                case 'add a department':
                    createDept();
                    break;
                case 'add a role':
                    createRole();
                    break;
                case 'add an employee':
                    createEmployee();
                    break;
                case 'update an employee':
                    updateEmployee();
                    break;
                case 'exit':
                    db.end();
                    console.log('Goodbye!');
                    process.exit();
            }
        })
}

function viewDept() {
    db.query(`SELECT * FROM departments`, function (err, res) {
        if (err) throw err;
        console.table(res);
        init();
    });
}

function viewRoles() {
    db.query(`SELECT * FROM roles`, function (err, res) {
        if (err) throw err;
        console.table(res);
        init();
    });
}

function viewEmployees() {
    db.query(`SELECT * FROM employees INNER JOIN roles ON roles.id = employees.roleId`, function (err, res) {
        if (err) throw err;
        console.table(res);
        init();
    });
}

function createDept() {
    inquirer
        .prompt(addDept)
        .then((answer) => {
            // setting parameters var
            const sqlParams = JSON.stringify(answer.dept);

            // running the sql query
            db.query(`INSERT INTO departments (deptName) VALUES (` + sqlParams + `);`, function (err, results) {
                if (err) throw err;
                console.log('added successfully!');
                init();
            });
        })
}

function createRole() {
    inquirer
        .prompt(addRole)
        .then((answer) => {
            // setting parameters var
            const roleParams = [answer.role, answer.department, answer.salary];
            const roleString = JSON.stringify(roleParams).replace(/]|[[]/g, '');

            // insert data into roles table
            db.query(`INSERT INTO roles (title, dept, salary) VALUES (` + roleString + `)`, (err, results) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("added successfully!");
                    init();
                }
            });
        })
}

async function createEmployee() {
    const employeeList = await db.promise().query(`SELECT id AS value, CONCAT(firstName, " ", lastName) AS name FROM employees`)
    employeeList[0].push({
        name: "is a manager",
        value: null
    });
    const rolesList = await db.promise().query(`SELECT id AS value, title AS name FROM roles`);

    const addEmployee = [{
            type: 'input',
            message: 'What the first name of this employee?',
            name: 'firstName'
        },
        {
            type: 'input',
            message: 'What the last name of this employee?',
            name: 'lastName'
        },
        {
            type: 'list',
            message: 'What role does this employee have?',
            name: 'roleId',
            choices: rolesList[0]
        },
        {
            type: 'list',
            message: 'What is the name of this employees manager?',
            name: 'managerId',
            choices: employeeList[0]
        }
    ];

    inquirer
        .prompt(addEmployee)
        .then((answer) => {
            if (answer.managerId === "") {
                answer.managerId = null;
            }

            // insert data into roles table
            db.query(`INSERT INTO employees SET ?`, answer, function (err, results) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("added successfully");
                    init();
                }
            });
        })
}

async function updateEmployee() {
    const updateList = await db.promise().query(`SELECT id AS value, CONCAT(firstName, " ", lastName) AS name FROM employees`);

    const updateEmployee = [{
        type: 'list',
        message: 'Which employee would you like to update?',
        name: 'id',
        choices: updateList[0]
    }];

    inquirer
        .prompt(updateEmployee)
        .then((chosenEmployee) => {

            db.query(`SELECT * FROM employees WHERE id =` + chosenEmployee["id"], function (err, pulledRow) {
                if (err) {
                    console.log(err);
                } else {
                    inquirer
                        .prompt({
                            type: 'list',
                            message: 'Which employee would you like to update?',
                            name: 'choice',
                            choices: ['change employees role', 'change employees manager', 'change employees last name']
                        })
                        .then(async (update) => {
                            const updateRolesList = await db.promise().query(`SELECT id AS value, title AS name FROM roles`);
                            const updateManList = await db.promise().query(`SELECT id AS value, CONCAT(firstName, " ", lastName) AS name FROM employees WHERE managerId IS NULL`)

                            switch (update.choice) {
                                case 'change employees role':
                                    // FUNCTION TO RUN
                                    inquirer
                                        .prompt({
                                            type: 'list',
                                            message: 'What would you like to change their role to?',
                                            name: 'choice',
                                            choices: updateRolesList[0]
                                        })
                                        .then((roleId) => {
                                            db.query(`UPDATE employees SET roleId = ` + roleId["choice"] + ` WHERE id =` + chosenEmployee["id"]);
                                            console.log("role updated!");
                                            init();
                                        })
                                    break;

                                case 'change employees manager':
                                    // FUNCTION TO RUN
                                    inquirer
                                        .prompt({
                                            type: 'list',
                                            message: 'Who would you like to change their manager to?',
                                            name: 'choice',
                                            choices: updateManList[0]
                                        })
                                        .then((managerId) => {
                                            db.query(`UPDATE employees SET managerId = ` + managerId["choice"] + ` WHERE id =` + chosenEmployee["id"]);
                                            console.log("manager updated!");
                                            init();
                                        })
                                    break;

                                case 'change employees last name':
                                    // FUNCTION TO RUN
                                    inquirer
                                        .prompt({
                                            type: 'input',
                                            message: 'Who would you like to change their manager to?',
                                            name: 'choice'
                                        })
                                        .then((lastName) => {
                                            db.query(`UPDATE employees SET lastName = "` + lastName["choice"] + `" WHERE id = ` + chosenEmployee["id"]);
                                            console.log("last name updated!");
                                            init();
                                        })
                                    break;
                            }

                        })
                }
            });
        })
}

