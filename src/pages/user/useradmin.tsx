"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../../components/SupabaseClient';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import Image from 'next/image';

type User = {
  id: string;
  avatar_url: string;
  full_name: string;
  email: string;
  is_admin: boolean;
  updated_at: string;
};

const CreateUserPage = () => {
  const [username, setUsername] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [users, setUsers] = useState<User[]>([]); // Use User type here
  const [error, setError] = useState<string>('');
  const router = useRouter();

 // Check if the user is admin
useEffect(() => {
  const checkAdmin = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      router.push('/login'); // Redirect to login if no user
      return; // Exit the function after redirection
    }
    
    const { data, error: profileError } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();
    
    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return; // Handle the error appropriately
    }

    // Check if data is not null and then check is_admin
    if (data && !data.is_admin) {
      router.push('/home'); // Redirect if user is not admin
    }
  };

  checkAdmin();
}, [router]);


  // Fetch users from the database
  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from('profiles').select('*');
      if (error) {
        console.error('Error fetching users:', error);
      } else {
        setUsers(data);
      }
    };

    fetchUsers();
  }, []);

  const uploadAvatar = async (file: File) => {
    const timestamp = new Date().toISOString().replace(/[-:.]/g, ''); // Format date as YYYYMMDDTHHMMSS
    const fileName = `${timestamp}-${file.name}`; // Create a new file name
  
    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(`${fileName}`, file); // Use the formatted file name
    
    if (uploadError) {
      console.error('Error uploading avatar:', uploadError);
      throw new Error(`Failed to upload avatar: ${uploadError.message}`);
    }
  
    // Create a signed URL
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from('avatars')
      .createSignedUrl(uploadData.path, 60 * 60 * 24 * 365 * 10); // URL valid for 1 hour
  
    if (signedUrlError) {
      console.error('Error creating signed URL:', signedUrlError);
      throw new Error(`Failed to create signed URL: ${signedUrlError.message}`);
    }
  
    return signedUrlData.signedUrl; // Return signed URL
  };

  
  const handleCreateUser = async () => {
    try {
      // Validate avatar file
      if (avatar && (avatar.size > 2 * 1024 * 1024 || !['image/jpeg', 'image/png'].includes(avatar.type))) {
        setError('File must be a JPEG or PNG and less than 2MB');
        return;
      }
  
      // Upload avatar if exists
      let avatarUrl = '';
      if (avatar) {
        avatarUrl = await uploadAvatar(avatar);
      }
  
      // Create a new account in Supabase
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            full_name: fullName,
            avatar_url: avatarUrl,
            is_admin: isAdmin,
            updated_at: new Date().toISOString(),
          },
        },
      });
  
      if (error) {
        setError(error.message);
      } else {
        // Redirect to user page after successful creation
        router.push('/user');
      }
    } catch (err) {
      // Check if the error is an instance of Error
      if (err instanceof Error) {
        setError(err.message);
      } else {
        // Fallback error message
        setError('An unexpected error occurred');
      }
    }
  };
  
  

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-col items-center justify-center flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Buat Akun Baru</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="w-full max-w-md space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 w-full"
          />

          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 w-full"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 w-full"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 w-full"
          />

          <input
            type="file"
            onChange={(e) => setAvatar(e.target.files ? e.target.files[0] : null)}
            className="mb-4"
          />

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
              className="mr-2"
            />
            Admin
          </label>

          <button
            onClick={handleCreateUser}
            className="flex items-center justify-center bg-blue-600 text-white rounded-lg p-3 w-full hover:bg-blue-700 transition"
          >
            Buat Akun
          </button>
        </div>

        <h2 className="text-2xl font-bold mt-8">Daftar Pengguna</h2>
        <div className="overflow-x-auto mt-4 w-full">
          <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avatar</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Image src={user.avatar_url} alt="Avatar" className="h-10 w-10 rounded-full" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.full_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.is_admin ? 'Admin' : 'Staff'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.updated_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-20"> {/* Margin above the footer */}
        <Footer />
      </div>
      </div>
    </div>
  );
};

export default CreateUserPage;
