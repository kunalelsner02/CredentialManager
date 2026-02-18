# Project Manager

A full-stack application for managing projects with clone links and authorization credentials.

## Features

- Add projects with name, clone link, and authorization password
- View all projects in a clean interface
- Delete projects
- Modern, responsive UI
- RESTful API backend

## Tech Stack

### Frontend
- React 19
- Modern CSS with responsive design
- Fetch API for HTTP requests

### Backend
- Node.js
- Express.js
- CORS enabled
- In-memory data storage

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies (if not already installed):
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Usage

1. Make sure both backend and frontend servers are running
2. Open your browser and navigate to `http://localhost:3000`
3. Fill in the form with:
   - **Project Name**: A descriptive name for your project
   - **Clone Link**: The Git repository URL (https://github.com/user/repo.git)
   - **Authorization Pass**: Password or token for repository access
4. Click "Add Project" to save
5. View your projects in the list below the form
6. Delete projects using the delete button

## API Endpoints

- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create a new project
- `DELETE /api/projects/:id` - Delete a project

## Project Structure

```
├── backend/
│   ├── package.json
│   ├── server.js
│   └── node_modules/
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   └── ...
│   ├── package.json
│   └── node_modules/
└── README.md
```

## Notes

- The backend uses in-memory storage, so data will be lost when the server restarts
- For production use, consider adding a database (MongoDB, PostgreSQL, etc.)
- The authorization password is stored as-is; consider encryption for production
- The frontend includes basic form validation
# CredentialManager
