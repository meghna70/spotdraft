import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Divider,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useDispatch, useSelector } from 'react-redux';
import { uploadFile } from '../redux/fileSlice';

const style = {
  maxWidth: 400,
  margin: 'auto',
  bgcolor: '#fff',
  borderRadius: 4,
  boxShadow: 3,
  p: 4,
};

export default function AddFile() {
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState(null);
  const { loading, error } = useSelector((state) => state.files);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setSelectedFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    const token = JSON.parse(localStorage.getItem('user')).token;
    if (!token) {
      console.error('No auth token found');
      return;
    }

    const metadata = {
      file_name: selectedFile.name,
      type: selectedFile.type,
      size: selectedFile.size,
    };

    dispatch(uploadFile({ file: selectedFile, metadata, token }));
  };

  return (
    <Box sx={style}>
      <Typography variant="h6" mb={2} textAlign="center">
        Upload
      </Typography>

      <Box
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        sx={{
          border: '2px dashed #aaa',
          borderRadius: 2,
          textAlign: 'center',
          p: 4,
          mb: 2,
          bgcolor: '#fafafa',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: '#673ab7',
            backgroundColor: '#f3e5f5',
          },
        }}
      >
        <CloudUploadIcon color="action" sx={{ fontSize: 40, mb: 1 }} />
        <Typography variant="body1">
          Drag & drop files or{' '}
          <label htmlFor="fileInput" style={{ color: '#3f51b5', cursor: 'pointer' }}>
            Browse
          </label>
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Supported formats: JPEG, PNG, GIF, MP4, PDF, PSD, AI, Word, PPT
        </Typography>
        <input
          id="fileInput"
          type="file"
          accept=".pdf,.jpeg,.jpg,.png,.gif,.mp4,.psd,.ai,.doc,.docx,.ppt,.pptx"
          hidden
          onChange={handleFileChange}
        />
      </Box>

      {selectedFile && (
        <Stack spacing={1} mb={2}>
          <Typography fontSize={14}>Selected: {selectedFile.name}</Typography>
          <Divider />
        </Stack>
      )}

      {error && (
        <Typography color="error" fontSize={14} mb={1}>
          {error}
        </Typography>
      )}

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleUpload}
        disabled={!selectedFile || loading}
        sx={{
          textTransform: 'none',
          bgcolor: '#9575cd',
          '&:hover': { bgcolor: '#7e57c2' },
        }}
      >
        {loading ? 'Uploading...' : 'Upload File'}
      </Button>
    </Box>
  );
}
