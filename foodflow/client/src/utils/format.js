export const inr = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');
export const dt = (d) => new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
export const STEPS = ['Placed', 'Confirmed', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered'];
export const NEXT = { Placed: 'Confirmed', Confirmed: 'Preparing', Preparing: 'Ready', Ready: 'Out for Delivery', 'Out for Delivery': 'Delivered' };
export const CUISINES = ['Indian', 'Chinese', 'Italian', 'South Indian', 'Fast Food', 'Bakery', 'Mexican', 'Biryani'];
// Estimate only - backend is the source of truth for the final discount
export const discountFor = (code, subtotal) => (String(code || '').toUpperCase() === 'FOOD10' ? Math.min(Math.round(subtotal * 0.1), 100) : 0);
export const fallbackImg = (e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="600" height="400" fill="#E9E1F5"/><text x="300" y="215" font-size="80" text-anchor="middle">🍽️</text></svg>'); };
