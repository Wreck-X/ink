import { invoke } from '@tauri-apps/api/core';
import { useState } from 'react';

function App() {
  const [title, setTitle] = useState<string>("");
  const [chapters, setChapters] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleOpenEPUB = async () => {
    try {
      setLoading(true);
      setError("");

      const path = "/home/wreck/epub/The_Metamorphosis-Franz_Kafka.epub"; // temp path
      const result = await invoke<string>("open_epub", { path }); // Return type string
      setTitle(result);
    } catch (err: any) {
      setError(`Failed to open EPUB: ${err?.message || err}`);
      console.error("Error opening EPUB:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleListChapters = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await invoke<string[]>("list_chapters"); // Return type string[]
      setChapters(result);
    } catch (err: any) {
      setError(`Failed to list chapters: ${err?.message || err}`);
      console.error("Error listing chapters:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 font-sans bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">EPUB Reader</h1>

      <div className="flex gap-3 mb-6">
        <button
          onClick={handleOpenEPUB}
          disabled={loading}
          className={`px-5 py-2 rounded-lg font-medium transition-all duration-200 ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 hover:shadow-lg transform hover:-translate-y-0.5'
          } text-white`}
        >
          {loading ? 'Loading...' : 'Open EPUB'}
        </button>

        <button
          onClick={handleListChapters}
          disabled={loading || !title}
          className={`px-5 py-2 rounded-lg font-medium transition-all duration-200 ${
            (loading || !title)
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600 hover:shadow-lg transform hover:-translate-y-0.5'
          } text-white`}
        >
          {loading ? 'Loading...' : 'List Chapters'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      {title && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Currently Reading</h2>
          <p className="text-lg text-gray-900">{title}</p>
        </div>
      )}

      {chapters.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Chapters</h3>
          <ul className="space-y-2">
            {chapters.map((chapter, index) => (
              <li
                key={index}
                className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors duration-150 cursor-pointer border border-gray-100 hover:border-blue-200"
              >
                <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                  {index + 1}
                </span>
                <span className="text-gray-800 font-medium">{chapter}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
