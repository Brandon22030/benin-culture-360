import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  console.log('ProtectedRoute - user:', user);
  console.log('ProtectedRoute - isLoading:', isLoading);

  if (isLoading) {
    console.log('ProtectedRoute - Loading state');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-benin-green"></div>
      </div>
    );
  }

  if (!user) {
    console.log('ProtectedRoute - No user, redirecting to home');
    return <Navigate to="/" replace />;
  }

  console.log('ProtectedRoute - Rendering protected content');
  return <>{children}</>;
}
