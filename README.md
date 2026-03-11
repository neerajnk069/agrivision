OneNight - Full Stack Application
Overview
OneNight is a full-stack application built with a Node.js 24 backend and React 18/19 frontend. The backend serves as a RESTful API with authentication, file handling, and database integration, while the frontend provides an interactive UI with rich data visualization, forms, and real-time notifications.

Prerequisites
Node.js (v18+ recommended)

npm or yarn

MySQL

OneNight/
├── client/          # React 18/19 Frontend
└── server/          # Node.js 24 Backend


🎯 Frontend Features:
Material-UI v7 for UI components and design

React-Redux for state management

ApexCharts for interactive data visualization

Leaflet for interactive maps

CKEditor 5 & React Quill for rich text editing

React Toastify for notifications

React Datepicker & React Big Calendar for date management

File Export functionality with React CSV & XLSX

Frontend Technologies:
React 18/19 for UI components

Material-UI for design and components

Redux Toolkit for state management

ApexCharts for data visualization

CKEditor 5 & React Quill for rich text editing

React Toastify for UI notifications

Frontend Folder Structure:
text
src/
├── Admin/                # Admin panel UI components
│   ├── bookings/
│   ├── Cms/
│   ├── providers/
│   ├── Common/           # Common reusable components (Buttons, Modals, etc.)
│   ├── Contactus/
│   ├── Users/
│ 
│  
├── store/                # Redux store configuration
│   ├── slices/           # Redux slices for managing state
│   └── index.js          # Store setup
└── App.js                # Main App component
📦 Frontend Dependencies:
react@18 or react@19 - React framework

react-dom - React DOM renderer

redux & @reduxjs/toolkit - State management

@mui/material - Material-UI components

react-router-dom - Routing for navigation

apexcharts & react-apexcharts - Data visualization

leaflet & react-leaflet - Map functionality

react-toastify - Notifications

react-datepicker & react-big-calendar - Date pickers and calendar

ckeditor & react-quill - Rich text editors

react-csv & xlsx - File export



🚀 Backend Server Features
RESTful API powered by Express.js

JWT Authentication for secure user management

Sequelize ORM for easy interaction with MySQL

File Upload Handling using express-fileupload

Password Hashing with bcryptjs

CORS for cross-origin resource handling

Logging using morgan and debug

Input Validation with node-input-validator

Backend Technologies:
Node.js 24 & Express.js for the server

MySQL & Sequelize ORM for database interaction

JWT for authentication

bcryptjs for password encryption

dotenv for environment variable management

CORS for handling cross-origin requests

express-fileupload for file uploads

Backend Folder Structure:
text
server/
├── OneNight.js          # Main server entry point
├── package.json          # Dependencies & scripts
├── .env                  # Environment variables (create this)
├── models/               # Sequelize models for database
├── routes/               # API route handlers
├── controllers/          # API controllers
├── middleware/           # Custom middleware (e.g., auth, validation)
├── config/               # Configuration files (e.g., database setup)
└── public/images              # Directory for uploaded files
📦 Backend Dependencies:
Core Dependencies:

express - Web framework

mysql2 - MySQL database driver

sequelize - ORM for database interaction

jsonwebtoken - JWT for user authentication

bcryptjs - Password hashing

cors - Cross-Origin Resource Sharing

cookie-parser - Cookie handling

express-fileupload - File upload middleware

Development Dependencies:

nodemon - Auto-restart server in development mode

debug - Debugging utility

morgan - HTTP request logger

dotenv - Environment variable management

node-input-validator - Input validation