import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, thunkAPI) => {
    const response = await fetch('https://solve.ivy.homes/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'IVY26-6E629ED6FBB5'
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    if (!response.ok) return thunkAPI.rejectWithValue(data.detail || 'Login failed');
    return data;
  }
);

export const refreshSession = createAsyncThunk(
  'auth/refreshSession',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const refresh_token = state.auth.refreshToken;
    
    const response = await fetch('https://solve.ivy.homes/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'IVY26-6E629ED6FBB5'
      },
      body: JSON.stringify({ refresh_token })
    });
    
    const data = await response.json();
    if (!response.ok) return thunkAPI.rejectWithValue('Refresh failed');
    return data;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    accessToken: null,
    refreshToken: null,
    user: null,
    status: 'idle',
    error: null
  },
  reducers: {
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.accessToken = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
        state.user = action.payload.user;
        state.status = 'succeeded';
      })
      .addCase(refreshSession.fulfilled, (state, action) => {
        state.accessToken = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;