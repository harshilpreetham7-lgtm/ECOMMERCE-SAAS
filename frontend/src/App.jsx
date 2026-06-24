import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import LandingPage from './pages/LandingPage.jsx';
import Home from './pages/Home.jsx';
import Products from './pages/Products.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import VerifyEmail from './pages/VerifyEmail.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import VendorDashboard from './pages/VendorDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import './styles/globals.css';

function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="min-h-screen"
    >
      {children}
    </motion.div>
  );
}

function PrivateRoute({ children, role }) {
  const { token, user } = useSelector((state) => state.auth);

  if (!token) return <Navigate to="/login" />;
  if (role && user?.role !== role) return <Navigate to="/" />;

  return children;
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
        <Route path="/marketplace" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
        <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
        <Route path="/verify-email/:token" element={<PageTransition><VerifyEmail /></PageTransition>} />
        <Route path="/reset-password/:token" element={<PageTransition><ResetPassword /></PageTransition>} />
        <Route path="/products" element={<PageTransition><Products /></PageTransition>} />
        <Route path="/products/:id" element={<PageTransition><ProductDetail /></PageTransition>} />
        <Route path="/cart" element={<PageTransition><Cart /></PageTransition>} />

        <Route path="/checkout" element={<PrivateRoute><PageTransition><Checkout /></PageTransition></PrivateRoute>} />

        <Route path="/vendor/dashboard" element={<PrivateRoute role="vendor"><PageTransition><VendorDashboard /></PageTransition></PrivateRoute>} />
        <Route path="/admin/dashboard" element={<PrivateRoute role="superadmin"><PageTransition><AdminDashboard /></PageTransition></PrivateRoute>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
