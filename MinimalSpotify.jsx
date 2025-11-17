import React, { useState, useEffect } from 'react';

function MinimalSpotify() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    try {
      console.log('Loading minimal app...');
      // Try to import the data dynamically
      import('./enhanced-playlist-data.json')
        .then(module => {
          console.log('Data loaded successfully:', module.default?.length, 'tracks');
          setData(module.default);
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to load data:', err);
          setError(err.message);
          setLoading(false);
        });
    } catch (err) {
      console.error('Error in useEffect:', err);
      setError(err.message);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <h1 className="text-2xl">Loading your music data...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-screen bg-gradient-to-br from-red-900 via-black to-red-900 flex items-center justify-center">
        <div className="text-white text-center p-8">
          <h1 className="text-4xl font-bold mb-4">Error</h1>
          <p className="text-xl mb-8">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-green-900 via-black to-emerald-900 flex items-center justify-center">
      <div className="text-white text-center p-8">
        <h1 className="text-6xl font-bold mb-4">🎵 Spotify Wrapped</h1>
        <h2 className="text-4xl font-bold mb-6">Works!</h2>
        <p className="text-2xl">
          Loaded {data?.length || 0} tracks successfully
        </p>
      </div>
    </div>
  );
}

export default MinimalSpotify;