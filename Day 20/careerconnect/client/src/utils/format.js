export const formatSalary = (min, max) => {
  const f = (n) => (n >= 100000 ? `${(n / 100000).toFixed(n % 100000 ? 1 : 0)}L` : n.toLocaleString());
  if (!min && !max) return 'Not disclosed';
  return `₹${f(min || 0)} - ₹${f(max || 0)}`;
};
export const formatDate = (d) => (d ? new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '-');
