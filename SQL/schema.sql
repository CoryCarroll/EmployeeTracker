-- Delete database if it already exists
DROP DATABASE IF EXISTS employees_db;

--Creates database
CREATE DATABASE employees_db;

--Telling sql to use this database
USE employees_db;

--Creating my tables
CREATE TABLE department (
    id INT AUTO_INCREMENT PRIMARY KEY,
    deptName VARCHAR(30) NOT NULL
);

CREATE TABLE role (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL
    salary DECIMAL NOT NULL
    department_id INT NOT NULL
);

CREATE TABLE employee (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT NOT NULL,
    dept VARCHAR(30),
    salary DECIMAL
);