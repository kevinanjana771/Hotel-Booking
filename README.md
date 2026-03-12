# Hotel Booking Application

A full-stack hotel booking application built with React, Node.js, and Supabase.

## 🚀 Features

- **Hotel Listings**: Browse various hotels with details and pricing.
- **Booking System**: Securely book your stay at your favorite hotels.
- **Admin Dashboard**: Manage bookings and hotel information.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## 🛠️ Technology Stack

- **Frontend**: React, Vite, Vanilla CSS
- **Backend**: Node.js, Express
- **Database**: Supabase (PostgreSQL)

## 📦 Project Structure

```bash
Hotel booking/
├── frontend/         # React frontend
└── backend/          # Node.js Express backend
```

## ⚙️ Setup Instructions

### Prerequisites

- Node.js installed
- Supabase account and project

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and add your database credentials (check `config/db.js` for requirements):
   ```env
   PORT=5001
   DATABASE_URL=your_supabase_connection_string
   ```
4. Start the server:
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

## 📄 License

This project is open-source and available under the MIT License.