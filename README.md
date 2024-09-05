# Spam Checker API

This project is a REST API built using Node.js, Express, and PostgreSQL with Prisma ORM. The API is designed to be consumed by a mobile app and provides functionality similar to popular apps that identify spam phone numbers or allow reverse phone number lookup.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Data Seeding](#data-seeding)
- [Running the Application](#running-the-application)
- [Postman Collection](#postman-collection)

## Features

- **User Registration & Authentication**: Users can register with a unique phone number, name, and password. JWT tokens are used for secure authentication.
- **Search Functionality**: Users can search the global database by name or phone number. The search results include the likelihood of a number being spam.
- **Spam Reporting**: Users can report phone numbers as spam, which will be visible to others via the global database.
- **Conditional Email Display**: The email address of a searched person is only displayed if the person is a registered user and the searching user is in the person’s contact list.

## Technologies

- **Node.js**: JavaScript runtime for building server-side applications.
- **Express**: Web framework for Node.js.
- **PostgreSQL**: Relational database management system.
- **Prisma**: Next-generation ORM for Node.js and TypeScript.
- **JWT**: JSON Web Tokens for secure user authentication.
- **bcryptjs**: Library for hashing passwords.

## Data Seeding

To seed the database with sample data, run the following command:

```bash
node seed.js
```

This will populate the database with random users, contacts, and spam reports for testing purposes.

## Running the Application

To start the application in development mode:

```bash
npm run dev
```

The server will start on `http://localhost:3000`.

## Postman Collection

Under the same repository we have attached a file by the name `spam-checker-api.postman_collection.json`. Import this file into your postman application to run the collection requests.