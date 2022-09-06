// Getting required packages and files
const inquirer = require('inquirer');
const sequelize = require('./config/connection.js');

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

const addEmployee = [{
    type: 'input',
    message: 'What is the employees first name?',
    name: 'employFirst'
}, {
    type: 'input',
    message: 'What is the employees last name?',
    name: 'employLast'
}, {
    type: 'input',
    message: 'What is the role of this employee?',
    name: 'employRole',
}, {
    type: 'input',
    message: 'What manager does this employee report to?',
    name: 'managerName',
}]

function init() {
    try {
        inquirer.prompt(startQuestions)
        .then((answer) => {
            if (answer.options == "View all departments") {
                sequelize.query('SELECT * FROM departments', function (err, results) {
                    console.log(results);
                })
            }
            if (answer.options == "View all roles") {
                sequelize.query('SELECT * FROM roles', function (err, results) {
                    console.log(results);
                })
            }
            if (answer.options == "View all employees") {
                sequelize.query('SELECT * FROM tables', function (err, results) {
                    console.log(results);
                })
            }
            if (answer.options == "add a department") {
                createDept();
            }
            if (answer.options == "add a role") {
                createRole();
            }
            if (answer.options == "add an employee") {
                createEmployee();
            }
            if (answer.options == "update an employee") {
                updateEmployee();
            }
        })
    } catch(err) {
        console.log(err);
    }
};

function createDept() {
    try {
        inquirer.prompt(addDept)
            .then((answer) => {
                // insert data into departments table
                sequelize.query('INSERT INTO departments (deptName) values (' + answer.dept + ')', function (err, results) {
                    console.log(results);
                });

                init();
            })
    } catch (err) {
        console.log(err);
    }
}

function createRole() {
    try {
        inquirer.prompt(addRole)
            .then((answer) => {
                // insert data into roles table
                sequelize.query('INSERT INTO roles (title, department, salary) values (' + answer.role + answer.department + answer.salary + ')', function (err, results) {
                    console.log(results);
                });

                init();
            })
    } catch (err) {
        console.log(err);
    }
}

function createEmployee() {
    try {
        inquirer.prompt(addEmployee)
            .then((answer) => {
                // insert data into roles table
                sequelize.query('INSERT INTO employees (firstName, lastName, title, manager) values (' + answer.empFirst + answer.empLast + answer.empRole + answer.manName + ')', function (err, results) {
                    sequelize.query('INSERT INTO employees (`dept`,`salary`) SELECT `dept`,`salary` FROM roles WHERE `roles.title`= `employess.title`', function (err, results) {
                        console.log(results);
                    });
                });

                init();
            })
    } catch (err) {
        console.log(err);
    }
}

function updateEmployee() {
    try {
        inquirer.prompt(addDept)
            .then((answer) => {
                // then what?
            })
    } catch (err) {
        console.log(err);
    }
}

// calling init function
init();