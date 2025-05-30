import React, { useState } from 'react';
import { Download } from 'lucide-react';

const BACKEND_URL = "http://localhost:8000";

export const FIRViewer: React.FC = () => {
  const [firId, setFirId] = useState<string>('');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = firId.trim();
    if (!cleanId) {
      setError("Please enter a valid FIR ID.");
      return;
    }

    const url = `${BACKEND_URL}/get-pdf/${cleanId}`;

    // Check if the PDF exists
    fetch(url).then(res => {
      if (res.ok) {
        setPdfUrl(url);
        setError(null);
      } else {
        setPdfUrl(null);
        setError("FIR not found.");
      }
    }).catch(() => {
      setPdfUrl(null);
      setError("Failed to connect to server.");
    });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Download FIR PDF</h1>
      <form onSubmit={handleSubmit} className="mb-6 flex gap-4">
        <input
          type="text"
          value={firId}
          onChange={(e) => setFirId(e.target.value)}
          placeholder="Enter FIR ID"
          className="flex-grow border p-2 rounded"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Fetch
        </button>
      </form>

      {error && <p className="text-red-500">{error}</p>}

      {pdfUrl && (
        <div className="space-y-4">
          <a
            href={pdfUrl}
            download
            className="inline-flex items-center space-x-2 text-green-600 hover:text-green-800"
          >
            <Download className="h-5 w-5" />
            <span>Download FIR PDF</span>
          </a>
          <iframe
            src={pdfUrl}
            title="FIR PDF"
            className="w-full h-[600px] border rounded"
          />
        </div>
      )}
    </div>
  );
};
