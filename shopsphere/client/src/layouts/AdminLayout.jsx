import { NavLink, Outlet } from 'react-router-dom';
export default function AdminLayout() {
  return (
    <div className="admin">
      <aside><b>Admin</b>
        <NavLink end to="/admin">Dashboard</NavLink><NavLink to="/admin/products">Products</NavLink>
        <NavLink to="/admin/categories">Categories</NavLink><NavLink to="/admin/orders">Orders</NavLink><NavLink to="/admin/customers">Customers</NavLink>
      </aside>
      <section><Outlet /></section>
    </div>
  );
}
