import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { formatBits } from '../utils/Size';

export const fetchFiles = createAsyncThunk(
  'files/fetchFiles',
  async ({ email, token }, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/files/${email}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const bufferToUrl = (fileDataBufferObj, mimeType = 'application/pdf') => {
        const uint8Array = new Uint8Array(fileDataBufferObj.data);
        const blob = new Blob([uint8Array], { type: mimeType });
        return URL.createObjectURL(blob);
      };

      const filesWithUrls = res.data.map(file => ({
        ...file,
        size: formatBits(file.size),
        file_url: bufferToUrl(file.file_data, file.file_type || 'application/pdf'),
      }));
      console.log("file with urls:", filesWithUrls)
      return filesWithUrls;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const uploadFile = createAsyncThunk(
  'files/uploadFile',
  async ({ file, metadata, token }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('file_name', metadata.file_name);
      formData.append('type', metadata.type);
      formData.append('size', metadata.size);

      const res = await axios.post('/api/files', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteFile = createAsyncThunk(
  'files/deleteFile',
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`/api/files/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return { id }; 
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


const filesSlice = createSlice({
  name: 'files',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch files';
      })
      .addCase(uploadFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Upload failed';
      })
      .addCase(deleteFile.fulfilled, (state, action) => {
        state.items = state.items.filter(file => file.id !== action.payload.id);
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Delete failed';
      });
  },
});

export default filesSlice.reducer;
