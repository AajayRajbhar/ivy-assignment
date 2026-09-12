import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

// Helper function to calculate the median of an array of numbers
const getMedian = (arr) => {
  if (!arr || arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
};

const Insights = () => {
  // Grab the clean listings from our Redux store
  const { listings, status } = useSelector((state) => state.properties);

  // Calculate the "Promised" Analytics manually
  const analytics = useMemo(() => {
    if (!listings || listings.length === 0) return null;

    const prices = listings.map(l => l.price);
    const pricePerSqftArray = listings
      .filter(l => l.carpet_area > 0)
      .map(l => l.price / l.carpet_area);

    return {
      city: "Pune", // Hardcoded based on your API key assignment
      total_listings: listings.length,
      median_price: getMedian(prices),
      median_price_per_sqft: Math.round(getMedian(pricePerSqftArray))
    };
  }, [listings]);

  if (status === 'loading') {
    return <div className="text-center py-10">Crunching analytics...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      <h2 className="text-3xl font-bold border-b pb-2">Market Insights & Data Audit</h2>

      {/* Promised Analytics Data - Calculated Client-Side */}
      <section>
        <h3 className="text-xl font-bold mb-4 text-gray-700">Calculated City Summary</h3>
        <p className="text-sm text-gray-500 mb-4 italic">
          * Note: The documented /v1/analytics/summary endpoint is broken/missing. These metrics are calculated dynamically from the verified data payload.
        </p>
        
        {analytics ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded shadow border text-center">
              <div className="text-sm text-gray-500">Total Valid Listings</div>
              <div className="font-bold text-3xl text-blue-600">{analytics.total_listings}</div>
            </div>
            <div className="bg-white p-4 rounded shadow border text-center">
              <div className="text-sm text-gray-500">Median Price</div>
              <div className="font-bold text-3xl text-green-600">
                ₹{(analytics.median_price / 100000).toFixed(2)} L
              </div>
            </div>
            <div className="bg-white p-4 rounded shadow border text-center">
              <div className="text-sm text-gray-500">Median Price / SqFt</div>
              <div className="font-bold text-3xl text-purple-600">
                ₹{analytics.median_price_per_sqft}
              </div>
            </div>
            <div className="bg-white p-4 rounded shadow border text-center">
              <div className="text-sm text-gray-500">City</div>
              <div className="font-bold text-3xl capitalize text-gray-700">{analytics.city}</div>
            </div>
          </div>
        ) : (
          <div className="text-gray-500">No data available to calculate insights.</div>
        )}
      </section>

      {/* The Detective Work (Your Discoveries) */}
      <section>
        <h3 className="text-xl font-bold mb-4 text-red-600">⚠️ Data Integrity Discoveries</h3>
        <div className="bg-white rounded shadow border overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3 border-b">Category</th>
                <th className="p-3 border-b">Documented Claim</th>
                <th className="p-3 border-b">Actual Reality (The Lie)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border-b font-bold text-sm">Authentication</td>
                <td className="p-3 border-b text-sm text-gray-600">Tokens valid for 24 hours. No refresh flow.</td>
                <td className="p-3 border-b text-sm text-gray-800">Tokens silently expire in exactly 15 minutes. A secret refresh endpoint must be used.</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="p-3 border-b font-bold text-sm">Units (Area)</td>
                <td className="p-3 border-b text-sm text-gray-600">Area is in integer square feet.</td>
                <td className="p-3 border-b text-sm text-gray-800">Dozens of listings supply values under 200, exposing they are in Square Meters.</td>
              </tr>
              <tr>
                <td className="p-3 border-b font-bold text-sm">Fraud</td>
                <td className="p-3 border-b text-sm text-gray-600">Listings are verified and safe to show users.</td>
                <td className="p-3 border-b text-sm text-gray-800">Multiple "verified" listings contain upfront deposit scams in descriptions. Filtered out client-side.</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="p-3 border-b font-bold text-sm">Data Consistency</td>
                <td className="p-3 border-b text-sm text-gray-600">Project total_listings always agrees with /v1/listings.</td>
                <td className="p-3 border-b text-sm text-gray-800">126 distinct projects have completely inaccurate total_listings counts.</td>
              </tr>
              <tr>
                <td className="p-3 border-b font-bold text-sm">Missing Endpoints</td>
                <td className="p-3 border-b text-sm text-gray-600">/v1/analytics/summary returns aggregated city data.</td>
                <td className="p-3 border-b text-sm text-gray-800">Endpoint returns a 404 Not Found error. All analytics must be calculated locally.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Insights;