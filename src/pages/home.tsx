import Navbar from '../components/navbar';
import Botpress from '../components/botpress';
import DisplayPDFs from '../components/displaypdf';
import { useRouter } from 'next/router';

const HomePage: React.FC = () => {
  const router = useRouter(); 

  const dokumen = () => {
    router.push('/home/dokumen');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <Botpress />
      <DisplayPDFs />
      <button
        onClick={dokumen}
        className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 mb-10"
      >
        Pergi Ke Halaman Dokumen Test Report
      </button>
    </div>
  );
};

export default HomePage;
