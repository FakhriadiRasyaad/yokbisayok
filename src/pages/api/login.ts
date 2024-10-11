import { NextApiRequest, NextApiResponse } from 'next';
import supabase from '../../../../backend/Client';


const loginHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, password } = req.body;

  // Validasi input
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: username,
    password: password,
  });

  if (error) {
    return res.status(401).json({ message: error.message });
  }

  if (!data.user) {
    return res.status(401).json({ message: 'User not found' });
  }

  // Pastikan user.id tidak undefined sebelum mengembalikan respons
  const userToken = data.user.id; // Ganti dengan token yang sesuai jika perlu
  if (!userToken) {
    return res.status(401).json({ message: 'User token is undefined' });
  }

  return res.status(200).json({ user: userToken });
};

export default loginHandler;
