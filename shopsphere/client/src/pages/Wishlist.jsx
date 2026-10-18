import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import { Loading, ErrorMsg, Empty } from '../components/Status';
export default function Wishlist() {
  const { user } = useAuth();
  const { data, loading, error, reload } = useFetch('/users/me/wishlist');
  if (loading) return <Loading />; if (error) return <ErrorMsg message={error} retry={reload} />;
  const products = data.products.filter((p) => user.wishlist?.includes(p._id)); // un-hearted items disappear immediately
  if (!products.length) return <Empty>Your wishlist is empty. <Link to="/products">Browse products</Link></Empty>;
  return <div><h1>My wishlist</h1><div className="grid">{products.map((p) => <ProductCard key={p._id} product={p} />)}</div></div>;
}
