import React, { useState } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import Botpress from '../components/botpress';
import logo from '../assets/standby.png';

const HomePage: React.FC = () => {
  const [tableData, setTableData] = useState(
    Array.from({ length: 10 }, () => Array(2).fill(''))
  );

  const keteranganData = [
    "Data Proses",
    "Data di Perjalanan",
    "Data Rusak",
    "Data Baru Diperbarui",
    "Data Pending",
    "Data Terkirim",
    "Data Valid",
    "Data Tidak Valid",
    "Data Dalam Proses Verifikasi",
    "Data Selesai"
  ];

  const placeholders = [
    "Masukin data A",
    "Masukin data kemarin",
    "Masukin data pengujian",
    "Masukin data akhir",
    "Masukin data tambahan",
    "Masukin data validasi",
    "Masukin data catatan",
    "Masukin data review",
    "Masukin data perbaikan",
    "Masukin data final"
  ];

  const handleInputChange = (rowIndex: number, colIndex: number, value: string) => {
    const newData = [...tableData];
    newData[rowIndex][colIndex] = value;
    setTableData(newData);
  };

  const handlePrint = () => {
    const newWin = window.open('', '_blank');
    newWin.document.write(`
      <html>
        <head>
          <title>Print</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid gray;
              padding: 8px;
              text-align: center;
            }
            .letterhead {
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 20px;
            }
            .letterhead img {
              width: 150px;
              margin-right: 20px; /* Adjust as necessary */
            }
            .title {
              text-align: center;
              font-size: 24px;
              font-weight: bold;
            }
            @media print {
              body {
                margin: 0;
                padding: 0;
              }
              img {
                max-width: 100%;
                height: auto;
              }
            }
          </style>
        </head>
        <body>
          <div id="printableArea">
            <div class="letterhead">
              <img src="../assets/standby.png" alt="Logo" />
              <div class="title">Berkas Test Report</div>
            </div>
            <div>
              ${document.getElementById('printableArea').innerHTML}
            </div>
          </div>
        </body>
      </html>
    `);
    newWin.document.close();
    newWin.print();
    newWin.close();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <Botpress />
      <main className="flex-1 p-4 md:p-8">
        <div className="flex justify-end mb-4">
          <button 
            onClick={handlePrint} 
            className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition duration-300"
          >
            Print
          </button>
        </div>

        <div className="mt-8 mb-10" id="printableArea"> {/* Added mb-10 for spacing */}
          {/* Letterhead Section */}
          <div className="letterhead flex items-center justify-center mb-4">
            <img src={logo.src} alt="Logo" className="w-32 md:w-40" />
            <div className="title text-center">
              {/* Optional: Add a title here */}
            </div>
          </div>

          <table className="min-w-full table-auto border-collapse border border-gray-300 bg-white shadow-lg rounded">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 border border-gray-300">NO</th>
                <th className="px-4 py-2 border border-gray-300">KETERANGAN</th>
                <th className="px-4 py-2 border border-gray-300">PENJELASAN</th>
                <th className="px-4 py-2 border border-gray-300">HASIL</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((rowData, rowIndex) => (
                <tr key={rowIndex} className="text-center hover:bg-gray-100 transition duration-150">
                  <td className="px-4 py-2 border border-gray-300">{rowIndex + 1}</td>
                  <td className="px-4 py-2 border border-gray-300">{keteranganData[rowIndex]}</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <textarea
                      className="w-full p-2 border border-gray-300 resize-y placeholder-gray-400 rounded focus:outline-none focus:ring focus:ring-blue-300"
                      value={rowData[0]}
                      onChange={(e) => handleInputChange(rowIndex, 0, e.target.value)}
                      placeholder={placeholders[rowIndex]}
                      rows={2}
                      style={{ minHeight: '50px' }}
                    />
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    <select
                      className="w-full p-2 border border-gray-300 appearance-none bg-white rounded focus:outline-none focus:ring focus:ring-blue-300"
                      value={rowData[1]}
                      onChange={(e) => handleInputChange(rowIndex, 1, e.target.value)}
                    >
                      <option value="">Pilih...</option>
                      <option value="P">P</option>
                      <option value="L">L</option>
                      <option value="NC">NC</option>
                      <option value="NA">NA</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
