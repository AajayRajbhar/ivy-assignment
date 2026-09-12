import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Detail = () => {
  const { id } = useParams();
  const { listings } = useSelector((state) => state.properties);
  const { user } = useSelector((state) => state.auth);
  
  const [listing, setListing] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  // Storage key specific to the current user (e.g., "saved_demo1@ivy.homes")
  const savedKey = `saved_${user?.email}`;

  useEffect(() => {
    // Find the listing in our cleaned Redux store
    const found = listings.find((item) => item.listing_id === id);
    setListing(found);

    // Check if it's already saved by this user
    const savedItems = JSON.parse(localStorage.getItem(savedKey) || '[]');
    setIsSaved(savedItems.includes(id));
  }, [id, listings, user]);

  const toggleSave = () => {
    let savedItems = JSON.parse(localStorage.getItem(savedKey) || '[]');
    if (isSaved) {
      savedItems = savedItems.filter((savedId) => savedId !== id);
    } else {
      savedItems.push(id);
    }
    localStorage.setItem(savedKey, JSON.stringify(savedItems));
    setIsSaved(!isSaved);
  };

  if (!listing) return <div className="p-10 text-center">Listing not found or loading...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
      <div className="flex justify-between items-start mb-6 border-b pb-4">
        <div>
          <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded uppercase tracking-wide">
            {listing.property_type}
          </span>
          <h2 className="text-3xl font-bold mt-2">{listing.apartment_name || 'Independent Property'}</h2>
          <p className="text-gray-600 capitalize text-lg">{listing.locality}</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-green-700">₹{(listing.price / 100000).toFixed(2)} Lacs</div>
          <button 
            onClick={toggleSave}
            className={`mt-3 px-4 py-2 rounded font-bold transition ${
              isSaved ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            {isSaved ? '♥ Saved' : '♡ Save Property'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded border text-center">
          <div className="text-sm text-gray-500 mb-1">Bedrooms</div>
          <div className="font-bold text-xl">{listing.bedroom}</div>
        </div>
        <div className="bg-gray-50 p-4 rounded border text-center">
          <div className="text-sm text-gray-500 mb-1">Bathrooms</div>
          <div className="font-bold text-xl">{listing.bathroom}</div>
        </div>
        <div className="bg-gray-50 p-4 rounded border text-center">
          <div className="text-sm text-gray-500 mb-1">Area (SqFt)</div>
          <div className="font-bold text-xl">{listing.carpet_area}</div>
        </div>
        <div className="bg-gray-50 p-4 rounded border text-center">
          <div className="text-sm text-gray-500 mb-1">Furnishing</div>
          <div className="font-bold text-lg capitalize">{listing.furnishing.replace('-', ' ')}</div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">Description</h3>
        <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded border">
          {listing.description}
        </p>
      </div>

      <Link to="/" className="text-blue-600 hover:underline">← Back to Browse</Link>
    </div>
  );
};

export default Detail;