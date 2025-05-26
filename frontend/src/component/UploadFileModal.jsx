import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Fade,
  Backdrop,
  CircularProgress,
  IconButton,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

export default function UploadFileModal({ open, handleClose, ownerEmail }) {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type === 'application/pdf') {
      setFile(selected);
    } else {
      alert('Please select a PDF file');
    }
  };

  const handleUpload = async () => {
    if (!title || !file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('pdf', file);
      formData.append('title', title);
      formData.append('owner_email', ownerEmail);

      const response = await axios.post('http://localhost:5000/api/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload success:', response.data);
      handleClose();
      setTitle('');
      setFile(null);
    } catch (err) {
      console.error('Upload error:', err);
      alert('Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Box sx={style}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Upload PDF</Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Button
            variant="outlined"
            startIcon={<UploadFileIcon />}
            component="label"
          >
            {file ? file.name : 'Select PDF'}
            <input
              type="file"
              hidden
              accept="application/pdf"
              onChange={handleFileChange}
            />
          </Button>

          <Button
            variant="contained"
            endIcon={!uploading ? <CloudUploadIcon /> : <CircularProgress size={20} color="inherit" />}
            onClick={handleUpload}
            disabled={!title || !file || uploading}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </Box>
      </Fade>
    </Modal>
  );
}
