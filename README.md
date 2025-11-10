# LMS Web Server

This is a web server for a Learning Management System (LMS). It handles API requests, database interactions, and authentication.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/)
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd lms-web-server
```

### 2. Install Dependencies

Install the required npm packages.

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root of the project. This file will store your secret keys and configuration variables.

```bash
touch .env
```

Open the `.env` file and add the following variables. Replace the placeholder values with your actual credentials.

```env
# Server Configuration
PORT=3000

# MongoDB Connection
MONGO_URI=mongodb+srv://<user>:<password>@<cluster-url>/<database-name>

# Clerk Authentication
CLERK_WEBHOOK_SECRET=<your-clerk-webhook-secret>

```

**Note:** Remember to replace `<user>`, `<password>`, `<cluster-url>`, `<database-name>`, and `<your-clerk-webhook-secret>` with your actual credentials.

## Available Scripts

### Running in Development Mode

This command starts the server with `nodemon`, which automatically restarts the server when you make changes to the code.

```bash
npm run server
```

The server will be running at `http://localhost:3000`.

### Running in Production Mode

This command starts the server in a standard way.

```bash
npm start
```

## API Endpoints

- `GET /`: A simple endpoint to check if the API is running.
- `POST /clerk`: Webhook endpoint to receive events from Clerk for user synchronization.
