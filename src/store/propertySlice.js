import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchAllListings = createAsyncThunk(
  'properties/fetchAllListings',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.accessToken; // Pulled safely from persisted state
    
    let allListings = [];
    let offset = 0;
    let hasMore = true;
    
    while (hasMore) {
      const response = await fetch(`https://solve.ivy.homes/v1/listings?limit=200&offset=${offset}`, {
        headers: {
          'X-API-Key': 'IVY26-6E629ED6FBB5',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (!response.ok) break;
      
      const validResults = data.results.filter(item => 
        item.is_live && !item.description.toLowerCase().includes('token amount')
      );
      
      allListings.push(...validResults);
      hasMore = data.has_more;
      offset += 200;
    }
    
    return allListings;
  }
);

const propertySlice = createSlice({
  name: 'properties',
  initialState: { listings: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllListings.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchAllListings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.listings = action.payload;
      })
      .addCase(fetchAllListings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export default propertySlice.reducer;