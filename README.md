# Portfolio Pal

Portfolio Pal is a full-stack stock portfolio management application that allows users to track their investments, manage transactions, and monitor their favorite stocks.

## Features

- **User Authentication**: Secure signup and login using JSON Web Tokens (JWT) and bcrypt password hashing.
- **Dashboard**: A comprehensive overview of your portfolio performance, complete with interactive charts.
- **Portfolio Management**: View and manage your current stock holdings.
- **Transactions Tracking**: Keep a detailed history of your buy and sell orders.
- **Watchlist**: Monitor stocks you are interested in before making investment decisions.

## Tech Stack

### Frontend
- **Framework**: React (with Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI & Radix UI
- **Forms & Validation**: React Hook Form & Zod
- **Charts**: Recharts
- **Routing**: React Router DOM

### Backend
- **Environment**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **Authentication**: JWT & bcryptjs

## Project Structure

```text
portfolio-pal-main/
├── backend/          # Node.js + Express backend API
│   ├── config/       # Database configuration
│   ├── middleware/   # Custom Express middlewares (e.g., auth)
│   ├── routes/       # API route definitions
│   └── server.js     # Entry point for the backend server
└── frontend/         # React + Vite frontend application
    ├── public/       # Static assets
    └── src/          # Source code (components, pages, hooks, services)
```

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MySQL](https://www.mysql.com/) database server

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Create a `.env` file in the `backend` directory.
   - Add the necessary variables (e.g., database credentials, JWT secret):
     ```env
     PORT=5000
     DB_HOST=localhost
     DB_USER=your_mysql_user
     DB_PASSWORD=your_mysql_password
     DB_NAME=portfolio_pal
     JWT_SECRET=your_jwt_secret_key
     ```
4. Set up your MySQL database and tables as expected by the application.
5. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## License
[Add License Here]
