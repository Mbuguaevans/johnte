# FarmHub: Agricultural Land Marketplace & Investment Platform

FarmHub is a full-stack platform designed to connect landowners with farmers in Kenya. It facilitates land leasing, bidding on agricultural parcels, and agritech investment management.

## Project Overview

### Architecture
- **Backend**: Django REST Framework (DRF) providing a JSON API.
- **Frontend**: React (SPA) using React Router for navigation and Bootstrap for styling.
- **Database**: SQLite (local development).
- **Authentication**: JWT (JSON Web Tokens) via `rest_framework_simplejwt`.

### Key Features
- **User Roles**: Specialized accounts for `landowner` and `farmer`.
- **Land Marketplace**: Searchable listings with filtering by county and amenities.
- **Bidding System**: Real-time bidding logic (Leading/Outbid status).
- **Profile Management**: User profiles with photo upload support.
- **Payments**: Transaction tracking with M-Pesa reference support.

---

## Building and Running

### Prerequisites
- Python 3.10+
- Node.js & npm
- Virtual Environment (venv)

### Backend (Django)
1. **Navigate to backend directory**:
   ```bash
   cd Farmhub-backend
   ```
2. **Activate Virtual Environment**:
   - Windows: `.\venv\Scripts\activate`
   - Linux/Mac: `source venv/bin/activate`
3. **Install Dependencies**:
   *(Note: No requirements.txt found, common dependencies include:)*
   ```bash
   pip install django djangorestframework django-cors-headers djangorestframework-simplejwt pillow
   ```
4. **Run Migrations**:
   ```bash
   python manage.py migrate
   ```
5. **Start Server**:
   ```bash
   python manage.py runserver
   ```
   *The API will be available at `http://localhost:8000/api`*

### Frontend (React)
1. **Navigate to frontend directory**:
   ```bash
   cd farmhub
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Start Development Server**:
   ```bash
   npm start
   ```
   *The app will be available at `http://localhost:3000`*

---

## Development Conventions

### Coding Style
- **Backend**: Follow PEP 8. Use Class-based views for complex logic and Function-based views with `@api_view` for simpler endpoints.
- **Frontend**: Functional components with Hooks. Keep CSS modularized (e.g., `listing.css` for `listing.js`).
- **API Helpers**: All backend communication should ideally go through `src/api.js` to ensure consistent header management and token handling.

### Pending Tasks & Roadmap
- [ ] **API Integration**: Replace mock data in `listing.js` and `LandDetail.js` with calls to `listingsAPI` and `bidsAPI`.
- [ ] **Dashboard Development**: Build the `Dashboard.js` component using `summaryAPI`.
- [ ] **Frontend Cleanup**: Standardize on `fetch` via `api.js` instead of direct `axios` calls in `AuthForm.js`.
- [ ] **M-Pesa Integration**: Implement STK Push logic in the backend payment views.

---

## Directory Structure
- `Farmhub-backend/`: Django project root.
  - `accounts/`: User model, registration, and profile logic.
  - `api/`: Land listings, bidding, and payment logic.
  - `farmhub_backend/`: Main settings and URL routing.
- `farmhub/`: React project root.
  - `src/Components/`: Reusable UI elements (Navbar, Footer, etc.).
  - `src/Pages/`: Top-level route components.
  - `src/api.js`: Centralized API service.
