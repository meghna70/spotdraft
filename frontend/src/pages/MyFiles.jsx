import React, { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Link, Typography, Tooltip } from '@mui/material';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { useDispatch, useSelector } from 'react-redux';
import { deleteFile, fetchFiles } from '../redux/fileSlice';
import { shareFileByEmail, shareFileByLink } from '../redux/sharedSlice';
import { fetchComments } from '../redux/commentSlice';
import { currentTime } from '../utils/Time';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import dayjs from 'dayjs';
import PdfViewerWithComments from './PdfViewerWithComments';
import ShareFileDialog from './ShareFileDialog';

function MyFiles() {
    const dispatch = useDispatch();
    const { items, loading } = useSelector((state) => state.files);

    const user = JSON.parse(localStorage.getItem('user'));
    // const token =(localStorage.getItem('authToken'));

    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedFileId, setSelectedFileId] = useState(null);

    const [pdfModalOpen, setPdfModalOpen] = useState(false);
    const [currentPdfUrl, setCurrentPdfUrl] = useState('');

    const [commentingOnFileId, setCommentingOnFileId] = useState(null);

    const [shareDialogOpen, setShareDialogOpen] = useState(false);
    const [shareFileId, setShareFileId] = useState(null);
    const [shareEmail, setShareEmail] = useState('');
    const [shareStatus, setShareStatus] = useState(null);
    const [copySuccess, setCopySuccess] = useState(false);
    console.log(shareStatus, copySuccess)
    useEffect(() => {
        if (user.email && user.token) {
            dispatch(fetchFiles({ email: user.email, token: user.token }));
        }
    }, [ user.token, user.email, dispatch]);

    const handleShareClick = (fileId) => {
        setShareFileId(fileId);
        setShareEmail('');
        setShareDialogOpen(true);
        setShareStatus(null);
        setCopySuccess(false);
    };

    const handleShareByEmail = async () => {
        if (!shareEmail.trim()) return; // ignore empty
        try {
            setShareStatus('loading');
            await dispatch(shareFileByEmail({
                file_id: shareFileId,
                user_name: user.name || 'User',
                user_email: shareEmail,
                role: 'viewer', // or whatever role you want
            })).unwrap();
            setShareStatus('success');
            setShareDialogOpen(false);
            alert(`File shared with ${shareEmail}`);
        } catch (error) {
            setShareStatus('error');
            alert(`Error sharing file: ${error.message}`);
        }
    };
    // Share by Link

    const handleShareByLink = async () => {
        try {
            setShareStatus('loading');
            const result = await dispatch(shareFileByLink({ fileId: shareFileId })).unwrap();
            const link = result.link || result.file_link || '';
            if (link) {
                await navigator.clipboard.writeText(link);
                setCopySuccess(true);
                setShareDialogOpen(false);


                alert('Public link copied to clipboard!');
            } else {
                throw new Error('No link returned');
            }
        } catch (error) {
            setShareStatus('error');
            alert(`Error generating link: ${error.message}`);
        }
    };
    const handleDeleteFile = async () => {
        if (user && selectedFileId !== null) {
            const resultAction = await dispatch(deleteFile({ id: selectedFileId, token: user.token }));
            if (deleteFile.fulfilled.match(resultAction)) {
                setSnackbarOpen(true);
            }
            setDeleteDialogOpen(false);
            setSelectedFileId(null);
        }
    }

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'filename',
            headerName: 'File Name',
            width: 200,
            renderCell: (params) => (
                <Link
                    // href={params.row.file_link}
                    // target="_blank"
                    // rel="noopener noreferrer"
                    onClick={() => {
                        setCurrentPdfUrl(params.row.file_link);
                        setCommentingOnFileId(params.row.id);
                        setPdfModalOpen(true);
                        dispatch(fetchComments(params.row.id));
                    }}
                    sx={{ color: "#1976d2", textDecoration: "underline" }}
                >
                    {params.row.filename}
                </Link>
            )
        },
        { field: 'uploaded_by', headerName: 'Uploaded By', width: 200 },
        {
            field: 'uploaded_at',
            headerName: 'Uploaded At',
            width: 180,
        },
        { field: 'size', headerName: 'Size', width: 100 },
        {
            field: 'delete',
            headerName: 'Delete',
            width: 100,
            sortable: false,
            renderCell: (params) => (
                <Tooltip title="Delete File">
                    <IconButton
                        color="error"
                        onClick={() => {
                            setSelectedFileId(params.row.id);
                            setDeleteDialogOpen(true);
                        }}
                    >
                        <DeleteOutlineRoundedIcon />
                    </IconButton>
                </Tooltip>
            ),
        },
        {
            field: 'share',
            headerName: 'Share',
            width: 100,
            sortable: false,
            renderCell: (params) => (
                <Tooltip title="Share File">
                    <IconButton
                        color="primary"
                        onClick={() => handleShareClick(params.row.id)}
                    >
                        <ShareRoundedIcon />
                    </IconButton>
                </Tooltip>
            ),
        },
    ];

    const rows = items?.map((file) => ({
        id: file.id,
        filename: file.filename,
        uploaded_by: file.owner_email,
        uploaded_at: dayjs(file.uploaded_at).format('YYYY-MM-DD HH:mm'),
        file_link: file?.file_url,
        size: file.size,
    })) || [];

    return (
        <Box sx={{ p: "32px 5% 20px 5%" }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
                <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontFamily: "Lexend", fontSize: 22, fontWeight: 500 }}>
                        My Files
                    </Typography>
                    <Typography sx={{ color: "#5C5C5C" }}>Documents, Folders</Typography>
                </Box>
                <Box sx={{ flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Paper
                        component="form"
                        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 300 }}
                    >
                        <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="Search files"
                            inputProps={{ 'aria-label': 'search files' }}
                        />
                        <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                            <SearchIcon />
                        </IconButton>
                    </Paper>
                    <Box sx={{ display: "flex", alignItems: "center", color: "#5C5C5C", ml: 2 }}>
                        <CalendarTodayIcon sx={{ mr: 1 }} />
                        {currentTime()}
                    </Box>
                </Box>
            </Box>

            <Box>
                {/* <Typography
                    sx={{
                        color: "#5C5C5C",
                        pb: 4,
                        display: "flex",
                        alignItems: "center",
                        fontFamily: "Lexend",
                        fontSize: 22,
                        fontWeight: 500,
                    }}
                >
                    <Groups2RoundedIcon sx={{ mr: 1.5 }} /> Recently Shared
                </Typography> */}
                <DataGrid
                    sx={{ maxWidth: "100vw" }}
                    columns={columns}
                    rows={rows}
                    loading={loading}
                    rowHeight={38}
                    checkboxSelection
                    disableRowSelectionOnClick
                    autoHeight
                />
            </Box>
            <ShareFileDialog
                open={shareDialogOpen}
                onClose={() => setShareDialogOpen(false)}
                email={shareEmail}
                setEmail={setShareEmail}
                onShareByEmail={handleShareByEmail}
                onShareByLink={handleShareByLink}
                disabled={!shareEmail.trim()}
            />


            <Dialog
                sx={{ height: '100vh', display: 'flex', flexDirection: 'column', padding: 4 }}
                open={pdfModalOpen}
                onClose={() => setPdfModalOpen(false)}
                fullWidth
                maxWidth="lg"
            >
                <Box sx={{ height: '80vh', display: 'flex', flexDirection: 'row', padding: 4 }}>
                    {/* current PDF viewer UI */}
                </Box>
            </Dialog>
            <Dialog
                open={pdfModalOpen}
                onClose={() => setPdfModalOpen(false)}
                fullWidth
                maxWidth="lg"
            >
                <PdfViewerWithComments
                    open={pdfModalOpen}
                    onClose={() => setPdfModalOpen(false)}
                    pdfUrl={currentPdfUrl}
                    fileId={commentingOnFileId}
                    user={user}
                />
            </Dialog>



            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this file?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteFile} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <MuiAlert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    File deleted successfully!
                </MuiAlert>
            </Snackbar>
        </Box>
    );
}

export default MyFiles;
