import { useEffect, useState } from 'react';
import { getRecent } from '../utils/recent';
import { productService } from '../services/api';
import ProductCard from './ProductCard';
export default function RecentlyViewed({ exclude }) {
  const [items, setItems] = useState([]);
  useEffect(() => {
    const ids = getRecent().filter((id) => id !== exclude);
    Promise.all(ids.map((id) => productService.get(id).then((d) => d.product).catch(() => null))).then((r) => setItems(r.filter((p) => p && p.isActive)));
  }, [exclude]);
  if (!items.length) return null;
  return <><h2>Recently viewed</h2><div className="grid">{items.map((p) => <ProductCard key={p._id} product={p} />)}</div></>;
}
