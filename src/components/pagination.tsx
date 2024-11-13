import React, { useEffect, useState } from 'react';
import supabase from '../components/SupabaseClient';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface SensorData {
  created_at: string;
  ds18b20_temp1: number;
  ds18b20_temp2: number;
  ds18b20_temp3: number;
  ds18b20_temp4: number;
  dht22_temp: number;
  dht22_humi: number;
  fan_status: string;
  flow_rate: number;
  sound_detected: string;
}

const Pagination: React.FC = () => {
  const [data, setData] = useState<SensorData[]>([]);
  const [activeSource, setActiveSource] = useState<'esp32_1' | 'esp32_duplicate'>('esp32_1');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: esp32Data, error: esp32Error } = await supabase
          .from('esp32_1')
          .select('*')
          .order('created_at', { ascending: true });

        if (esp32Error) throw esp32Error;

        const { data: esp32DuplicateData, error: esp32DuplicateError } = await supabase
          .from('esp32_duplicate')
          .select('*')
          .order('created_at', { ascending: true });

        if (esp32DuplicateError) throw esp32DuplicateError;

        setData(activeSource === 'esp32_1' ? esp32Data as SensorData[] : esp32DuplicateData as SensorData[]);
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error fetching data:', error.message);
          setError('Failed to fetch data: ' + error.message);
        } else {
          console.error('Unexpected error:', error);
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeSource]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

 

  const convertToCSV = (jsonData: SensorData[]) => {
    const headers = ['Created at', 'DS18B20 Temp1 (°C)', 'DS18B20 Temp2 (°C)', 'DS18B20 Temp3 (°C)', 'DS18B20 Temp4 (°C)', 'DHT22 Temp (°C)', 'DHT22 Humidity (%)', 'Fan Status', 'Sound Detected', 'Flow Rate'];
    const csvRows = [headers.join(',')];

    jsonData.forEach((item) => {
      const row = [
        item.created_at,
        item.ds18b20_temp1,
        item.ds18b20_temp2,
        item.ds18b20_temp3,
        item.ds18b20_temp4,
        item.dht22_temp,
        item.dht22_humi,
        item.fan_status,
        item.sound_detected,
        item.flow_rate,
      ];
      csvRows.push(row.join(','));
    });

    return csvRows.join('\n');
  };

  const downloadCSV = () => {
    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'esp32_data.csv');
    a.click();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-4 mb-8">
            <h3 className="text-xl font-semibold mb-4">Sensor Data</h3>
            <div className="flex space-x-4 mb-4">
              <button
                className={`bg-blue-500 text-white px-4 py-2 rounded ${activeSource === 'esp32_1' ? 'font-bold' : ''}`}
                onClick={() => setActiveSource('esp32_1')}
              >
                Source A (ESP32)
              </button>
              <button
                className={`bg-blue-500 text-white px-4 py-2 rounded ${activeSource === 'esp32_duplicate' ? 'font-bold' : ''}`}
                onClick={() => setActiveSource('esp32_duplicate')}
              >
                Source B (ESP32 Duplicate)
              </button>
            </div>

            {/* Other data summary components */}

            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Data Table with Pagination</h3>
              <button
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
                onClick={downloadCSV}>
                Download CSV
              </button>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3">Created at</th>
                      <th className="px-6 py-3">DS18B20 Temp1</th>
                      <th className="px-6 py-3">DS18B20 Temp2</th>
                      <th className="px-6 py-3">DS18B20 Temp3</th>
                      <th className="px-6 py-3">DS18B20 Temp4</th>
                      <th className="px-6 py-3">DHT22 Temp</th>
                      <th className="px-6 py-3">DHT22 Humidity</th>
                      <th className="px-6 py-3">Fan Status</th>
                      <th className="px-6 py-3">Sound Detected</th>
                      <th className="px-6 py-3">Flow Rate</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedData.map((item) => (
                      <tr key={item.created_at}>
                        <td className="px-6 py-4">{item.created_at}</td>
                        <td className="px-6 py-4">{item.ds18b20_temp1}°C</td>
                        <td className="px-6 py-4">{item.ds18b20_temp2}°C</td>
                        <td className="px-6 py-4">{item.ds18b20_temp3}°C</td>
                        <td className="px-6 py-4">{item.ds18b20_temp4}°C</td>
                        <td className="px-6 py-4">{item.dht22_temp}°C</td>
                        <td className="px-6 py-4">{item.dht22_humi}%</td>
                        <td className="px-6 py-4">{item.fan_status}</td>
                        <td className="px-6 py-4">{item.sound_detected}</td>
                        <td className="px-6 py-4">{item.flow_rate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

  );
};

export default Pagination;
