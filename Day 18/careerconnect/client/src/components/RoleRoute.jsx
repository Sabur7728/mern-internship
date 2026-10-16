import ProtectedRoute from "./ProtectedRoute";

export default function RoleRoute({ allowedRoles, children }) {
  return <ProtectedRoute allowedRoles={allowedRoles}>{children}</ProtectedRoute>;
}