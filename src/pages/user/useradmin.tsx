"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../../components/SupabaseClient';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';

type User = {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string;
  is_admin: boolean;
  updated_at: string;
};

const CreateUserPage = () => {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        router.push('/login');
      } else {
        const { data } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();
        if (!data?.is_admin) {
          router.push('/home');
        }
      }
    };

    checkAdmin();
  }, [router]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from('profiles').select('*');
      if (error) {
        console.error('Error fetching users:', error);
      } else if (data) {
        setUsers(data as User[]);
      }
    };

    fetchUsers();
  }, []);

  const uploadAvatar = async (file: File) => {
    const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
    const fileName = `${timestamp}-${file.name}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(`${fileName}`, file);

    if (uploadError) {
      console.error('Error uploading avatar:', uploadError);
      throw new Error(`Failed to upload avatar: ${uploadError.message}`);
    }

    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from('avatars')
      .createSignedUrl(uploadData?.path || '', 60 * 60 * 24 * 365 * 10);

    if (signedUrlError) {
      console.error('Error creating signed URL:', signedUrlError);
      throw new Error(`Failed to create signed URL: ${signedUrlError.message}`);
    }

    return signedUrlData.signedUrl;
  };

  const handleCreateUser = async () => {
    try {
      if (avatar && (avatar.size > 2 * 1024 * 1024 || !['image/jpeg', 'image/png'].includes(avatar.type))) {
        setError('File must be a JPEG or PNG and less than 2MB');
        return;
      }

      let avatarUrl = '';
      if (avatar) {
        avatarUrl = await uploadAvatar(avatar);
      }

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
        router.push('/user');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
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

          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="admin"
                checked={isAdmin === true}
                onChange={() => setIsAdmin(true)}
                className="mr-2"
              />
              Admin
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="staff"
                checked={isAdmin === false}
                onChange={() => setIsAdmin(false)}
                className="mr-2"
              />
              Staff
            </label>
          </div>

          <button
            onClick={handleCreateUser}
            className="flex items-center justify-center bg-red-500 text-white rounded-lg p-3 w-full hover:bg-red-800 transition"
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
                    <img src={user.avatar_url} alt="Avatar" className="h-10 w-10 rounded-full" />
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
        <div className="mt-20">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default CreateUserPage;
