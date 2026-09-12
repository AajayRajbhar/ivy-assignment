import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllListings } from '../store/propertySlice';
import { Link } from 'react-router-dom';

const Browse = () => {
  const dispatch = useDispatch();
  const { listings, status, error } = useSelector((state) => state.properties);

  // Local state for the filter inputs
  const [filters, setFilters] = useState({
    locality: '',
    bhk: '',
    minPrice: '',
    maxPrice: ''
  });

  // Fetch data on mount if it hasn't been loaded yet
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAllListings());
    }
  }, [status, dispatch]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // The Client-Side Filter Engine
  const filteredListings = useMemo(() => {
    return listings.filter(item => {
      if (filters.locality && item.locality.toLowerCase() !== filters.locality.toLowerCase()) return false;
      if (filters.bhk && item.bedroom !== Number(filters.bhk)) return false;
      if (filters.minPrice && item.price < Number(filters.minPrice)) return false;
      if (filters.maxPrice && item.price > Number(filters.maxPrice)) return false;
      return true;
    });
  }, [listings, filters]);

  if (status === 'loading') return <div className="text-center py-10">Loading thousands of listings securely...</div>;
  if (status === 'failed') return <div className="text-red-500 text-center py-10">Error loading data: {error}</div>;

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Filters Sidebar */}
      <div className="w-full md:w-64 bg-white p-4 rounded-lg shadow h-fit">
        <h3 className="font-bold text-lg mb-4 border-b pb-2">Filters</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Locality</label>
            <input type="text" name="locality" onChange={handleFilterChange} placeholder="e.g. kothrud" className="w-full border rounded p-2 text-sm" />
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-1">Bedrooms</label>
            <select name="bhk" onChange={handleFilterChange} className="w-full border rounded p-2 text-sm">
              <option value="">Any</option>
              <option value="1">1 BHK</option>
              <option value="2">2 BHK</option>
              <option value="3">3 BHK</option>
              <option value="4">4+ BHK</option>
            </select>
          </div>
          
          <div className="flex gap-2">
            <div className="w-1/2">
              <label className="block text-sm text-gray-600 mb-1">Min Price</label>
              <input type="number" name="minPrice" onChange={handleFilterChange} className="w-full border rounded p-2 text-sm" />
            </div>
            <div className="w-1/2">
              <label className="block text-sm text-gray-600 mb-1">Max Price</label>
              <input type="number" name="maxPrice" onChange={handleFilterChange} className="w-full border rounded p-2 text-sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="flex-1">
        <div className="mb-4 text-gray-600 font-semibold">
          Showing {filteredListings.length} accurate results
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredListings.map(listing => (
            <div key={listing.listing_id} className="bg-white rounded-lg shadow hover:shadow-md transition overflow-hidden border">
              <div className="p-4">
                <div className="text-xs font-bold text-blue-600 uppercase tracking-wide">{listing.property_type}</div>
                <h4 className="font-bold text-lg mt-1 truncate">{listing.apartment_name || 'Independent Property'}</h4>
                <p className="text-gray-500 text-sm capitalize">{listing.locality}</p>
                
                <div className="mt-3 flex justify-between items-center text-sm border-t pt-3">
                  <span className="font-semibold text-gray-700">{listing.bedroom} BHK</span>
                  <span className="font-bold text-green-700">₹{(listing.price / 100000).toFixed(2)} Lacs</span>
                </div>
                
                <Link 
                  to={`/listings/${listing.listing_id}`}
                  className="mt-4 block text-center bg-gray-100 text-gray-800 font-semibold py-2 rounded hover:bg-gray-200 transition"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Browse;