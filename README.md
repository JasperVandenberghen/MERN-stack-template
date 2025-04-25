# MERN Web Application Template

This repository contains a full-stack MERN (MongoDB, Express, React, Node.js) web application template, designed to get you started quickly with modern web development tools and best practices. It includes both the frontend and backend with the following features:

## Features

### Frontend:
The frontend of this template uses the following dependencies:

#### Production Dependencies
- **[@emailjs/browser](https://www.npmjs.com/package/@emailjs/browser)**: For sending emails directly from the browser.
- **[@emotion/cache](https://www.npmjs.com/package/@emotion/cache)**, **[@emotion/react](https://www.npmjs.com/package/@emotion/react)**, and **[@emotion/styled](https://www.npmjs.com/package/@emotion/styled)**: Libraries for styling React components with Emotion.
- **[@mui/icons-material](https://www.npmjs.com/package/@mui/icons-material)** and **[@mui/material](https://www.npmjs.com/package/@mui/material)**: Material-UI components and icons for building user interfaces.
- **[@reduxjs/toolkit](https://www.npmjs.com/package/@reduxjs/toolkit)**: Simplifies state management with Redux.
- **[@sentry/react](https://www.npmjs.com/package/@sentry/react)** and **[@sentry/tracing](https://www.npmjs.com/package/@sentry/tracing)**: For error tracking and performance monitoring.
- **[firebase](https://www.npmjs.com/package/firebase)**: Firebase SDK for authentication, database, and other services.
- **[i18next](https://www.npmjs.com/package/i18next)** and **[react-i18next](https://www.npmjs.com/package/react-i18next)**: For internationalization and localization.
- **[react](https://www.npmjs.com/package/react)** and **[react-dom](https://www.npmjs.com/package/react-dom)**: Core libraries for building React applications.
- **[react-google-recaptcha](https://www.npmjs.com/package/react-google-recaptcha)**: Google reCAPTCHA integration for React.
- **[react-hook-form](https://www.npmjs.com/package/react-hook-form)**: Library for managing forms in React.
- **[react-redux](https://www.npmjs.com/package/react-redux)**: Official React bindings for Redux.
- **[react-router-dom](https://www.npmjs.com/package/react-router-dom)**: For routing in React applications.
- **[redux-persist](https://www.npmjs.com/package/redux-persist)**: Persist and rehydrate Redux state.

#### Development Dependencies
- **[@babel/preset-env](https://www.npmjs.com/package/@babel/preset-env)** and **[@babel/preset-react](https://www.npmjs.com/package/@babel/preset-react)**: Babel presets for transpiling modern JavaScript and React code.
- **[@eslint/js](https://www.npmjs.com/package/@eslint/js)**, **[eslint](https://www.npmjs.com/package/eslint)**, and related plugins: Tools for linting and enforcing code quality.
- **[@testing-library/react](https://www.npmjs.com/package/@testing-library/react)** and **[@testing-library/jest-dom](https://www.npmjs.com/package/@testing-library/jest-dom)**: Libraries for testing React components.
- **[@vitejs/plugin-react](https://www.npmjs.com/package/@vitejs/plugin-react)**: Vite plugin for React.
- **[cypress](https://www.npmjs.com/package/cypress)**: End-to-end testing framework.
- **[eslint-config-prettier](https://www.npmjs.com/package/eslint-config-prettier)** and **[eslint-plugin-prettier](https://www.npmjs.com/package/eslint-plugin-prettier)**: Integrates Prettier with ESLint.
- **[vitest](https://www.npmjs.com/package/vitest)**: Unit testing framework for Vite projects.

### Backend:
The backend of this template uses the following dependencies:

#### Production Dependencies
- **[@sendgrid/mail](https://www.npmjs.com/package/@sendgrid/mail)**: For sending transactional emails via SendGrid.
- **[@sentry/cli](https://www.npmjs.com/package/@sentry/cli)**: Command-line interface for Sentry, used for error tracking and performance monitoring.
- **[@sentry/node](https://www.npmjs.com/package/@sentry/node)**: Sentry SDK for Node.js applications.
- **[@sentry/profiling-node](https://www.npmjs.com/package/@sentry/profiling-node)**: Enables profiling for performance monitoring in Node.js.
- **[axios](https://www.npmjs.com/package/axios)**: Promise-based HTTP client for making API requests.
- **[babel-loader](https://www.npmjs.com/package/babel-loader)**: Transpiles modern JavaScript for compatibility.
- **[cloudinary](https://www.npmjs.com/package/cloudinary)**: Handles image and video uploads and transformations.
- **[cors](https://www.npmjs.com/package/cors)**: Middleware for enabling Cross-Origin Resource Sharing.
- **[dotenv](https://www.npmjs.com/package/dotenv)**: Loads environment variables from a `.env` file.
- **[express](https://www.npmjs.com/package/express)**: Web framework for building APIs and server-side applications.
- **[express-rate-limit](https://www.npmjs.com/package/express-rate-limit)**: Middleware for rate-limiting API requests.
- **[firebase-admin](https://www.npmjs.com/package/firebase-admin)**: Admin SDK for Firebase services.
- **[mongoose](https://www.npmjs.com/package/mongoose)**: ODM (Object Data Modeling) library for MongoDB.
- **[multer](https://www.npmjs.com/package/multer)**: Middleware for handling file uploads.

#### Development Dependencies
- **[@babel/core](https://www.npmjs.com/package/@babel/core)**: Babel core library for transpiling JavaScript.
- **[@babel/preset-env](https://www.npmjs.com/package/@babel/preset-env)**: Babel preset for compiling modern JavaScript.
- **[@eslint/js](https://www.npmjs.com/package/@eslint/js)**: ESLint core library for linting JavaScript.
- **[babel-jest](https://www.npmjs.com/package/babel-jest)**: Babel integration for Jest testing.
- **[eslint](https://www.npmjs.com/package/eslint)**: Linter for identifying and fixing problems in JavaScript code.
- **[eslint-import-resolver-node](https://www.npmjs.com/package/eslint-import-resolver-node)**: ESLint plugin for resolving Node.js modules.
- **[eslint-plugin-import](https://www.npmjs.com/package/eslint-plugin-import)**: ESLint plugin for managing import/export syntax.
- **[eslint-plugin-jest](https://www.npmjs.com/package/eslint-plugin-jest)**: ESLint plugin for Jest testing framework.
- **[eslint-plugin-prettier](https://www.npmjs.com/package/eslint-plugin-prettier)**: Integrates Prettier into ESLint.
- **[globals](https://www.npmjs.com/package/globals)**: Provides a list of global variables for ESLint.
- **[jest](https://www.npmjs.com/package/jest)**: Testing framework for unit and integration tests.
- **[nodemon](https://www.npmjs.com/package/nodemon)**: Automatically restarts the server during development.
- **[supertest](https://www.npmjs.com/package/supertest)**: Library for testing HTTP APIs.

### Core Functionality:
- **Account System**: A complete authentication system, including:
  - User registration and login (with JWT for token-based authentication).
  - Password reset functionality.
  - User profile management (CRUD operations).
  - State management with Redux on the frontend.
- **CRUD Operations**: Implemented for user accounts with the ability to create, read, update, and delete accounts.

---

## Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (local or cloud instance -> in this template I used a cloud instance of MongoDB Atlas)
- **pnpm** (preferred package manager)

---
