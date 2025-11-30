import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Home from './pages/Home';
import AuctionDetail from './pages/AuctionDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SellerProfile from './pages/SellerProfile';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

// YENİ IMPORTLAR
import ForgotPassword from './pages/ForgotPassword';
import UpdatePassword from './pages/UpdatePassword';

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} toastOptions={{ /* ...aynı... */ }} />

      <Routes>
        {/* MEVCUT ROTALARIN... */}
        <Route path="/" element={<Home />} />
        <Route path="/auction/:id" element={<AuctionDetail />} />
        <Route path="/seller/:id" element={<SellerProfile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* YENİ EKLENEN ROTALAR */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/update-password" element={<UpdatePassword />} />

        {/* KORUMALI ROTALAR... */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;