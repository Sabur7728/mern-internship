import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './layouts/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useAuth, homeFor } from './context/AuthContext.jsx';
import Home from './pages/Home.jsx';
import Restaurants from './pages/Restaurants.jsx';
import RestaurantDetails from './pages/RestaurantDetails.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import Orders from './pages/Orders.jsx';
import OrderDetails from './pages/OrderDetails.jsx';
import Profile from './pages/Profile.jsx';
import { Login, Register } from './pages/Auth.jsx';
import RDashboard from './pages/restaurant/RDashboard.jsx';
import RMenu from './pages/restaurant/RMenu.jsx';
import ROrders from './pages/restaurant/ROrders.jsx';
import RProfile from './pages/restaurant/RProfile.jsx';
import ADashboard from './pages/admin/ADashboard.jsx';
import ARestaurants from './pages/admin/ARestaurants.jsx';
import AUsers from './pages/admin/AUsers.jsx';
import AOrders from './pages/admin/AOrders.jsx';

function Landing() { // restaurant/admin users land on their own dashboard
  const { user } = useAuth();
  return user && user.role !== 'customer' ? <Navigate to={homeFor(user)} replace /> : <Home />;
}
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/restaurants" element={<Restaurants />} />
        <Route path="/restaurants/:id" element={<RestaurantDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route element={<ProtectedRoute roles={['customer']} />}>
          <Route path="/dashboard" element={<Navigate to="/orders" replace />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
        </Route>
        <Route element={<ProtectedRoute roles={['restaurant']} />}>
          <Route path="/restaurant/dashboard" element={<RDashboard />} />
          <Route path="/restaurant/menu" element={<RMenu />} />
          <Route path="/restaurant/orders" element={<ROrders />} />
          <Route path="/restaurant/profile" element={<RProfile />} />
        </Route>
        <Route element={<ProtectedRoute roles={['admin']} />}>
          <Route path="/admin/dashboard" element={<ADashboard />} />
          <Route path="/admin/restaurants" element={<ARestaurants />} />
          <Route path="/admin/users" element={<AUsers />} />
          <Route path="/admin/orders" element={<AOrders />} />
        </Route>
        <Route path="*" element={<div className="state"><p>Page not found.</p></div>} />
      </Route>
    </Routes>
  );
}
