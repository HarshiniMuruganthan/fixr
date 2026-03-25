import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { ProtectedRoute, RoleRoute } from './routes/ProtectedRoute'
import DashboardLayout from './layouts/DashboardLayout'
import ErrorBoundary from './components/ErrorBoundary'

import LandingPage           from './pages/common/LandingPage'
import LoginPage             from './pages/common/LoginPage'
import RegisterPage          from './pages/common/RegisterPage'
import NotFoundPage          from './pages/common/NotFoundPage'
import DashboardPage         from './pages/common/DashboardPage'
import ChatPage              from './pages/common/ChatPage'
import ProfilePage           from './pages/common/ProfilePage'
import TechnicianProfilePage from './pages/common/TechnicianProfilePage'

import PostRepairPage        from './pages/user/PostRepairPage'
import MyRequestsPage        from './pages/user/MyRequestsPage'
import RequestDetailPage     from './pages/user/RequestDetailPage'
import BrowseTechniciansPage from './pages/user/BrowseTechniciansPage'

import BrowseRequestsPage   from './pages/technician/BrowseRequestsPage'
import TechRepairDetailPage from './pages/technician/TechRepairDetailPage'
import MyBidsPage           from './pages/technician/MyBidsPage'
import MyJobsPage           from './pages/technician/MyJobsPage'
import JobDetailPage        from './pages/technician/JobDetailPage'
import ReviewsReceivedPage  from './pages/technician/ReviewsReceivedPage'

import AdminDashboard   from './pages/admin/AdminDashboard'
import AdminUsersPage   from './pages/admin/AdminUsersPage'
import AdminRepairsPage from './pages/admin/AdminRepairsPage'
import AdminReportsPage from './pages/admin/AdminReportsPage'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ErrorBoundary>
            <Routes>
              <Route path="/"         element={<LandingPage />} />
              <Route path="/login"    element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/dashboard"       element={<DashboardPage />} />
                  <Route path="/chat"            element={<ChatPage />} />
                  <Route path="/profile"         element={<ProfilePage />} />
                  <Route path="/technicians/:id" element={<TechnicianProfilePage />} />

                  <Route element={<RoleRoute roles={['user']} />}>
                    <Route path="/post-repair"     element={<PostRepairPage />} />
                    <Route path="/my-requests"     element={<MyRequestsPage />} />
                    <Route path="/my-requests/:id" element={<RequestDetailPage />} />
                    <Route path="/technicians"     element={<BrowseTechniciansPage />} />
                  </Route>

                  <Route element={<RoleRoute roles={['technician']} />}>
                    <Route path="/browse"      element={<BrowseRequestsPage />} />
                    <Route path="/browse/:id"  element={<TechRepairDetailPage />} />
                    <Route path="/my-bids"     element={<MyBidsPage />} />
                    <Route path="/my-jobs"     element={<MyJobsPage />} />
                    <Route path="/my-jobs/:id" element={<JobDetailPage />} />
                    <Route path="/my-reviews"  element={<ReviewsReceivedPage />} />
                  </Route>
                </Route>
              </Route>

              <Route element={<RoleRoute roles={['admin']} />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/admin"         element={<AdminDashboard />} />
                  <Route path="/admin/users"   element={<AdminUsersPage />} />
                  <Route path="/admin/repairs" element={<AdminRepairsPage />} />
                  <Route path="/admin/reports" element={<AdminReportsPage />} />
                  <Route path="/chat"          element={<ChatPage />} />
                  <Route path="/profile"       element={<ProfilePage />} />
                </Route>
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </ErrorBoundary>
        </BrowserRouter>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '13px',
              borderRadius: '12px',
              padding: '12px 16px',
            },
            success: {
              iconTheme: { primary: '#14b8a6', secondary: '#fff' },
              style: { background: '#f0fdf9', border: '1px solid #99f6e0', color: '#134e4a' },
            },
            error: {
              style: { background: '#fef2f2', border: '1px solid #fecaca', color: '#7f1d1d' },
            },
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  )
}
