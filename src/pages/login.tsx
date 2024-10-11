"use client";

import supabase from '../components/SupabaseClient'; 
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import logo from '../assets/standby.png';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        router.push('/home'); // Redirect to home if user is already logged in
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

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src={logo.src}
              alt="Stanby Logo" 
              className="h-8 w-8 mr-2" // Adjust size and margin as needed
            />
            <h1 className="text-lg font-bold text-gray-700">StandBy</h1>
          </div>
          <button 
            onClick={() => setIsLoginVisible(!isLoginVisible)} 
            className="text-blue-500 hover:underline"
          >
            Login
          </button>
        </div>
      </nav>

      {/* Login Form */}
      {isLoginVisible && (
        <div className="flex items-center justify-center flex-1">
          <div className="bg-white shadow-md rounded-lg p-8 w-96">
            <h2 className="text-3xl font-bold text-center text-gray-700 mb-6">Login</h2>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              onClick={handleLogin} 
              className="bg-[#630000] text-white rounded-lg p-2 w-full hover:bg-red-700 transition duration-300"
            >
              Login
            </button>
          </div>
        </div>
      )}
      <h2>standbyincubator@gmail.com</h2>
      <h2>standby123</h2>
      <h2>fakhriadi06ras@gmail.com</h2>
      <h2>qwerty12345</h2>
    </div>
  );
};

export default LoginPage;
