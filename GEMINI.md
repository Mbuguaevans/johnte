# FarmHub: Agricultural Land Marketplace & Investment Platform

FarmHub is a full-stack platform designed to connect landowners with farmers in Kenya. It facilitates land leasing, bidding on agricultural parcels, and agritech investment management.

---

## 🎯 Core Mandates

> [!IMPORTANT]
> These instructions take absolute precedence over general defaults.

1.  **API Consistency**: All frontend-backend communication **MUST** go through `src/api.js`. Direct use of `axios` or `fetch` in components is forbidden.
2.  **Authentication**: Use JWT via `rest_framework_simplejwt`. Use `authHeaders()` in `api.js` for all protected requests.
3.  **State & Storage**: Use React Hooks for local state. **Use `sessionStorage`** instead of `localStorage` to allow multiple independent user sessions in different tabs.
4.  **Styling**: Use Bootstrap for layout and modular CSS. Follow the `Sora` and `Cormorant Garamond` typography guidelines.
5.  **Backend Logic**: Follow PEP 8. Use `@api_view` for simplicity. Ensure `status` field in `Land` model is handled correctly (Available -> Pending -> Leased).
6.  **Security**: Never commit `.env` files or hardcoded credentials. Protect the `venv` and `node_modules`.

---

## 🏗️ Architecture & Tech Stack

### Backend (Django)
- **Framework**: Django REST Framework (DRF)
- **Database**: SQLite (Dev) / PostgreSQL (Prod ready)
- **Auth**: JWT (SimpleJWT)
- **Features**: M-Pesa STK Push integration, Email notifications for auction winners, Multi-image support.

### Frontend (React)
- **Framework**: React 18+ (SPA)
- **Navigation**: React Router v6
- **UI**: Bootstrap 5 + Custom CSS (Sora font)
- **Maps**: React-Leaflet for land location visualization and coordinate selection.

---

## 🚀 Building and Running

### Backend Setup
1. **Navigate & Virtual Env**:
   ```bash
   cd Farmhub-backend
   python -m venv venv
   .\venv\Scripts\activate  # Windows
   ```
2. **Install Dependencies**:
   ```bash
   pip install django djangorestframework django-cors-headers djangorestframework-simplejwt pillow requests
   ```
3. **Database & Server**:
   ```bash
   python manage.py migrate
   python manage.py runserver
   ```

### Frontend Setup
1. **Navigate & Install**:
   ```bash
   cd farmhub
   npm install
   ```
2. **Start Dev Server**:
   ```bash
   npm start
   ```

---

## 🗺️ Directory Structure

- `Farmhub-backend/`:
  - `accounts/`: Custom user models and JWT registration/login.
  - `api/`: Land, Bid, and Payment logic.
- `farmhub/`:
  - `src/api.js`: Centralized service for all API calls.
  - `src/Components/`: Navbar, Hero, Section3, Section4 (Auth).
  - `src/Pages/`: LandingPage, Listings (Marketplace), LandDetail, AddLand, AgriTech, etc.

---

## 📝 Roadmap & Status

### 🟢 Completed
- [x] **Base API**: Listings, Bidding, and Profiles.
- [x] **Auth System**: JWT Registration/Login.
- [x] **Marketplace Filters**: Advanced filters for County, Minimum Acres (1-200+), and Amenities (Water, Power, Irrigation, Fenced).
- [x] **Bidding Logic**: Real-time timer, bidding engine with "Outbid" status updates.
- [x] **Winner System**: Non-dismissible payment modal for auction winners using ID-based detection.
- [x] **Independent Tabs**: Migration from `localStorage` to `sessionStorage`.
- [x] **Image Uploads**: Multi-image support for land listings.
- [x] **Dashboard Development**: Replaced stubs with real statistics, recent bids, and user-specific activity.
- [x] **M-Pesa Flow**: Finalized callback handling to mark payments as completed and land as leased.
- [x] **Email Templates**: Professional HTML formatting for the `send_winner_email` function.

### 🟡 In Progress / Pending
- [ ] **Search & Filter**: Enhance the keyword search to include county-specific geolocation.
- [ ] **Mobile Optimization**: Ongoing refinement of touch interactions across all forms.

---

## 🛠️ Engineering Standards
- **DRY**: Logic shared between views should live in `api/utils.py` or model methods.
- **Winner Protection**: Winners must fulfill payment before accessing other site features for that land.
- **Navbar Organization**: 
    - Keep core navigation (`Marketplace`, `About Us`) as text links in the center.
    - Action-oriented buttons (like `+ List Land`) must live in the `header-right` next to the user profile.
    - Strictly hide `+ List Land` from Farmers and Guests; it is exclusive to logged-in Landowners.
- **Validation**: Ensure `min_acres` >= 1 and `auction_ends_at` defaults to 7 days in the future.
