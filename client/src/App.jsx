import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import BulldogRail from './components/layout/BulldogRail';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Discover from './pages/customer/Discover';
import Search from './pages/customer/Search';
import RestaurantDetail from './pages/customer/RestaurantDetail';
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';
import OrderConfirmation from './pages/customer/OrderConfirmation';
import LiveTracking from './pages/customer/LiveTracking';
import OrderHistory from './pages/customer/OrderHistory';
import Receipt from './pages/customer/Receipt';
import Profile from './pages/customer/Profile';
import ExpoRailDashboard from './pages/restaurant/ExpoRailDashboard';
import MenuManagement from './pages/restaurant/MenuManagement';
import RestaurantAnalytics from './pages/restaurant/RestaurantAnalytics';

function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <BulldogRail />
      <main className="flex-grow">{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Customer Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute allowedRoles={['customer', 'restaurant']}>
                  <MainLayout>
                    <Discover />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/search"
              element={
                <ProtectedRoute allowedRoles={['customer', 'restaurant']}>
                  <MainLayout>
                    <Search />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/restaurant/:id"
              element={
                <ProtectedRoute allowedRoles={['customer', 'restaurant']}>
                  <MainLayout>
                    <RestaurantDetail />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <ProtectedRoute allowedRoles={['customer', 'restaurant']}>
                  <MainLayout>
                    <Cart />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute allowedRoles={['customer', 'restaurant']}>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order/:id/confirmation"
              element={
                <ProtectedRoute allowedRoles={['customer', 'restaurant']}>
                  <OrderConfirmation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order/:id/track"
              element={
                <ProtectedRoute allowedRoles={['customer', 'restaurant']}>
                  <LiveTracking />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute allowedRoles={['customer', 'restaurant']}>
                  <MainLayout>
                    <OrderHistory />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders/:id/receipt"
              element={
                <ProtectedRoute allowedRoles={['customer', 'restaurant']}>
                  <MainLayout>
                    <Receipt />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={['customer', 'restaurant']}>
                  <MainLayout>
                    <Profile />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* Restaurant Partner Routes */}
            <Route
              path="/restaurant/orders"
              element={
                <ProtectedRoute allowedRoles={['restaurant']}>
                  <ExpoRailDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/restaurant/menu"
              element={
                <ProtectedRoute allowedRoles={['restaurant']}>
                  <MenuManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/restaurant/analytics"
              element={
                <ProtectedRoute allowedRoles={['restaurant']}>
                  <RestaurantAnalytics />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
