# 🎫 SupportFlow Command Center

A premium, high-fidelity customer support CRM dashboard featuring a sophisticated **Glassmorphic HUD (Heads-Up Display)** interface. Powered by a FastAPI backend and a React (Vite) frontend with SQLite storage, this system is optimized for high-performance operations teams.

---

## 🚀 Key Features

*   **Telemetry Analytics Dashboard**: Dynamic stats tracking total, active, and resolved support cases. Features a custom HTML flex bar chart for weekly ticket volume trends and a custom SVG progress ring measuring resolution efficiency.
*   **Support Queue Management**: Frosted card list with status indicators, colorful customer initials-based avatar generators, multi-layer search, and status filtering.
*   **Staff Activity Modals**: Smooth slide-up creation forms to open and queue new tickets with real-time background dashboard updates.
*   **Split-Pane Ticket Inspecting**: Deep detail panes documenting issue fields side-by-side with staff activity logs and dropdown status selectors.
*   **Live Team Directory**: Directory table listing support personnel, their network statuses (Active, Away, Offline), and workload histories.
*   **Console Profile Editor**: Custom settings editor allowing modification of the administrator's name, role, and email, syncing immediately to the header layout.

---

## 🎨 Visual Identity & Style

The CRM is styled using the **Lumina Dash** design system:
*   **Theme**: Dark-mode native, utilizing a deep Slate & Navy palette (`#0e1416` and `#0f172a`) to minimize ocular strain.
*   **Elevation**: Floating frosted overlays (`rgba(30, 41, 59, 0.35)`) backed by `20px` blurs and hairline boundaries instead of harsh solid border dividers.
*   **Phosphor Accents**: Radiant glowing status pills and badges in neon cyan (Open), amber (In Progress), and emerald (Closed) representing case telemetry.

---

## 🛠️ Tech Stack

*   **Frontend**: React (Vite), Tailwind CSS v3, Material Symbols Outlined, Google Fonts (Inter, Geist).
*   **Backend**: FastAPI (Python v3+), SQLAlchemy ORM, SQLite Database, Pydantic validation.

---

## 📂 Project Structure

```text
CRM-System/
├── backend/                  # FastAPI Application
│   ├── app/
│   │   ├── main.py           # Startup & SQLite database seeding
│   │   ├── database.py       # SQLAlchemy engine & session configurations
│   │   ├── models.py         # SQLAlchemy tables (Tickets, Profiles, Teams)
│   │   ├── schemas.py        # Pydantic validation schemas
│   │   └── routes.py         # REST routers (Tickets, Admin, Analytics, Team)
│   └── requirements.txt      # Python dependencies
│
└── frontend/                 # React UI Application
    ├── src/
    │   ├── components/       # Search bars, Lists, Forms
    │   ├── pages/            # Home, Details, Analytics, Team, Settings
    │   ├── App.jsx           # Sidebar routing & profile state manager
    │   ├── index.css         # Custom animations & glass style configurations
    │   └── main.jsx          # Entry point
    └── package.json          # Node dependencies
```

---

## 📥 Setup & Installation

### 1. Prerequisites
Ensure you have Python 3.9+ and Node.js 18+ installed on your machine.

### 2. Backend Setup
1. Navigate into the backend directory:
   ```bash
   cd CRM-System/backend
   ```
2. Set up a virtual environment and install packages:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   ```
3. Run the development server:
   ```bash
   uvicorn app.main:app --reload
   ```
   *The backend will boot on `http://localhost:8000` and automatically create and seed the SQLite database file (`crm.db`).*

### 3. Frontend Setup
1. Navigate into the frontend directory:
   ```bash
   cd CRM-System/frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The React interface will run locally at `http://localhost:5173`.*
