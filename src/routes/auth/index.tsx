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
  const [showLogin, setShowLogin] = useState(false);
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
          userSKPDId: data.opdId,
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
        backgroundImage: "url('/auth/bg-full2.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div>
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
        </div>
      </div>
      <div className='absolute text-black top-1/12 left-1/12 flex flex-col items-center'>
        <div>
          <img src='/mahabbah.png' width={300} alt='E-MAHABBAH LOGO' />
        </div>
        <p className='uppercase font-bold text-center mb-6 text-white text-[0.7rem]'>
          <span className='text-[0.9rem]'>M</span>onitoring,{' '}
          <span className='text-[0.9rem]'>A</span>nalisis{' '}
          <span className='text-[0.9rem]'>Ha</span>sil Pem
          <span className='text-[0.9rem]'>b</span>angunan Daer
          <span className='text-[0.9rem]'>ah</span>
        </p>
      </div>
      <div className='absolute top-1/3 left-1/12'>
      <div className='text-white max-w-4xl'>
        <p className='italic text-5xl font-light'>Sistem Informasi</p>
        <p className='text-7xl font-bold '>Monitoring, Analisis</p>
        <p className='text-7xl font-bold '>Hasil Pembangunan Daerah</p>
        <p className='italic text-5xl font-light'>Kabupaten Bengkulu Utara</p>
      </div>
        <button
          className={`float-start mt-10 shadow bg-red-700 text-gray-100 font-bold active:scale-80
              px-12 py-2 text-2xl rounded-xl hover:bg-red-600 hover:text-[var(--text-3)] transition-all duration-300`}
          onClick={() => setShowLogin(!showLogin)}
        >
          Login
        </button>
      </div>
      <div className='absolute bottom-12 right-0 '>
        <div className='md:mr-0 xl:mr-20 sm:mb-10 xl:mb-20'>
          <img
            src='/auth/bupati-wa.png'
            alt='Bupati dan wakil bupati'
            className='sm:max-w-[200px] md:max-w-[500px] xl:max-w-[500px] w-full h-auto'
          />
        </div>
      </div>
    </div>
  );
}
