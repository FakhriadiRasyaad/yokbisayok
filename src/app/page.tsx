"use client"; 

import supabase from '../components/SupabaseClient'; 
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
<<<<<<< HEAD
import logo from '../assets/standbyputih.png';
import koran from '../assets/koran.png';
=======
import logo from '../assets/standby.png';
import foto from '../assets/bayi.png';
>>>>>>> 898840bf63a518a32377b2ca928c801d476a95f0

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

<<<<<<< HEAD
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
          <h2 className="text-lg font-semibold mb-4">Masuk Akun</h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <input
            type="text"
            placeholder="Masukkan nama Anda"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300"
          />
          <div className="relative mb-4">
=======
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 relative">
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${foto.src})` }}>
      </div>

      <nav className="bg-white shadow-md p-4 relative z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Image 
              src={logo.src}
              alt="Stanby Logo" 
              className="h-8 w-8 mr-2" 
            />
            <h1 className="text-lg font-bold text-red-400">StandBy</h1>
          </div>
          <button 
            onClick={() => setIsLoginVisible(!isLoginVisible)} 
            className="text-red-500 hover:underline">
            Login
          </button>
        </div>
      </nav>
      <div className="relative z-10 flex justify-center items-center flex-1">
             <h1 className="text-4xl font-bold text-red-800">Selamat Datang!</h1>
          </div>

      {isLoginVisible && (
        <div className="flex items-center justify-center flex-1 relative z-10">
          <div className="bg-white shadow-md rounded-lg p-8 w-96">
            <h2 className="text-3xl font-bold text-center text-red-800 mb-6">Login</h2>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
>>>>>>> 898840bf63a518a32377b2ca928c801d476a95f0
            <input
              type={isPasswordVisible ? 'text' : 'password'} 
              placeholder="Masukkan kata sandi Anda"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300"
            />
            <button 
<<<<<<< HEAD
              onClick={togglePasswordVisibility} 
              className="absolute right-3 top-3 text-gray-500 focus:outline-none"
              type="button"
=======
              onClick={handleLogin} 
              className="bg-[#E3383A] text-white rounded-lg p-2 w-full hover:bg-red-700 transition duration-300"
>>>>>>> 898840bf63a518a32377b2ca928c801d476a95f0
            >
              {isPasswordVisible ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12c0 4.418 3.582 8 8 8s8-3.582 8-8-3.582-8-8-8-8 3.582-8 8zm8 4v-4m0 0H7m4 0h4m-4 0V8" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12c0 1.5-.5 2-1 2s-1-.5-1-2 1-2 1-2 1 0 1 2zm-3-6c5 0 8 3 8 3s-3 3-8 3-8-3-8-3 3-3 8-3zM4.5 5.5l15 15" />
                </svg>
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
<<<<<<< HEAD
=======
      )}

     
      <div className="relative z-10 p-8">
        <h2>standbyincubator@gmail.com</h2>
        <h2>standby123</h2>
        <h2>fakhriadi06ras@gmail.com</h2>
        <h2>qwerty12345</h2>
>>>>>>> 898840bf63a518a32377b2ca928c801d476a95f0
      </div>
    </div>
  );
}

export default LoginPage;



