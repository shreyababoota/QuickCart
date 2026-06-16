import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from './components/ui/sonner'
import ShopLayout from './layouts/ShopLayout'
import AuthLayout from './layouts/AuthLayout'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Orders from './pages/Orders'
import Profile from './pages/Profile'
import Assistant from './pages/Assistant'
import Plans from './pages/Plans'
import PlanDetail from './pages/PlanDetail'
import Wishlist from './pages/Wishlist'
import Login from './pages/Login'
import Signup from './pages/Signup'
import AdminDashboard from './pages/Admin/Dashboard'
import AdminOrders from './pages/Admin/Orders'
import AdminInventory from './pages/Admin/Inventory'
import AdminCustomers from './pages/Admin/Customers'
import AdminSustainability from './pages/Admin/Sustainability'
import NotFound from './pages/NotFound'

function App() {
  return (
    <>
      <Routes>
        {/* Shop Routes */}
        <Route element={<ShopLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/assistant" element={<Assistant />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/plans/:planId" element={<PlanDetail />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/dashboard" element={<Navigate to="/" replace />} />
          <Route path="/recommend" element={<Navigate to="/assistant" replace />} />
        </Route>

        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/inventory" element={<AdminInventory />} />
        <Route path="/admin/customers" element={<AdminCustomers />} />
        <Route path="/admin/sustainability" element={<AdminSustainability />} />

        {/* 404 */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>

      <Toaster />
    </>
  )
}

export default App
