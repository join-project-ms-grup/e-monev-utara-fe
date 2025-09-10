import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect, useState } from 'react';

export const Route = createFileRoute('/auth/logout')({
  beforeLoad: ({ context }) => {
    const { token } = context;
    if (!token) {
      throw redirect({ to: '/auth' });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isLogout, setIsLogout] = useState(false);

  useEffect(() => {
    if (!isLogout) {
      logout();
      navigate({ to: '/auth' });
      setIsLogout(true);
    }
  }, [logout, navigate]);

  return (
    <>
      <span>Logout...</span>
    </>
  );
}
