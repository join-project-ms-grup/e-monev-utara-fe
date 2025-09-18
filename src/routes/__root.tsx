import {
  HeadContent,
  Outlet,
  createRootRouteWithContext,
} from '@tanstack/react-router';
import toast, { ToastBar, Toaster } from 'react-hot-toast';
import { MdClose } from 'react-icons/md';
import { Tooltip } from 'react-tooltip';

interface AuthType {
  token: string | null;
}

export const Route = createRootRouteWithContext<AuthType>()({
  component: RootComponent,
});

const ToastComponent = () => {
  return (
    <Toaster
      position='top-right'
      toastOptions={{
        duration: 5000000,
      }}
    >
      {(t) => (
        <ToastBar toast={t}>
          {({ icon, message }) => (
            <>
              {icon}
              {message}
              {t.type !== 'loading' && (
                <>
                  <button
                    className='text-red-400 transition-all hover:text-red-300 active:scale-90'
                    onClick={() => toast.dismiss(t.id)}
                  >
                    <MdClose />
                  </button>
                </>
              )}
            </>
          )}
        </ToastBar>
      )}
    </Toaster>
  );
};

function RootComponent() {
  return (
    <>
      <HeadContent />
      <Outlet />
      <Tooltip id='tooltip' />
      <ToastComponent />
    </>
  );
}
