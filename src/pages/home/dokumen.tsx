import React, { useState } from 'react';
import Navbar from '../../components/navbar';
import supabase from '../../components/SupabaseClient';
import html2pdf from 'html2pdf.js';


const HomePage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [tableData1, setTableData1] = useState(
    Array.from({ length: 18 }, () => Array(2).fill(''))
  );

  const [tableData2, setTableData2] = useState(
    Array.from({ length: 16 }, () => Array(2).fill(''))
  );

  const keteranganData1 = [
    "Essential performance requirements 1 Sub clause 201.12.1.104 or generation of a visual and audible alarm in compliance with 201.15.4.2.1",
    "Essential performance requirements 2 Sub clause 201.12.1.105 or generation of a visual and audible alarm in compliance with 201.15.4.2.1",
    "See 16.9.2.1 b) for MULTIPLE SOCKET-OUTLETS integral with ME EQUIPMENT",
    "Conductors in POWER SUPPLY CORDS intended to be connected to the neutral conductor of the supply system shall be coloured “light blue”",
    "Requirements and tests relating to this SINGLE FAULT CONDITION are found in 13.2.13 and 15.4.2 for overloading situations.",
    "ME EQUIPMENT shall be so constructed that liquid that might escape in a SINGLE FAULT CONDITION does not result in an unacceptable RISK.",
    "In addition to the RECORDS and documents required by ISO 14971, the documents produced from application of Clause 14 shall be maintained and shall form part of the RISK MANAGEMENT FILE.",
    "The RISK MANAGEMENT plan required by 3.5 of ISO 14971 shall also include a reference to the PEMS VALIDATION plan (see 14.11).",
    "A PEMS DEVELOPMENT LIFE-CYCLE shall be documented",
    "When compiling the list of known or foreseeable HAZARDS, the MANUFACTURER shall consider those HAZARDS associated with software and hardware aspects of the PEMS including those associated with NETWORK/DATA COUPLING, components of third-party origin and legacy subsystems.",
    "Suitably validated tools and PROCEDURES shall be selected and identified to implement each RISK CONTROL measure. These tools and PROCEDURES shall be appropriate to assure that each RISK CONTROL measure satisfactorily reduces the identified RISK(S).",
    "For the PEMS and each of its subsystems (e.g. for a PESS) there shall be a documented requirement specification.",
    "For the PEMS and each of its subsystems, an architecture shall be specified that shall satisfy the requirement specification.",
    "VERIFICATION is required for all functions that implement BASIC SAFETY, ESSENTIAL PERFORMANCE or RISK CONTROL measures.",
    "A PEMS VALIDATION plan shall include the validation of BASIC SAFETY and ESSENTIAL PERFORMANCE, and shall require checks for unintended functioning of the PEMS.",
    "THERMAL CUT-OUTS and OVER-CURRENT RELEASES with automatic resetting shall not be used in ME EQUIPMENT if their use could result in a HAZARDOUS SITUATION by such resetting.",
    "THERMAL CUT-OUTS with a safety function that have to be reset by a soldering operation that can affect the operating value shall not be fitted in ME EQUIPMENT",
    "Battery compartments of ME EQUIPMENT shall be designed to prevent accidental short circuiting of the battery where such short circuits could result in a HAZARDOUS SITUATION."
];
    const keteranganData2 = [
    "Essential Performance ",
    "Output connectors",
    "Failure of THERMOSTATS",
    "Leakage of liquid",
    "Overload",
    "PROGAMMABLE ELECTRICAL MEDICAL SYSTEMS (PEMS) ",
    "General ",
    "Documentation",
    "RISK MANAGEMENT plan ",
    "RISK DEVELOPMENT LIFE-CYCLE",
    "RISK MANAGEMENT PROCESS",
    "Requirement specification",
    "Architecture ",
    "VERIFICATION. ",
    "PEMS VALIDATION ",
    "Temperature and overload control devices ",
];

  const handleInputChange1 = (
    rowIndex: number,
    colIndex: number,
    value: string
  ) => {
    const newData = [...tableData1];
    newData[rowIndex][colIndex] = value;
    setTableData1(newData);
  };

  const handleInputChange2 = (
    rowIndex: number,
    colIndex: number,
    value: string
  ) => {
    const newData = [...tableData2];
    newData[rowIndex][colIndex] = value;
    setTableData2(newData);
  };

  const printPage = () => {
    console.log("Print button clicked");
    window.print();
  };

  const savePageToDatabase = async () => {
    try {
      const pageContent = document.getElementById('printableArea');
      if (!pageContent) {
        setError('No content to save');
        return;
      }
  
      const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
      const fileName = `report-${timestamp}.pdf`;
  
      // Generate the PDF as a Blob
      const pdfBlob = (await html2pdf()
        .set({
          filename: fileName,
          html2canvas: { scale: 2 },
          jsPDF: { format: 'a4', orientation: 'portrait' },
        })
        .from(pageContent)
        .output('blob')) as Blob; // Cast as Blob here
  
      // Upload the Blob to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, pdfBlob);
  
      if (uploadError) throw new Error(`Failed to upload PDF: ${uploadError.message}`);
  
      // Generate signed URL for the PDF
      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from('documents')
        .createSignedUrl(uploadData.path, 60 * 60 * 24);
  
      if (signedUrlError) throw new Error(`Failed to create signed URL: ${signedUrlError.message}`);
  
      const documentUrl = signedUrlData.signedUrl;
  
      // Get authenticated user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('User not found or not authenticated');
  
      // Update user's profile with the new PDF document URL
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ document2_url: documentUrl })
        .eq('id', user.id);
  
      if (profileError) throw new Error(`Failed to update profile: ${profileError.message}`);
  
      setMessage('PDF saved and profile updated successfully!');
      setError('');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
      setMessage('');
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex-1 p-4 md:p-8">
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {message && <div className="text-green-500 mb-4">{message}</div>}
        <button
          onClick={printPage}
          className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 no-print"
        >
          Cetak Halaman
        </button>
        <button
          onClick={savePageToDatabase}
          className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 no-print"
        >
          Simpan Ke Database
        </button>
        <div className="mt-8 mb-10 relative" id="printableArea">
          <div className="letterhead flex items-center justify-between mb-0.5">
            <div className="flex-grow text-center">
              <h1 className="text-xl font-bold">TEST REPORT</h1>
            </div>
          </div>
          <hr className="mt-0 mb-2 w-full border-t-2 border-gray-300" />
          <div className="mb-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <div className="flex items-center mb-2">
                  <label className="block text-sm font-bold text-gray-700 w-1/3">No. Lab :</label>
                  <input
                    type="text"
                    className="p-1 rounded w-2/3 bg-transparent placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-300"
                    placeholder="Masukkan No. Lab"
                  />
                </div>
                <div className="flex items-center mb-2">
                  <label className="block text-sm font-bold text-gray-700 w-1/3">Nama Produk :</label>
                  <input
                    type="text"
                    className="p-1 rounded w-2/3 bg-transparent placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-300"
                    placeholder="Masukkan Nama Produk"
                  />
                </div>
                <div className="flex items-center mb-2">
                  <label className="block text-sm font-bold text-gray-700 w-1/3">Model :</label>
                  <input
                    type="text"
                    className="p-1 rounded w-2/3 bg-transparent placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-300"
                    placeholder="Masukkan Model"
                  />
                </div>
                <div className="flex items-center mb-2">
                  <p className="text-sm font-bold text-gray-700">Referensi : SNI IEC 60601-1:2024</p>
                </div>
              </div>
              <div className="col-span-1">
                <div className="flex items-center mb-2">
                  <label className="block text-sm font-bold text-gray-700 w-1/3">Author :</label>
                  <input
                    type="text"
                    className="p-1 rounded w-2/3 bg-transparent placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-300"
                    placeholder="Masukkan Author"
                  />
                </div>
                <div className="flex items-center mb-2">
                  <label className="block text-sm font-bold text-gray-700 w-1/3">No. Serial :</label>
                  <input
                    type="text"
                    className="p-1 rounded w-2/3 bg-transparent placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-300"
                    placeholder="Masukkan No. Serial"
                  />
                </div>
                <div className="flex items-center mb-2">
                  <p className="text-sm font-bold text-gray-700">
                    Tanggal Uji: {new Date().toLocaleString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: false
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-300 bg-white shadow-lg rounded">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-2 md:px-4 py-2 border border-gray-300">NO</th>
                  <th className="px-2 md:px-4 py-2 border border-gray-300">KETERANGAN</th>
                  <th className="px-2 md:px-4 py-2 border border-gray-300">PENJELASAN</th>
                  <th className="px-2 md:px-4 py-2 border border-gray-300">HASIL</th>
                </tr>
              </thead>
              <tbody>
                {tableData1.map((rowData, rowIndex) => (
                  <tr key={rowIndex} className="text-center hover:bg-gray-100 transition duration-150">
                    <td className="px-2 md:px-4 py-2 border border-gray-300">{rowIndex + 1}</td>
                    <td className="px-2 md:px-4 py-2 border border-gray-300 text-left">{keteranganData1[rowIndex]}</td>

                    <td className="px-2 md:px-4 py-2 border border-gray-300">
                      <textarea
                        className="w-full p-2 bg-transparent border-none resize-y placeholder-gray-400 focus:outline-none focus:ring-0"
                        value={rowData[0]}
                        onChange={(e) => handleInputChange1(rowIndex, 0, e.target.value)}
                        placeholder="Masukan Data"
                        rows={2}
                        style={{ minHeight: '50px' }}
                      />
                    </td>
                    <td className="px-2 md:px-4 py-2 border border-gray-300">
                      <select
                        className="w-full p-2 bg-transparent border-none appearance-none rounded focus:outline-none focus:ring-0"
                        value={rowData[1]}
                        onChange={(e) => handleInputChange1(rowIndex, 1, e.target.value)}
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

          <div className="overflow-x-auto mt-4">
            <table className="min-w-full table-auto border-collapse border border-gray-300 bg-white shadow-lg rounded">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-2 md:px-4 py-2 border border-gray-300">NO</th>
                  <th className="px-2 md:px-4 py-2 border border-gray-300">KETERANGAN</th>
                  <th className="px-2 md:px-4 py-2 border border-gray-300">HASIL</th>
                </tr>
              </thead>
              <tbody>
                {tableData2.map((rowData, rowIndex) => (
                  <tr key={rowIndex} className="text-center hover:bg-gray-100 transition duration-150">
                    <td className="px-2 md:px-4 py-2 border border-gray-300">{rowIndex + 1}</td>
                    <td className="px-2 md:px-4 py-2 border border-gray-300 text-left">{keteranganData2[rowIndex]}</td>

                    <td className="px-2 md:px-4 py-2 border border-gray-300">
                      <select
                        className="w-full p-2 bg-transparent border-none appearance-none rounded focus:outline-none focus:ring-0"
                        value={rowData[1]}
                        onChange={(e) => handleInputChange2(rowIndex, 1, e.target.value)}
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

        </div>

        <button
          onClick={printPage}
          className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 no-print"
        >
          Cetak Halaman
        </button>
      </main>
    </div>
  );
};

export default HomePage;

