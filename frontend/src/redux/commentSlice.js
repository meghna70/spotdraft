import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL; 

export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async (fileId, thunkAPI) => {
    try {
      const res = await axios.get(`${API_URL}/api/comments/${fileId}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || 'Failed to fetch comments');
    }
  }
);

export const postComment = createAsyncThunk(
  'comments/postComment',
  async ({ text, commenter_email, commenter_name, file_id }, thunkAPI) => {
    try {
      const res = await axios.post(`${API_URL}/api/comments`, {
        text,
        commenter_email,
        commenter_name,
        file_id,
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || 'Failed to post comment');
    }
  }
);

const commentSlice = createSlice({
  name: 'comments',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearComments: (state) => {
      state.items = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(postComment.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(postComment.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearComments } = commentSlice.actions;

export default commentSlice.reducer;
