# CRM System - Project Structure

## 📋 Overview
A **Support Ticket CRM** built with **FastAPI** (backend) + **React** (frontend) + **SQLite** (database).

### What It Does
- Create and manage customer support tickets
- Search and filter tickets by status
- Update ticket status in real-time
- Track customer information and issue details

---

## 🏗️ Project Architecture

```
CRM-System/
├── backend/              # Python API (FastAPI)
│   ├── app/
│   │   ├── main.py       # FastAPI app setup & CORS
│   │   ├── models.py     # Ticket database model (SQLAlchemy)
│   │   ├── schemas.py    # Data validation schemas (Pydantic)
│   │   ├── database.py   # SQLite connection & session management
│   │   ├── crud.py       # Database operations (Create, Read, Update)
│   │   └── routes.py     # API endpoints (/api/tickets, etc.)
│   ├── requirements.txt   # Python dependencies
│   └── Dockerfile        # Container setup
│
├── frontend/             # React SPA (Vite + Tailwind)
│   ├── src/
│   │   ├── main.jsx      # React app entry point
│   │   ├── App.jsx       # Main component (routing)
│   │   ├── api.js        # Fetch API calls to backend
│   │   ├── index.css     # Tailwind styles
│   │   ├── pages/
│   │   │   ├── Home.jsx  # Ticket list & search page
│   │   │   └── TicketDetails.jsx  # Single ticket view
│   │   └── components/
│   │       ├── TicketForm.jsx       # Create/edit form
│   │       ├── TicketList.jsx       # Display tickets table
│   │       ├── SearchBar.jsx        # Search input
│   │       └── StatusFilter.jsx     # Status dropdown filter
│   ├── package.json      # Node dependencies
│   ├── vite.config.js    # Vite build config
│   └── tailwind.config.js # Tailwind CSS config
│
└── README.md             # Setup instructions
```

---

## 🔄 Data Flow

### Creating a Ticket
1. **User fills form** → `TicketForm.jsx`
2. **Submit button** → calls `api.js` → POST to `/api/tickets`
3. **Backend** → `routes.py` → `crud.py` → saves to SQLite via `models.py`
4. **Response** → Frontend updates `TicketList.jsx`

### Viewing Tickets
1. **Page loads** → `Home.jsx` calls `getTickets()` from `api.js`
2. **API call** → GET `/api/tickets` with filters (search, status)
3. **Backend** → `routes.py` → `crud.py` queries database
4. **Response** → Frontend renders `TicketList.jsx`

---

## 🔑 Key Files Explained

### Backend
| File | Purpose |
|------|---------|
| `main.py` | FastAPI app initialization, CORS setup |
| `models.py` | Ticket schema (id, ticket_id, customer_email, status, etc.) |
| `schemas.py` | Pydantic validation for API requests/responses |
| `crud.py` | Database queries (get_ticket, create_ticket, update_status) |
| `routes.py` | API endpoints (GET, POST, PUT tickets) |
| `database.py` | SQLite connection, session management |

### Frontend
| File | Purpose |
|------|---------|
| `App.jsx` | Main component, routing logic |
| `api.js` | Fetch wrapper for backend calls |
| `pages/Home.jsx` | List view, search, filter UI |
| `pages/TicketDetails.jsx` | Single ticket detailed view |
| `components/TicketForm.jsx` | Form to create/edit tickets |
| `components/TicketList.jsx` | Renders ticket table |

---

## 🚀 Quick Start

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```
API runs at: `http://localhost:8000`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
App runs at: `http://localhost:5173`

---

## 💡 Interview Walkthrough Template

**"Let me walk you through the ticket creation flow..."**

1. **Frontend** → User fills form in `TicketForm.jsx` and clicks submit
2. **API Call** → Sends POST request via `api.js` to `/api/tickets`
3. **Backend** → `routes.py` receives request, validates with `schemas.py`
4. **Database** → `crud.py` creates new row using `models.py`
5. **Response** → Ticket returned to frontend, added to `TicketList.jsx`

**Key points to mention:**
- ✅ Validation happens in both frontend (React) and backend (Pydantic)
- ✅ CORS middleware allows frontend to call backend
- ✅ SQLite stores data persistently
- ✅ Search/filter happens via API query parameters

---

## 📌 Technology Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React + Vite | UI components, state management |
| **Styling** | Tailwind CSS | Responsive design |
| **Backend** | FastAPI | REST API endpoints |
| **ORM** | SQLAlchemy | Database queries |
| **Database** | SQLite | Persistent data storage |
| **Validation** | Pydantic | Request/response validation |

