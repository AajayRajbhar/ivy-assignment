import React, { useMemo, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllListings } from '../store/propertySlice';
import { Link } from 'react-router-dom';

const Saved = () => {
  const dispatch = useDispatch();
  const { listings, status } = useSelector((state) => state.properties);
  const { user } = useSelector((state) => state.auth);
  
  const [refreshToggle, setRefreshToggle] = useState(false);

  // Re-fetch listings if we hard refreshed directly on this page
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAllListings());
    }
  }, [status, dispatch]);

  const savedKey = `saved_${user?.email}`;

  const savedListings = useMemo(() => {
    const savedIds = JSON.parse(localStorage.getItem(savedKey) || '[]');
    return listings.filter(item => savedIds.includes(item.listing_id));
  }, [listings, user, refreshToggle]);

  const removeSaved = (id) => {
    const savedIds = JSON.parse(localStorage.getItem(savedKey) || '[]');
    const updatedIds = savedIds.filter(savedId => savedId !== id);
    localStorage.setItem(savedKey, JSON.stringify(updatedIds));
    setRefreshToggle(!refreshToggle);
  };

  // 🛠️ THE FIX: Catch both 'loading' and 'idle' states so the empty message doesn't flash
  if (status === 'loading' || status === 'idle') {
    return <div className="text-center py-10 text-gray-500 font-semibold">Restoring saved properties...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 pb-2 border-b">
        Saved Properties for {user?.email}
      </h2>

      {savedListings.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow border">
          <p className="text-gray-500 text-lg mb-4">You haven't saved any properties yet.</p>
          <Link to="/" className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700">
            Start Browsing
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedListings.map(listing => (
            <div key={listing.listing_id} className="bg-white rounded-lg shadow border overflow-hidden">
              <div className="p-4">
                <h4 className="font-bold text-lg truncate">{listing.apartment_name || 'Independent Property'}</h4>
                <p className="text-gray-500 text-sm capitalize">{listing.locality}</p>
                <div className="mt-2 font-bold text-green-700">
                  ₹{(listing.price / 100000).toFixed(2)} Lacs
                </div>
                
                <div className="mt-4 flex gap-2">
                  <Link 
                    to={`/listings/${listing.listing_id}`}
                    className="flex-1 text-center bg-gray-100 text-gray-800 py-2 rounded hover:bg-gray-200 transition text-sm font-bold"
                  >
                    View
                  </Link>
                  <button 
                    onClick={() => removeSaved(listing.listing_id)}
                    className="flex-1 bg-red-100 text-red-600 py-2 rounded hover:bg-red-200 transition text-sm font-bold"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Saved;