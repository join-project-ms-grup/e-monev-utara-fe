import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import { SITE_NAME } from '../../lib/config';
import { useState } from 'react';
import InputText from '../../components/inputs/InputText';
import { MdKey, MdPerson } from 'react-icons/md';
import InputButton from '../../components/inputs/InputButton';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../lib/api';

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
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');

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
      navigate({ to: '/' });
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
            src='/auth/bglogin.jpg'
            alt=''
            className='w-full h-full object-cover object-[60%_center] absolute z-0'
          />
          <div className='flex flex-row items-center gap-2 absolute left-4 top-4 cursor-default bg-[#0000001e] rounded-xl px-4 py-2'>
            <div>
              <img src='/bengkulu-utara-logo.webp' alt='' className='h-16' />
            </div>
            <div>
              <h1 className='text-4xl font-bold mb-4 z-10'>E-MONEV</h1>
              <p className='uppercase font-semibold -mt-4'>
                Kabupaten Bengkulu Utara
              </p>
            </div>
          </div>
        </div>
        <div className='w-full md:w-2/3 flex flex-col justify-center items-center p-8'>
          <div className='h-4/5 max-w-md w-full mx-auto flex flex-col justify-center items-center p-8'>
            <h2 className='text-2xl font-bold text-center text-gray-800 mb-6 uppercase'>
              Masuk
            </h2>
            <form onSubmit={handleSubmit} className='space-y-4 w-full'>
              <div>
                <InputText
                  label='Username'
                  name='username'
                  Icon={MdPerson}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  type='text'
                  required
                />
              </div>
              <div>
                <InputText
                  label='Password'
                  name='password'
                  Icon={MdKey}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type='password'
                  required
                />
              </div>
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
          <div className='inline-flex gap-2'>
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
          </div>
          <div className='h-1/5 text-center w-full flex flex-col items-center justify-center opacity-50 text-[0.9rem]'>
            <p>BAPPELITBANGDA</p>
            <p>&copy; 2025 Kabupaten Bengkulu Utara</p>
          </div>
        </div>
      </div>
    </div>
  );
}
