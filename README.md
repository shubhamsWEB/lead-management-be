# Lead Management API

## Overview

This is a RESTful API backend for a Lead Management application built with Node.js, Express, and MongoDB. The application has lead tracking, filtering, searching, and exporting features.

## Features

- **User Authentication**: Registration, login, and JWT-based authentication
- **Role-Based Access Control**: Admin and regular user roles
- **Lead Management**: CRUD operations for leads
- **Advanced Filtering & Searching**: Filter leads by various attributes, full-text search
- **Sorting & Pagination**: Sort by any field with custom pagination
- **Data Export**: Export leads to CSV
- **Security**: Password hashing, JWT-based authentication, secure HTTP headers

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Express Validator** - Input validation
- **Helmet** - Security HTTP headers
- **CORS** - Cross-Origin Resource Sharing
- **Morgan** - HTTP request logger
- **Jest** - Testing framework
- **Supertest** - HTTP assertions for testing

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd leads-management-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Environment Variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=<your_mongodb_connection_string>
   JWT_SECRET=<your_jwt_secret>
   JWT_EXPIRE=30d
   JWT_COOKIE_EXPIRE=30
   CORS_ORIGIN=http://localhost:3000
   ```

### Running the Application

1. Development mode:
   ```bash
   npm run dev
   ```

2. Production mode:
   ```bash
   npm start
   ```

### Seeding the Database

The project includes seed scripts to populate the database with test data:

1. Seed users (creates admin and regular users):
   ```bash
   npm run seedUsers
   ```

2. Seed leads (creates sample leads):
   ```bash
   npm run seedLeads
   ```

3. Seed both:
   ```bash
   npm run seed
   ```

### Running Tests

```bash
npm test
```

## API Documentation

### Authentication Endpoints

#### Register User
- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Auth required**: No
- **Request Body**:
  ```json
  {
    "name": "User Name",
    "email": "user@example.com",
    "password": "password123",
    "role": "user" // Optional, defaults to "user"
  }
  ```
- **Success Response**: `201 Created`
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "60f7a7b5c9b4d83e3c9b4d83",
      "name": "User Name",
      "email": "user@example.com",
      "role": "user"
    }
  }
  ```

#### Login User
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Auth required**: No
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "60f7a7b5c9b4d83e3c9b4d83",
      "name": "User Name",
      "email": "user@example.com",
      "role": "user"
    }
  }
  ```

#### Get Current User
- **URL**: `/api/auth/me`
- **Method**: `GET`
- **Auth required**: Yes (Bearer Token)
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "_id": "60f7a7b5c9b4d83e3c9b4d83",
      "name": "User Name",
      "email": "user@example.com",
      "role": "user",
      "createdAt": "2023-07-20T12:00:00.000Z",
      "updatedAt": "2023-07-20T12:00:00.000Z"
    }
  }
  ```

#### Logout User
- **URL**: `/api/auth/logout`
- **Method**: `GET`
- **Auth required**: No
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {}
  }
  ```

#### Update User Details
- **URL**: `/api/auth/updatedetails`
- **Method**: `PUT`
- **Auth required**: Yes (Bearer Token)
- **Request Body**:
  ```json
  {
    "name": "Updated Name",
    "email": "updated@example.com"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "_id": "60f7a7b5c9b4d83e3c9b4d83",
      "name": "Updated Name",
      "email": "updated@example.com",
      "role": "user",
      "createdAt": "2023-07-20T12:00:00.000Z",
      "updatedAt": "2023-07-20T12:30:00.000Z"
    }
  }
  ```

#### Update Password
- **URL**: `/api/auth/updatepassword`
- **Method**: `PUT`
- **Auth required**: Yes (Bearer Token)
- **Request Body**:
  ```json
  {
    "currentPassword": "password123",
    "newPassword": "newpassword123"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

### Lead Endpoints

#### Get All Leads
- **URL**: `/api/leads`
- **Method**: `GET`
- **Auth required**: No
- **Query Parameters**:
  - `page` - Page number (default: 1)
  - `limit` - Number of results per page (default: 10)
  - `sort` - Field to sort by (e.g., name, company, stage)
  - `sortOrder` - Sort direction (asc or desc, default: desc)
  - `search` - Search term for text search
  - `stage` - Filter by stage (I, II, III, IIII)
  - `engaged` - Filter by engagement (true or false)
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "count": 10,
    "pagination": {
      "total": 85,
      "page": 1,
      "limit": 10,
      "totalPages": 9
    },
    "data": [
      {
        "_id": "60f7a7b5c9b4d83e3c9b4d83",
        "name": "Emma Blake",
        "email": "emma.blake@flux.com",
        "company": "Flux Technologies Ltd.",
        "stage": "I",
        "engaged": false,
        "lastContacted": "2025-01-23T00:00:00.000Z",
        "initials": "EB",
        "createdAt": "2023-07-20T12:00:00.000Z",
        "updatedAt": "2023-07-20T12:00:00.000Z"
      },
      // More leads...
    ]
  }
  ```

#### Get Single Lead
- **URL**: `/api/leads/:id`
- **Method**: `GET`
- **Auth required**: No
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "_id": "60f7a7b5c9b4d83e3c9b4d83",
      "name": "Emma Blake",
      "email": "emma.blake@flux.com",
      "company": "Flux Technologies Ltd.",
      "stage": "I",
      "engaged": false,
      "lastContacted": "2025-01-23T00:00:00.000Z",
      "initials": "EB",
      "createdAt": "2023-07-20T12:00:00.000Z",
      "updatedAt": "2023-07-20T12:00:00.000Z"
    }
  }
  ```

