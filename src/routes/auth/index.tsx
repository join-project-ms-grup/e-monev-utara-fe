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
      className='relative flex items-center justify-center h-screen overflow-y-auto'
      style={{
        backgroundImage: "url('/auth/bg-full2.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* MARK: LOGIN CONTAINER */}
      <div
        className={`relative bg-white/90 shadow-lg rounded-lg w-full max-w-md p-8 z-20
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
        </div>
      </div>
      {/* MARK: BLUR EFEK */}
      <div
        className={`absolute z-10 inset-0 backdrop-blur-sm bg-black/20 transition-opacity duration-300
    ${showLogin ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      ></div>

      <div className='absolute top-0 left-0 flex flex-col lg:flex-row w-full h-full z-0'>
        <div className='flex-1/4 py-6 px-16'>
          <div className='flex flex-col justify-start h-full'>
            {/* MARK: LOGO */}
            <div className='flex flex-col items-start mb-20'>
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
            {/* MARK: JUDUL & LOGIN BUTTON */}
            <div>
              <div className='text-white max-w-4xl leading-tight'>
                <p className='italic font-light text-[clamp(2rem,2vw,3.5rem)]'>
                  Sistem Informasi
                </p>
                <p className='font-bold text-[clamp(3rem,4vw,5rem)]'>
                  Monitoring, Analisis
                </p>
                <p className='font-bold text-[clamp(3rem,4vw,5rem)] md:whitespace-nowrap'>
                  Hasil Pembangunan Daerah
                </p>
                <p className='italic font-light text-[clamp(2rem,2vw,3.5rem)]'>
                  Kabupaten Bengkulu Utara
                </p>
              </div>
              <button
                className={`float-start mt-10 shadow bg-gray-100 text-gray-800 font-bold active:scale-100
              px-12 py-2 text-2xl rounded-xl hover:scale-105 transition-all duration-300`}
                onClick={() => setShowLogin(!showLogin)}
              >
                Login
              </button>
            </div>
          </div>
        </div>

        <div className='flex flex-1 items-center justify-center lg:items-end lg:mb-16 py-6 px-4'>
          <img
            src='/auth/bupati-wa.png'
            alt='Bupati dan wakil bupati'
            className='lg:max-w-[calc(100%-10rem)] w-full h-auto'
          />
        </div>
      </div>
    </div>
  );
}
