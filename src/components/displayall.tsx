"use client";

import { useState, useEffect } from 'react';
import supabase from '../components/SupabaseClient';

const DisplayPDFs = () => {
  const [pdfUrls, setPdfUrls] = useState<{ document_url: string, document2_url: string }[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPDFs = async () => {
      const { data, error: pdfError } = await supabase
        .from('profiles')
        .select('document_url, document2_url');

      if (pdfError) {
        setError('Error fetching documents');
      } else {
        setPdfUrls(data || []);
      }
    };

    fetchPDFs();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-col items-center justify-center flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Documents</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {pdfUrls.length > 0 ? (
          <div className="space-y-4 w-full">
            {pdfUrls.map((pdf, index) => (
              <div key={index} className="w-full overflow-hidden border rounded p-4 bg-white shadow-sm">
                <p className="text-gray-600">1. Document Lapangan.</p>
                {pdf.document_url ? (
                  <embed
                    src={pdf.document_url}
                    className="w-full h-[400px] border rounded"
                    title={`User Document 1 - ${index + 1}`}
                    type="application/pdf"
                  />
                ) : (
                  <p></p>
                )}
                <p className="text-gray-600">2. Document Test Report.</p>
                {pdf.document2_url ? (
                  <embed
                    src={pdf.document2_url}
                    className="w-full h-[400px] border rounded mt-4"
                    title={`User Document 2 - ${index + 1}`}
                    type="application/pdf"
                  />
                ) : (
                  <p></p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No documents available.</p>
        )}
      </div>
    </div>
  );
};

export default DisplayPDFs;
