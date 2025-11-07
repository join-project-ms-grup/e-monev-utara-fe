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
      className='relative flex items-center justify-center h-screen'
      style={{
        backgroundImage: "url('/auth/bg-full.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Tombol login hanya tampil saat kotak login tidak muncul */}
      <button
        className={`absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-all duration-300
    transform ${showLogin ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100 pointer-events-auto'}`}
        onClick={() => setShowLogin(true)}
      >
        Login
      </button>

      {/* Kotak login */}
      <div
        className={`bg-white/90 shadow-lg rounded-lg w-full max-w-md p-8 backdrop-blur-sm z-10
          transform transition-all duration-300 ease-out
          ${showLogin ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}
      >
        {/* Tombol silang di pojok kanan atas kotak login */}
        <button
          className='absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition'
          onClick={() => setShowLogin(false)}
        >
          <MdClose size={24} />
        </button>

        <div className='w-full flex flex-col justify-center items-center'>
          <div className='w-48 mb-6'>
            <img src='/mahabbah.png' alt='MAHABBAH LOGO' />
          </div>
          <p className='uppercase font-bold text-center mb-6 text-gray-700'>
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
