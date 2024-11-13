"use client"; 

import supabase from '../components/SupabaseClient'; 
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import logo from '../assets/standbyputih.png';
import koran from '../assets/koran.png';
import show from '../assets/show.png';
import hide from '../assets/hide.png';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); 
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', user?.id) 
        .single();
  
      if (error) {
        setError('Error fetching profile');
      }
    };
  
    checkUser();
  }, [router]);
  
  
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      const { data: { session } } = await supabase.auth.getSession();
      document.cookie = `token=${session?.access_token}; path=/;`;
      router.push('/home');
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible); 
  };

  return (
    <div className="flex min-h-screen bg-[#991b1b] relative z-20">
      <div className="w-1/2 bg-[#991b1b] flex items-center justify-center flex-col p-8">
        <Image src={logo} alt="Logo" className="mb-4 w-32 h-32" /> 
        <h1 className="text-white text-2xl font-bold">Selamat Datang di StandBy</h1>
        <p className="text-white mt-2">Mendata hasil inkubator sesuai standarisasi & dokumentasi</p>
        <Image src={koran} alt="Document" className="mt-6 w-32 h-32" /> 
      </div>
      <div className="w-1/2 flex items-center justify-center bg-[#F7F7F7]">
        <div className="bg-white p-6 rounded shadow-md w-80">
          <h2 className="text-black text-lg font-semibold mb-4">Masuk Akun</h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <input
            type="text"
            placeholder="Masukkan nama Anda"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300"
          />
          <div className="relative mb-4">
            <input
              type={isPasswordVisible ? 'text' : 'password'} 
              placeholder="Masukkan kata sandi Anda"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300"
            />
            <button 
              onClick={togglePasswordVisibility} 
              className="absolute right-3 top-3 text-gray-500 focus:outline-none"
              type="button"
            >
              {isPasswordVisible ? (
                <Image src={show} alt="Show password" className="h-5 w-5" />
              ) : (
                <Image src={hide} alt="Hide password" className="h-5 w-5" />
              )}
            </button>
          </div>
          <button 
            onClick={handleLogin} 
            className="bg-[#991b1b] text-white rounded-lg p-3 w-full hover:bg-red-700 transition duration-300"
          >
            Masuk
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
