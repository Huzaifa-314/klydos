import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedAdminRoute from './components/admin/ProtectedAdminRoute';
import Homepage from './pages/Homepage';
import Campaigns from './pages/Campaigns';
import CampaignDetails from './pages/CampaignDetails';
import Checkout from './pages/Checkout';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import CampaignsManagement from './pages/admin/CampaignsManagement';
import CreateEditCampaign from './pages/admin/CreateEditCampaign';
import DonationsManagement from './pages/admin/DonationsManagement';
import UsersManagement from './pages/admin/UsersManagement';
import UserDetails from './pages/admin/UserDetails';
import PaymentsGateway from './pages/admin/PaymentsGateway';
import RefundsChargebacks from './pages/admin/RefundsChargebacks';
import Monitoring from './pages/admin/Monitoring';
import AuditLogs from './pages/admin/AuditLogs';
import Notifications from './pages/admin/Notifications';
import Settings from './pages/admin/Settings';
import Support from './pages/admin/Support';
import Reports from './pages/admin/Reports';
import RolesAccess from './pages/admin/RolesAccess';
import './App.css';

function App() {
  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Homepage />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/campaigns/:id" element={<CampaignDetails />} />
            <Route path="/campaigns/:id/checkout" element={<Checkout />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminDashboard />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/campaigns"
              element={
                <ProtectedAdminRoute>
                  <CampaignsManagement />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/campaigns/create"
              element={
                <ProtectedAdminRoute>
                  <CreateEditCampaign />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/campaigns/:id/edit"
              element={
                <ProtectedAdminRoute>
                  <CreateEditCampaign />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/donations"
              element={
                <ProtectedAdminRoute>
                  <DonationsManagement />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedAdminRoute>
                  <UsersManagement />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/users/:id"
              element={
                <ProtectedAdminRoute>
                  <UserDetails />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/payments"
              element={
                <ProtectedAdminRoute>
                  <PaymentsGateway />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/refunds"
              element={
                <ProtectedAdminRoute>
                  <RefundsChargebacks />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/monitoring"
              element={
                <ProtectedAdminRoute>
                  <Monitoring />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/audit-logs"
              element={
                <ProtectedAdminRoute>
                  <AuditLogs />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/notifications"
              element={
                <ProtectedAdminRoute>
                  <Notifications />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedAdminRoute>
                  <Settings />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/support"
              element={
                <ProtectedAdminRoute>
                  <Support />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <ProtectedAdminRoute>
                  <Reports />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/roles"
              element={
                <ProtectedAdminRoute>
                  <RolesAccess />
                </ProtectedAdminRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App
