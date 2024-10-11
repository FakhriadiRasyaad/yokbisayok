"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../components/SupabaseClient';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import AddUserIcon from '../assets/add.png'; // Import the add user image

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [isCurrentUserAdmin, setIsCurrentUserAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUserStatus = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        router.push('/login');
      } else {
        const { data } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();

        setIsCurrentUserAdmin(data.is_admin);
      }
    };

    checkUserStatus();
    fetchUsers();
  }, [router]);

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, email, avatar_url, is_admin');

    if (error) {
      setError('Error fetching users');
    } else {
      setUsers(data || []);
    }
  };

  const handleAdminButtonClick = () => {
    router.push('/user/useradmin');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-8 lg:p-12 relative">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Daftar User</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="mt-8 w-full max-w-6xl">
          {users.length > 0 ? (
            <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
              <table className="table-auto w-full bg-white">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Avatar</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Full Name</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={index} className="hover:bg-gray-100 transition duration-200">
                      <td className="border px-4 py-2">
                        {user.avatar_url ? (
                          <img
                            src={user.avatar_url}
                            alt="avatar"
                            className="w-12 h-12 rounded-full"
                          />
                        ) : (
                          <span className="text-gray-500">No Avatar</span>
                        )}
                      </td>
                      <td className="border px-4 py-2">{user.full_name}</td>
                      <td className="border px-4 py-2">{user.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600">Tidak ada pengguna</p>
          )}
        </div>

        {/* Admin button with Add User icon */}
        {isCurrentUserAdmin && (
          <div className="absolute top-4 right-4 flex items-center">
            <button
              onClick={handleAdminButtonClick}
              className="bg-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:bg-blue-600 transition duration-300 transform hover:scale-105">
              <img src={AddUserIcon.src} alt="Add User" className="w-10 h-10" /> {/* Use the imported image */}
            </button>
          </div>
        )}
        <div className="mt-20"> {/* Margin above the footer */}
        <Footer />
      </div>
      </div>
    </div>
  );
};

export default UserPage;
