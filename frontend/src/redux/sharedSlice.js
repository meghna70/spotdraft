import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

export const fetchAllShared = createAsyncThunk(
  'shared/fetchAllShared',
  async (email, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/shared/sharedFiles/${email}`);

      const bufferToUrl = (fileDataBufferObj, mimeType = 'application/pdf') => {
        const uint8Array = new Uint8Array(fileDataBufferObj.data);
        const blob = new Blob([uint8Array], { type: mimeType });
        return URL.createObjectURL(blob);
      };

      const sharedFilesWithUrls = res.data.map(file => ({
        ...file,
        file_url: bufferToUrl(file.file_data, file.file_type || 'application/pdf'),
      }));

      return sharedFilesWithUrls;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


export const fetchRecentShared = createAsyncThunk(
  'shared/fetchRecentShared',
  async (email, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/shared/sharedFiles/${email}?limit=5`);

      const bufferToUrl = (fileDataBufferObj, mimeType = 'application/pdf') => {
        const uint8Array = new Uint8Array(fileDataBufferObj.data);
        const blob = new Blob([uint8Array], { type: mimeType });
        return URL.createObjectURL(blob);
      };

      const recentSharedFilesWithUrls = res.data.map(file => ({
        ...file,
        file_url: bufferToUrl(file.file_data, file.file_type || 'application/pdf'),
      }));

      return recentSharedFilesWithUrls;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


export const shareFileByLink = createAsyncThunk(
  'shared/shareFileByLink',
  async ({ fileId }) => {
    const res = await axios.post(`${BASE_URL}/api/shared/link`, { fileId });
    return res.data; 
  }
);

export const shareFileByEmail = createAsyncThunk(
  'shared/shareFileByEmail',
  async ({ file_id, user_name, user_email, role }) => {
    const res = await axios.post(`${BASE_URL}/api/shared/email `, {
      file_id,
      user_name,
      user_email,
      role,
    });
    return res.data; 
  }
);

export const getFileByLinkId = createAsyncThunk(
  'shared/getFileByLinkId',
  async (linkId) => {
    const res = await axios.get(`${BASE_URL}/api/shared/link/${linkId}`);
    return res.data;
  }
);

const sharedSlice = createSlice({
  name: 'shared',
  initialState: {
    items: [],
    loading: false,
    error: null,
    publicLinkInfo: null,    
    shareLinkStatus: null,   
    shareEmailStatus: null,  
  },
  reducers: {
    clearPublicLinkInfo(state) {
      state.publicLinkInfo = null;
      state.shareLinkStatus = null;
      state.shareEmailStatus = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllShared.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllShared.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchAllShared.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchRecentShared.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentShared.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchRecentShared.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(shareFileByLink.pending, (state) => {
        state.shareLinkStatus = 'loading';
        state.error = null;
      })
      .addCase(shareFileByLink.fulfilled, (state, action) => {
        state.shareLinkStatus = 'succeeded';
        state.publicLinkInfo = action.payload; 
      })
      .addCase(shareFileByLink.rejected, (state, action) => {
        state.shareLinkStatus = 'failed';
        state.error = action.error.message;
      })

      .addCase(shareFileByEmail.pending, (state) => {
        state.shareEmailStatus = 'loading';
        state.error = null;
      })
      .addCase(shareFileByEmail.fulfilled, (state, action) => {
        state.shareEmailStatus = 'succeeded';
      })
      .addCase(shareFileByEmail.rejected, (state, action) => {
        state.shareEmailStatus = 'failed';
        state.error = action.error.message;
      })

      .addCase(getFileByLinkId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFileByLinkId.fulfilled, (state, action) => {
        state.loading = false;
        state.publicLinkInfo = action.payload;
      })
      .addCase(getFileByLinkId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearPublicLinkInfo } = sharedSlice.actions;
export default sharedSlice.reducer;
