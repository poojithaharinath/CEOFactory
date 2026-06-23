# Aurum Opportunity Tracker (Mini CRM)

Aurum is a premium, secure, and production-ready MERN stack sales pipeline management application designed with ownership-locked authorization controls and elegant slate/gold visuals.

---

## Technical Stack & Architecture

### Backend (`/backend`)
- **Runtime**: Node.js + Express.js
- **Database**: MongoDB Atlas + Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with a 2-hour sliding expiry window
- **Security**: 
  - Strict ownership-based backend authorization: Validates matching `req.user._id` against the opportunity's stored `owner` ID on updates (`PUT`) and deletions (`DELETE`), returning `403 Forbidden` if breached.
  - Derives `owner` identity exclusively from JWT context for creation (`POST`), ignoring client-supplied IDs.
  - Password hashing with `bcryptjs`.
  - Configurable CORS headers.

### Frontend (`/frontend`)
- **Scaffold**: React 19 + Vite
- **Global State**: `AuthContext` caching the JWT and maintaining user sessions.
- **Styling**: Tailwind CSS with custom fonts (`Outfit`, `Playfair Display`), glassmorphism cards, and sleek dark mode aesthetics.
- **HTTP Client**: Axios with interceptors to automatically inject authorization headers.

---

## Directory Layout

```
Mini_CRM/
├── backend/
│   ├── src/
│   │   ├── config/          # DB config (db.js)
│   │   ├── controllers/     # authController, opportunityController
│   │   ├── middleware/      # JWT protection, error handling
│   │   ├── models/          # User and Opportunity Mongoose schemas
│   │   ├── routes/          # authRoutes, opportunityRoutes
│   │   └── server.js        # Main entry point
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Navbar, OpportunityCard, OpportunityForm
│   │   ├── context/         # AuthContext
│   │   ├── pages/           # Login, Register, Dashboard
│   │   ├── services/        # api (Axios wrapper)
│   │   ├── App.jsx          # Simple state-based router
│   │   └── main.jsx
│   ├── .env.example
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
└── README.md
```

---

## Setup & Running Locally

### Prerequisites
- Node.js (v18 or higher)
- MongoDB running locally or a MongoDB Atlas Connection URI

### 1. Run the Backend
Navigate to the backend directory:
```bash
cd backend
```

Create a `.env` file using the template:
```bash
cp .env.example .env
```
Update `MONGO_URI` with your connection string and `JWT_SECRET` with a secure key.

Install dependencies and start the dev server:
```bash
npm install
npm run dev
```
The server will start on port `5000`.

### 2. Run the Frontend
Navigate to the frontend directory:
```bash
cd ../frontend
```

Create a `.env` file using the template:
```bash
cp .env.example .env
```

Install dependencies and start the dev server:
```bash
npm install --legacy-peer-deps
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## API Documentation

### Authentication Routes
- `POST /api/auth/register` - Create user and receive JWT.
- `POST /api/auth/login` - Authenticate user and receive JWT.
- `GET /api/auth/me` - Fetch authenticated user profile details.

### Opportunity Routes (Protected by JWT)
- `GET /api/opportunities` - View all active pipeline opportunities (Shared dashboard access).
- `GET /api/opportunities/:id` - Fetch details of a specific opportunity.
- `POST /api/opportunities` - Create a new opportunity (Owner automatically set to auth user).
- `PUT /api/opportunities/:id` - Update opportunity. **(Locked to Owner)**
- `DELETE /api/opportunities/:id` - Remove opportunity. **(Locked to Owner)**
