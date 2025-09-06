import { createFileRoute, redirect } from '@tanstack/react-router';
import { SITE_NAME } from '../../configs/config';
import { useState } from 'react';
import InputText from '../../components/inputs/InputText';
import { MdEmail, MdKey } from 'react-icons/md';
import InputButton from '../../components/inputs/InputButton';
import { useAuth } from '../../contexts/AuthContext';

export const Route = createFileRoute('/auth/')({
  beforeLoad: ({ context }) => {
    const { token } = context.auth
    if (token) {
      throw redirect({ to: "/" })
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
})

function RouteComponent() {
  const auth = useAuth()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({ email, password });
    auth.loginDummy();
  };

  return (
    <div className="flex items-center justify-center h-screen authbg">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-6xl min-h-3/5 flex flex-col md:flex-row overflow-hidden">
        <div className="relative w-full bg-[#721027] text-white flex flex-col justify-center items-center p-8 overflow-hidden">
          <img src="/auth/bglogin.jpg" alt="" className='w-full h-full object-cover object-[60%_center] absolute z-0' />
          <div className='flex flex-row items-center gap-2 absolute left-4 top-4 cursor-default bg-[#0000001e] rounded-xl px-4 py-2'>
            <div>
              <img src="/bengkulu-utara-logo.webp" alt="" className='h-16' />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-4 z-10">E-MONEV RKPD</h1>
              <p className='uppercase font-semibold -mt-4'>Kabupaten Bengkulu Utara</p>
            </div>
          </div>
        </div>
        <div className="w-full md:w-2/3 flex flex-col justify-center items-center p-8">
          <div className="h-4/5 max-w-md w-full mx-auto flex flex-col justify-center items-center p-8">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6 uppercase">Masuk</h2>
            <form onSubmit={handleSubmit} className="space-y-4 w-full">
              <div>
                <InputText
                  label="Email"
                  Icon={MdEmail}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                />
              </div>
              <div>
                <InputText
                  label="Password"
                  Icon={MdKey}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  required
                />
              </div>
              <InputButton type='submit'>
                Masuk
              </InputButton>
            </form>
            <p className="mt-4 text-center text-gray-600">
              Belum punya akun? <a href="#" className="text-[#E63946]">Hubungi admin</a>
            </p>
          </div>
          <div className="h-1/5 text-center w-full flex flex-col items-center justify-center opacity-50 text-[0.9rem]">
            <p>BAPPELITBANGDA</p>
            <p>&copy; 2025 Kabupaten Bengkulu Utara</p>
          </div>
        </div>
      </div>
    </div>
  );
}
