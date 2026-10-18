import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home'; import Products from './pages/Products'; import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart'; import Login from './pages/Login'; import Register from './pages/Register'; import Profile from './pages/Profile';
import Checkout from './pages/Checkout'; import Orders from './pages/Orders'; import OrderDetails from './pages/OrderDetails';
import Dashboard from './pages/admin/Dashboard'; import AdminProducts from './pages/admin/AdminProducts';
import AdminCustomers from './pages/admin/AdminCustomers'; import Wishlist from './pages/Wishlist';
import AdminCategories from './pages/admin/AdminCategories'; import AdminOrders from './pages/admin/AdminOrders';
const P = ({ children }) => <ProtectedRoute>{children}</ProtectedRoute>;
export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} /><Route path="products" element={<Products />} /><Route path="products/:id" element={<ProductDetails />} />
        <Route path="cart" element={<Cart />} /><Route path="login" element={<Login />} /><Route path="register" element={<Register />} />
        <Route path="profile" element={<P><Profile /></P>} /><Route path="checkout" element={<P><Checkout /></P>} />
        <Route path="wishlist" element={<P><Wishlist /></P>} /><Route path="orders" element={<P><Orders /></P>} /><Route path="orders/:id" element={<P><OrderDetails /></P>} />
        <Route path="admin" element={<ProtectedRoute admin><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} /><Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} /><Route path="orders" element={<AdminOrders />} /><Route path="customers" element={<AdminCustomers />} />
        </Route>
        <Route path="*" element={<p className="state">Page not found.</p>} />
      </Route>
    </Routes>
  );
}
