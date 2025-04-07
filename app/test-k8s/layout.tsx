import ProtectedRoute from "../components/ProtectedRoute";

export default function TestK8sLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
} 