# Password Encryption in Node.js using bcryptjs Module

When developing applications, one of the critical aspects of user authentication is ensuring that passwords are stored securely. Plain text storage of passwords is a significant security risk. Instead, passwords should be encrypted using strong hashing algorithms. In Node.js, one of the popular modules for this purpose is bcryptjs.

**What is bcryptjs?**

bcryptjs is a JavaScript implementation of the bcrypt password hashing function. It is designed to be secure and efficient, making it a suitable choice for hashing passwords in Node.js applications.

**Key Features**

- Security: Uses a computationally intensive hashing algorithm to make brute-force attacks difficult.
- Salting: Adds a unique salt to each password to ensure that even if two users have the same password, their hashes will be different.
- Cross-Platform: Works across different operating systems and platforms.

## Approach

To encrypt password in Node App using bcrypt module, firstly

The bcryptjs module is imported. A plain text password password is defined. A variable hashedPassword is declared to store the hashed password.
bcrypt.genSalt(10, function (err, Salt) {...}) generates a salt with 10 rounds and executes a callback function with the generated salt.
Inside the salt generation callback, bcrypt.hash(password, Salt, function (err, hash) {...}) hashes the password with the generated Salt.
If an error occurs, an error message is logged. If successful, the hashed password is stored in hashedPassword and logged.
bcrypt.compare(password, hashedPassword, async function (err, isMatch) {...}) compares the original password with the hashed password.
If they match, logs indicate successful encryption and matching. If they don't match, an error message is logged.

## Installation
Steps to Set Up Node Project and Implement bcrypt

Step 1: You can install this package by using this command.

npm install bcryptjs

Step 2: After installing bcryptjs module you can check your request version in the command prompt using the command.

npm version bcryptjs