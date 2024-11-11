import Botpress from '../../components/botpress';
import DisplayPDFs from '../../components/displayall';
import Navbar from '../../components/navbar';


const HomePage= () => {
 


  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <Botpress />
      <DisplayPDFs />
      
      
    </div>
  );
};

export default HomePage;
