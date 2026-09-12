import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const RentalsProjects = () => {
  const [view, setView] = useState('rentals'); // 'rentals' or 'projects'
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.auth.accessToken);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const endpoint = view === 'rentals' ? '/v1/rentals' : '/v1/projects';
      
      try {
        const response = await fetch(`https://solve.ivy.homes${endpoint}?limit=50&offset=0`, {
          headers: {
            'X-API-Key': 'IVY26-6E629ED6FBB5',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const result = await response.json();
          
          // Defeat the Unit Traps!
          const cleanedData = result.results.map(item => {
            if (view === 'projects') {
              // Convert project prices (which are falsely served as small decimals) into raw rupees
              const truePriceMax = item.price_max < 1000 ? item.price_max * 1000000 : item.price_max;
              return { ...item, price_max: truePriceMax };
            }
            if (view === 'rentals') {
              // Convert mathematically impossible square meter areas to square feet (1 sq_m = 10.764 sq_ft)
              const trueArea = item.carpet_area < 250 ? Math.round(item.carpet_area * 10.764) : item.carpet_area;
              return { ...item, carpet_area: trueArea };
            }
            return item;
          });
          
          setData(cleanedData);
        }
      } catch (error) {
        console.error("Failed to fetch", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [view, token]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex gap-4 mb-6 border-b pb-4">
        <button 
          className={`font-bold px-4 py-2 rounded ${view === 'rentals' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setView('rentals')}
        >
          Rentals
        </button>
        <button 
          className={`font-bold px-4 py-2 rounded ${view === 'projects' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setView('projects')}
        >
          Projects
        </button>
      </div>

      {loading ? <div className="text-center py-10">Loading accurate data...</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow border p-4">
              <h4 className="font-bold text-lg">{item.apartment_name || item.title}</h4>
              <p className="text-gray-500 text-sm capitalize">{item.locality}</p>
              
              <div className="mt-3 text-sm flex flex-col gap-1">
                {view === 'rentals' ? (
                  <>
                    <span className="font-bold text-green-700">₹{item.price}/month</span>
                    <span className="text-gray-600">Area: {item.carpet_area} SqFt (Corrected)</span>
                  </>
                ) : (
                  <>
                    <span className="font-bold text-green-700">Up to ₹{(item.price_max / 100000).toFixed(2)} Lacs</span>
                    <span className="text-gray-600">Reported Listings: {item.total_listings}</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RentalsProjects;