import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, InputBase, Button } from '@mui/material';

const ShareFileDialog = ({
    open,
    onClose,
    email,
    setEmail,
    onShareByEmail,
    onShareByLink,
    disabled
}) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Share File</DialogTitle>
            <DialogContent>
                <Typography sx={{ mb: 1 }}>Share by Email:</Typography>
                <InputBase
                    autoFocus
                    fullWidth
                    placeholder="Enter email to share with"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ mb: 2, px: 1, py: 0.5, border: '1px solid #ccc', borderRadius: 1 }}
                />
                <Typography sx={{ textAlign: 'center', my: 2 }}>OR</Typography>
                <Typography sx={{ mb: 1 }}>Share with Everyone (Generate public link):</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={onShareByEmail} disabled={disabled} variant="contained">
                    Share by Email
                </Button>
                <Button onClick={onShareByLink} variant="outlined" color="secondary">
                    Share with Everyone
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ShareFileDialog;
