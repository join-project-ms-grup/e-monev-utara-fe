import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import { SITE_NAME } from '../../lib/config';
import { useState } from 'react';
import { MdClose, MdKey, MdPerson } from 'react-icons/md';
import InputButton from '../../components/inputs/InputButton';
import { useAuth } from '../../contexts/AuthContext';
import api, { type ApiResponse } from '../../lib/api';
import type { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import InputText from '../../components/inputs/InputText';

export const Route = createFileRoute('/auth/')({
  beforeLoad: ({ context }) => {
    const { token } = context;
    if (token) {
      throw redirect({ to: '/' });
    }
  },
  head: () => ({
    meta: [
      {
        title: `Autentikasi - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Autentikasi',
  },
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showLogin, setShowLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/config/auth/login', { username, password });
      return res.data.data;
    },
    onSuccess: (data) => {
      login({
        token: data.token,
        user: {
          nama: data.nama,
          roleId: data.roleId,
          roleName: data.roleName,
          opdId: data.opdId,
          username: data.username,
        },
      });
      navigate({ to: '/', replace: true });
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      if (error.status === 400) {
        toast.error(`Autentikasi gagal\n${error.response?.data.message}`);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <div
      className='relative flex items-center justify-center h-screen overflow-hidden'
      style={{
        backgroundImage: "url('/auth/bg-full.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* === SEMUA BACKGROUND TERMASUK HEADER DIBUNGKUS DI SINI === */}
      <div
        className={`absolute inset-0 transition-all duration-500 ${
          showLogin ? 'backdrop-blur-md scale-100' : 'backdrop-blur-0 scale-100'
        }`}
      >
        {/* HEADER */}
        <div className='fixed top-0 bg-gradient-to-l px-5 from-red-700 to-red-700 w-full h-[80px] inline-flex items-center justify-between shadow-xl'>
          <div className='absolute top-0 left-0 w-full overflow-hidden leading-0 z-0'>
            <svg
              className='relative block w-full h-[50px]'
              data-name='Layer 1'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 1200 120'
              preserveAspectRatio='none'
            >
              <path
                d='M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z'
                opacity='.25'
                className='fill-red-600 shadow'
              ></path>
              <path
                d='M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z'
                opacity='.5'
                className='fill-red-600 shadow'
              ></path>
              <path
                d='M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z'
                className='fill-red-600 shadow'
              ></path>
            </svg>
          </div>

          <div className='inline-flex gap-2 items-center z-10'>
            <div>
              <img src='/bengkulu-utara-logo.webp' width={42} alt='' />
            </div>
            <div>
              <img src='/mahabbah.png' width={250} alt='' className='mb-2' />
            </div>
          </div>

          <button
            className={`z-10 h-[40px] shadow bg-gray-100 text-[var(--text-1)] font-bold active:scale-80
              px-6 py-2 rounded-md hover:bg-red-400 hover:text-[var(--text-3)] transition-all duration-300`}
            onClick={() => setShowLogin(!showLogin)}
          >
            Login
          </button>
        </div>
      </div>

      {/* === LOGIN CONTAINER (TIDAK IKUT BLUR) === */}
      <div
        className={`relative bg-white/90 shadow-lg rounded-lg w-full max-w-md p-8 z-10
          transform transition-all duration-300 ease-out
          ${showLogin ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}
      >
        <button
          className='absolute top-4 right-4 text-gray-600 hover:text-gray-800 active:scale-80 transition'
          onClick={() => setShowLogin(false)}
        >
          <MdClose size={24} />
        </button>

        <div className='w-full flex flex-col justify-center items-center'>
          <div className='mb-6'>
            <img src='/mahabbah.png' alt='MAHABBAH LOGO' width={300} />
          </div>
          <p className='uppercase font-bold text-center mb-6 text-gray-700 font-sm'>
            <span className='text-red-600 text-xl'>M</span>onitoring,{' '}
            <span className='text-red-600 text-xl'>A</span>nalisis{' '}
            <span className='text-red-600 text-xl'>Ha</span>sil Pem
            <span className='text-red-600 text-xl'>b</span>angunan Daer
            <span className='text-red-600 text-xl'>ah</span>
          </p>
          <form onSubmit={handleSubmit} className='space-y-4 w-full'>
            <InputText
              placeholder='Username'
              name='username'
              Icon={MdPerson}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type='text'
              required
            />
            <InputText
              placeholder='Password'
              name='password'
              Icon={MdKey}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type='password'
              required
            />
            <InputButton
              type='submit'
              disabled={mutation.isPending}
              isLoading={mutation.isPending}
              className='w-full'
            >
              Masuk
            </InputButton>
          </form>
          <p className='mt-4 text-center text-gray-600 text-sm'>
            Belum punya akun?{' '}
            <a href='#' className='text-[#E63946]'>
              Hubungi admin
            </a>
          </p>
        </div>

        <div className='mt-6 text-center opacity-50 text-xs'>
          <p>BAPPERIDA</p>
          <p>&copy; 2025 Kabupaten Bengkulu Utara</p>
        </div>
      </div>
    </div>
  );
}
