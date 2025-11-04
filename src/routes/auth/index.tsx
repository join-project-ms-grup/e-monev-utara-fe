import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import { SITE_NAME } from '../../lib/config';
import { useState } from 'react';
import { MdKey, MdPerson } from 'react-icons/md';
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
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/auth/login', { username, password });
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
    <div className='flex items-center justify-center h-screen authbg'>
      <div className='bg-white shadow-lg rounded-lg w-full max-w-6xl min-h-3/5 flex flex-col md:flex-row overflow-hidden'>
        <div className='relative w-full bg-[#721027] text-white flex flex-col justify-center items-center p-8 overflow-hidden'>
          <img
            src='/auth/bg-auth2.jpg'
            alt=''
            className='w-full h-full object-cover object-top absolute z-0'
          />
          {/* <div className='flex flex-row items-center gap-4 absolute left-4 top-4 cursor-default rounded-xl px-4 py-2'>
            <div>
              <img src='/bengkulu-utara-logo.webp' alt='' className='h-16 mt-4' />
            </div>
            <div>
              <div className='w-72'>
                <img src='/mahabbah.png' alt='MAHABBAH LOGO' />
              </div>
              <p className='uppercase font-bold text-red-800'>
                <span className='text-red-600'>M</span>onitoring,{' '}
                <span className='text-red-600'>A</span>nalisis{' '}
                <span className='text-red-600'>Ha</span>sil Pem
                <span className='text-red-600'>b</span>angunan Daer<span className='text-red-600'>ah</span>
              </p>
            </div>
          </div> */}
        </div>
        <div className='w-full md:w-2/3 flex flex-col justify-center items-center p-8'>
          <div className='h-4/5 max-w-md w-full mx-auto flex flex-col justify-center items-center p-8'>
            <div className='w-72'>
              <img src='/mahabbah.png' alt='MAHABBAH LOGO' />
            </div>
            <p className='uppercase font-bold text-red-800 text-center mb-5'>
              <span className='text-red-600'>M</span>onitoring,{' '}
              <span className='text-red-600'>A</span>nalisis{' '}
              <span className='text-red-600'>Ha</span>sil Pem
              <span className='text-red-600'>b</span>angunan Daer
              <span className='text-red-600'>ah</span>
            </p>
            {/* <h2 className='text-2xl font-bold text-center text-gray-800 mb-6 uppercase'>
              Masuk
            </h2> */}
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
            <p className='mt-4 text-center text-gray-600'>
              Belum punya akun?{' '}
              <a href='#' className='text-[#E63946]'>
                Hubungi admin
              </a>
            </p>
          </div>
          {/* <div className='inline-flex gap-2'>
            <button
              className='text-red-200 hover:text-red-100 transition-all'
              onClick={() => {
                setUsername('admin');
                setPassword('admin123');
              }}
            >
              Developer
            </button>
            <button
              className='text-red-200 hover:text-red-100 transition-all'
              onClick={() => {
                setUsername('admin2');
                setPassword('admin123');
              }}
            >
              Admin2
            </button>
            <button
              className='text-red-200 hover:text-red-100 transition-all'
              onClick={() => {
                setUsername('rkpd');
                setPassword('rkpd123');
              }}
            >
              RKPD
            </button>
            <button
              className='text-red-200 hover:text-red-100 transition-all'
              onClick={() => {
                setUsername('dak');
                setPassword('dak123');
              }}
            >
              DAK
            </button>
          </div> */}
          <div className='h-1/5 text-center w-full flex flex-col items-center justify-center opacity-50 text-[0.9rem]'>
            <p>BAPPERIDA</p>
            <p>&copy; 2025 Kabupaten Bengkulu Utara</p>
          </div>
        </div>
      </div>
    </div>
  );
}
