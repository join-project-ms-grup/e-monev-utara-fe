import { RouterProvider } from '@tanstack/react-router';
import router from './router';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient()

function RouterWithAuth() {
  const { token, user } = useAuth();
  console.log({token},user)

  return <RouterProvider router={router} context={{ token }} />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterWithAuth />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
