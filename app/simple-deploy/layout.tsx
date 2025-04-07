import ProtectedRoute from "../components/ProtectedRoute";

export default function SimpleDeployLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
} 