#### Create Lead
- **URL**: `/api/leads`
- **Method**: `POST`
- **Auth required**: Yes (Bearer Token)
- **Request Body**:
  ```json
  {
    "name": "New Lead",
    "email": "newlead@example.com",
    "company": "New Company",
    "stage": "I",
    "engaged": false,
    "lastContacted": "2023-07-20"
  }
  ```
- **Success Response**: `201 Created`
  ```json
  {
    "success": true,
    "data": {
      "_id": "60f7a7b5c9b4d83e3c9b4d84",
      "name": "New Lead",
      "email": "newlead@example.com",
      "company": "New Company",
      "stage": "I",
      "engaged": false,
      "lastContacted": "2023-07-20T00:00:00.000Z",
      "initials": "NL",
      "createdAt": "2023-07-20T12:00:00.000Z",
      "updatedAt": "2023-07-20T12:00:00.000Z"
    }
  }
  ```

#### Update Lead
- **URL**: `/api/leads/:id`
- **Method**: `PUT`
- **Auth required**: No
- **Request Body**:
  ```json
  {
    "name": "Updated Lead",
    "stage": "II",
    "engaged": true
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "_id": "60f7a7b5c9b4d83e3c9b4d83",
      "name": "Updated Lead",
      "email": "emma.blake@flux.com",
      "company": "Flux Technologies Ltd.",
      "stage": "II",
      "engaged": true,
      "lastContacted": "2025-01-23T00:00:00.000Z",
      "initials": "UL",
      "createdAt": "2023-07-20T12:00:00.000Z",
      "updatedAt": "2023-07-20T12:30:00.000Z"
    }
  }
  ```

#### Delete Lead
- **URL**: `/api/leads/:id`
- **Method**: `DELETE`
- **Auth required**: No
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {}
  }
  ```

#### Export Leads
- **URL**: `/api/leads/export`
- **Method**: `GET`
- **Auth required**: No
- **Success Response**: `200 OK` with CSV file download containing all leads

### System Endpoints

#### Health Check
- **URL**: `/health`
- **Method**: `GET`
- **Auth required**: No
- **Success Response**: `200 OK`
  ```json
  {
    "status": "ok"
  }
  ```

## Data Models

### User Model

```
{
  name: String (required),
  email: String (required, unique),
  password: String (required, min length 6),
  role: String (enum: ['user', 'admin'], default: 'user'),
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Lead Model

```
{
  name: String (required),
  email: String (required, unique),
  company: String (required),
  stage: String (enum: ['I', 'II', 'III', 'IIII'], default: 'I'),
  engaged: Boolean (default: false),
  lastContacted: Date (default: null),
  initials: String (max length 2),
  createdAt: Date,
  updatedAt: Date
}
```

## Deployment

The application is set up for deployment on Vercel with a serverless configuration. The `vercel.json` file is already configured for deployment.

### Deploy to Vercel

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

## Development Notes

- The backend follows the MVC (Model-View-Controller) pattern
- Authentication is handled using JWT tokens stored in HTTP-only cookies
- All passwords are hashed using bcrypt before storage
- Input validation is done using express-validator middleware
- API responses are consistent with the same structure for all endpoints
- Error handling is centralized in a middleware
