import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { isAuthenticated } from './utils/auth';

// Admin pages
import MainLayout from './components/Layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Customers from './pages/Customers';
import Settings from './pages/Settings';
import Login from './pages/Login';

// Store (user-facing) pages
import Home from './pages/store/Home';
import Shop from './pages/store/Shop';
import ProductDetail from './pages/store/ProductDetail';
import Cart from './pages/store/Cart';
import Checkout from './pages/store/Checkout';
import MyOrders from './pages/store/MyOrders';
import OrderDetail from './pages/store/OrderDetail';
import StoreLogin from './pages/store/StoreLogin';
import AccountProfile from './pages/store/AccountProfile';

// Protected Route for admin
const AdminRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <Routes>
              {/* ===== STORE (User-facing) Routes ===== */}
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/store-login" element={<StoreLogin />} />
              <Route path="/account/orders" element={<MyOrders />} />
              <Route path="/account/orders/:orderId" element={<OrderDetail />} />
              <Route path="/account/profile" element={<AccountProfile />} />

              {/* ===== ADMIN Routes ===== */}
              <Route path="/login" element={<Login />} />
              <Route
                path="/admin/*"
                element={
                  <AdminRoute>
                    <MainLayout>
                      <Routes>
                        <Route index element={<Dashboard />} />
                        <Route path="categories" element={<Categories />} />
                        <Route path="products" element={<Products />} />
                        <Route path="orders" element={<Orders />} />
                        <Route path="customers" element={<Customers />} />
                        <Route path="settings" element={<Settings />} />
                      </Routes>
                    </MainLayout>
                  </AdminRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
