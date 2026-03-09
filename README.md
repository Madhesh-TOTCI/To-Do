# VibrantTasks - MERN Stack To-Do Application

A modern, colorful, and fully responsive To-Do application built with React, Node.js, Express, and MongoDB. Optimized for deployment on Render (Backend) and Vercel (Frontend).

## Features
- **Modern UI**: Vibrant pastel-themed interface using Tailwind CSS.
- **Full CRUD**: Create, read, update (completion toggle), and delete tasks.
- **Priority Marking**: Categorize tasks as Low, Medium, or High priority.
- **Stats Dashboard**: Real-time counters for total, pending, and completed tasks.
- **Mobile Responsive**: Works beautifully on all screen sizes.

## Prerequisites
- Node.js (v16+)
- npm or yarn
- MongoDB Atlas account (for database)

## Local Setup

### 1. Backend Setup
1. Open a terminal and navigate to the `backend` folder:
    `cd backend`
2. Install dependencies:
    `npm install`
3. Create a `.env` file from the template:
    `cp .env.example .env`
4. Update `MONGODB_URI` in `.env` with your actual MongoDB connection string.
5. Start the server:
    `npm start`

### 2. Frontend Setup
1. Open another terminal and navigate to the `frontend` folder:
    `cd frontend`
2. Install dependencies:
    `npm install`
3. Create a `.env` file:
    `echo "REACT_APP_API_BASE_URL=http://localhost:5000/api" > .env`
4. Start the frontend:
    `npm start`

## Deployment

### Backend (Render)
1. Push your code to a GitHub repository.
2. Sign in to [Render](https://render.com/).
3. Create a **New Web Service**.
4. Set the **Root Directory** to `backend`.
5. Set the **Build Command** to `npm install`.
6. Set the **Start Command** to `node server.js`.
7. In **Environment Variables**, add:
    - `MONGODB_URI`: Your MongoDB Atlas string.
    - `PORT`: 5000 (standard for Render).

### Frontend (Vercel)
1. Sign in to [Vercel](https://vercel.com/).
2. Click **Add New** -> **Project**.
3. Import your GitHub repository.
4. Set the **Root Directory** to `frontend`.
5. Under **Environment Variables**, add:
    - `REACT_APP_API_BASE_URL`: The URL provided by Render (e.g., `https://your-api.onrender.com/api`).
6. Click **Deploy**.

## Project Structure
- `backend/`: Node.js/Express server logic and MongoDB schemas.
- `frontend/`: React application using Tailwind CSS for a modern "neon-pastel" look.
- `api/taskApi.js`: Centralized Axios configuration for backend communication.

## Troubleshooting
- **CORS Error**: Ensure your backend `server.js` has `app.use(cors())` enabled.
- **DB Connection**: Double-check your MongoDB URI and ensure you've allowed "Access from Anywhere" (0.0.0.0/0) in Atlas network settings.
- **Environment Variables**: React requires variables to start with `REACT_APP_` to be accessible in the browser.
