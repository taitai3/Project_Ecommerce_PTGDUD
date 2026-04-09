import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { isAuthenticated } from './utils/auth';
import MainLayout from './components/Layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Customers from './pages/Customers';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Home from './pages/customer/Home';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Customer Routes - Public */}
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Home />} /> {/* Placeholder for now */}
          <Route path="/product/:id" element={<Home />} /> {/* Placeholder for now */}
          
          {/* Admin Routes - Protected */}
          <Route path="/login" element={<Login />} />
          
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/customers" element={<Customers />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </MainLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;