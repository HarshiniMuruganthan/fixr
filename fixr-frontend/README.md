# Fixr — Repair Marketplace Frontend

Premium React frontend for the Fixr Repair Marketplace platform.

## Stack
- **React 18** + **Vite**
- **Tailwind CSS** (Syne + DM Sans fonts, teal brand palette, dark/light themes)
- **React Router v6** (role-based protected routes)
- **Axios** with JWT interceptors
- **Socket.IO Client** (real-time chat)
- **react-hot-toast** (notifications)

---

## Quick Start

### 1. Install dependencies
```bash
cd fixr-frontend
npm install
```

### 2. Configure environment
The `.env` file is pre-configured for local development:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```
Change these if your backend runs on a different host/port.

### 3. Start your backend
```bash
cd ../backend
npm start
```
Backend must be running at `http://localhost:5000`.

### 4. Run the frontend
```bash
npm run dev
```
Opens at `http://localhost:3000`

---

## Project Structure

```
src/
├── api/              # Axios service layer (one file per resource)
│   ├── axios.js      # Base instance + JWT interceptors
│   ├── auth.js
│   ├── repairs.js
│   ├── bids.js
│   ├── technicians.js
│   ├── reviews.js
│   ├── messages.js
│   └── admin.js
├── components/
│   ├── ui/           # Reusable primitives (Modal, Avatar, Skeleton, Badge…)
│   └── Sidebar.jsx   # Role-aware navigation sidebar
├── context/
│   ├── AuthContext.jsx   # JWT auth state, login/register/logout
│   └── ThemeContext.jsx  # Dark/light theme toggle
├── layouts/
│   └── DashboardLayout.jsx  # Sidebar + responsive mobile topbar
├── pages/
│   ├── common/       # Landing, Login, Register, Chat, Profile, 404
│   ├── user/         # Dashboard, PostRepair, MyRequests, RequestDetail
│   ├── technician/   # Dashboard, Browse, BidDetail, MyBids, MyJobs
│   └── admin/        # Dashboard, Users, Repairs, Reports
├── routes/
│   └── ProtectedRoute.jsx  # Auth guard + role guard
├── utils/
│   ├── helpers.js    # formatDate, formatCurrency, timeAgo, statusConfig
│   └── socket.js     # Socket.IO singleton
└── App.jsx           # Root router with all routes
```

---

## API Integration Map

| Page | API Calls |
|------|-----------|
| Login | `POST /api/auth/login` |
| Register | `POST /api/auth/register` |
| User Dashboard | `GET /api/repairs/my` |
| Post Repair | `POST /api/repairs` |
| My Requests | `GET /api/repairs/my` |
| Request Detail | `GET /api/repairs/my` + `GET /api/bids/:id` |
| Accept Bid | `PUT /api/bids/:id/accept` |
| Leave Review | `POST /api/reviews` |
| Browse (tech) | `GET /api/repairs` |
| Place Bid | `POST /api/bids` |
| My Bids | `GET /api/repairs` + `GET /api/bids/:id` per repair |
| My Jobs | `GET /api/repairs/assigned` |
| Complete Job | `PUT /api/repairs/:id/complete` |
| Chat | `GET /api/messages/:receiverId` + Socket.IO |
| Admin Users | `GET /api/admin/users`, `DELETE /api/admin/users/:id` |
| Admin Repairs | `GET /api/admin/repairs` |

---

## Auth Flow

1. User registers/logs in → backend returns `{ _id, name, email, role, token }`
2. Stored in `localStorage` as `fixr_user`
3. Every Axios request auto-attaches `Authorization: Bearer <token>`
4. On 401, user is auto-logged-out and redirected to `/login`
5. Routes are protected with `<ProtectedRoute>` and `<RoleRoute roles={[...]}>`

---

## Role-Based Routing

| Role | Dashboard | Key Routes |
|------|-----------|------------|
| `user` | `/dashboard` | `/post-repair`, `/my-requests`, `/my-requests/:id` |
| `technician` | `/dashboard` | `/browse`, `/browse/:id`, `/my-bids`, `/my-jobs` |
| `admin` | `/admin` | `/admin/users`, `/admin/repairs`, `/admin/reports` |

---

## Real-time Chat (Socket.IO)

**Emit:**
```js
socket.emit('sendMessage', { senderId, receiverId, text })
```
**Listen:**
```js
socket.on('receiveMessage', (data) => { ... })
```
Messages are persisted to MongoDB by the backend on every `sendMessage` event.
Message history is loaded from `GET /api/messages/:receiverId`.

---

## Design System

- **Font**: Syne (display/headings) + DM Sans (body)
- **Primary color**: Teal (`brand-500` = `#14b8a6`)
- **Dark mode**: `class`-based, toggled per user preference
- **Components**: `.card`, `.btn-primary`, `.btn-secondary`, `.input`, `.badge-*`, `.skeleton`

---

## Build for Production

```bash
npm run build
```
Output in `dist/`. Configure `VITE_API_URL` to your production backend URL.
