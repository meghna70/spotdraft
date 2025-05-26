import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/users'; 

export const signUp = createAsyncThunk('user/signUp', async (userData, thunkAPI) => {
  try {
    const res = await axios.post(`${API_URL}/signup`, userData);
    return res.data.user;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.error || 'Sign up failed');
  }
});

export const signIn = createAsyncThunk('user/signIn', async (credentials, thunkAPI) => {
  try {
    const res = await axios.post(`${API_URL}/signin`, credentials);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.error || 'Sign in failed');
  }
});

export const newPassword = createAsyncThunk('user/newPassword', async (newCred, thunkAPI) => {
  try {
    const res = await axios.put(`${API_URL}/newPassword`, newCred);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.error || 'Password reset failed');
  }
});

export const sendOtp = createAsyncThunk('user/sendOtp', async (email, thunkAPI) => {
  try {
    const res = await axios.post(`${API_URL}/sendotp`, { email });
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to send OTP');
  }
});

export const verifyOtp = createAsyncThunk(
  'user/verifyOtp',
  async ({ email, otp }, thunkAPI) => {
    try {
      const res = await axios.post(`${API_URL}/verifyotp`, { email, otp });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'OTP verification failed');
    }
  }
);


const savedUser = localStorage.getItem('user');
const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: savedUser ? JSON.parse(savedUser) : null,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.error = null;
      state.successMessage = null;
      localStorage.removeItem('user');
    },
    clearMessages(state) {
      state.error = null;
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Sign Up
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Sign In
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // New Password
      .addCase(newPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(newPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload?.message || 'Password reset successful';
      })
      .addCase(newPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Send OTP
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Verify OTP
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload?.message || 'OTP verified successfully';
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;
