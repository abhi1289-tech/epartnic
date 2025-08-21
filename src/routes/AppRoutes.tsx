import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';

// Lazy load components
const Home = React.lazy(() => import('../components/Home/Home'));
const Login = React.lazy(() => import('../components/Auth/Login'));
const Register = React.lazy(() => import('../components/Auth/Register'));
const Profile = React.lazy(() => import('../components/Auth/Profile'));
const VehicleSelection = React.lazy(() => import('../components/Vehicle/VehicleSelection'));
const PartsList = React.lazy(() => import('../components/Parts/PartsList'));
const PartDetail = React.lazy(() => import('../components/Parts/PartDetail'));
const Cart = React.lazy(() => import('../components/Cart/Cart'));
const AddressBook = React.lazy(() => import('../components/Address/AddressBook'));
const AddressForm = React.lazy(() => import('../components/Address/AddressForm'));
const Checkout = React.lazy(() => import('../components/Checkout/Checkout'));
const PaymentSuccess = React.lazy(() => import('../components/Checkout/PaymentSuccess'));
const PaymentFailure = React.lazy(() => import('../components/Checkout/PaymentFailure'));
const Orders = React.lazy(() => import('../components/Orders/Orders'));
const OrderDetail = React.lazy(() => import('../components/Orders/OrderDetail'));
const PartnerDashboard = React.lazy(() => import('../components/Partner/PartnerDashboard'));
const AdminDashboard = React.lazy(() => import('../components/Admin/AdminDashboard'));

const AppRoutes: React.FC = () => {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/vehicle" element={<VehicleSelection />} />
        <Route path="/parts" element={<PartsList />} />
        <Route path="/parts/:id" element={<PartDetail />} />
        <Route path="/cart" element={<Cart />} />

        {/* Protected Routes - Require Authentication */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/addresses"
          element={
            <ProtectedRoute>
              <AddressBook />
            </ProtectedRoute>
          }
        />
        <Route
          path="/addresses/new"
          element={
            <ProtectedRoute>
              <AddressForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/addresses/edit/:id"
          element={
            <ProtectedRoute>
              <AddressForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment/success"
          element={
            <ProtectedRoute>
              <PaymentSuccess />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment/failure"
          element={
            <ProtectedRoute>
              <PaymentFailure />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute>
              <OrderDetail />
            </ProtectedRoute>
          }
        />

        {/* Partner Routes */}
        <Route
          path="/partner"
          element={
            <ProtectedRoute requireRole="partner">
              <PartnerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* 404 Route */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-deep mb-4">404</h1>
                <p className="text-gray-600 mb-8">Page not found</p>
                <a href="/" className="text-primary hover:text-primary-dark">
                  Go back home
                </a>
              </div>
            </div>
          }
        />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;