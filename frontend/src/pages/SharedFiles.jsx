import React, { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import { DataGrid } from '@mui/x-data-grid';
import {Dialog, Box, Link, Typography, Tooltip } from '@mui/material';
import Groups2RoundedIcon from '@mui/icons-material/Groups2Rounded';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllShared } from '../redux/sharedSlice';
import { currentTime } from '../utils/Time';
import dayjs from 'dayjs';
import PdfViewerWithComments from './PdfViewerWithComments';
import { fetchComments } from '../redux/commentSlice';

function SharedFiles() {
    const user = JSON.parse(localStorage.getItem("user")); 
    const email = user?.email;
    const dispatch = useDispatch();
    const { items, loading } = useSelector((state) => state.shared);

    const [openViewer, setOpenViewer] = useState(false);
    const [selectedPdf, setSelectedPdf] = useState(null);
    const [selectedFileId, setSelectedFileId] = useState(null);

    useEffect(() => {
        if (email) {
            dispatch(fetchAllShared(email));
        }
    }, [email, dispatch]);

    const handleOpenViewer = (file) => {
        setSelectedPdf(file.file_url);
        setSelectedFileId(file.id);
        setOpenViewer(true);
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'filename',
            headerName: 'File Name',
            width: 200,
            renderCell: (params) => (
                <Link
                    component="button"
                    onClick={() =>{ dispatch(fetchComments(params.row.id)); handleOpenViewer(params.row)}}
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
        // {
        //     field: 'delete',
        //     headerName: 'Delete',
        //     width: 100,
        //     sortable: false,
        //     renderCell: (params) => (
        //         <Tooltip title="Delete File">
        //             <IconButton
        //                 color="error"
        //                 onClick={() => alert(`Delete file with id: ${params.row.id}`)}
        //             >
        //                 <DeleteOutlineRoundedIcon />
        //             </IconButton>
        //         </Tooltip>
        //     ),
        // },
        // {
        //     field: 'share',
        //     headerName: 'Share',
        //     width: 100,
        //     sortable: false,
        //     renderCell: (params) => (
        //         <Tooltip title="Share File">
        //             <IconButton
        //                 color="primary"
        //                 onClick={() => alert(`Share file with id: ${params.row.id}`)}
        //             >
        //                 <ShareRoundedIcon />
        //             </IconButton>
        //         </Tooltip>
        //     ),
        // },
    ];

    const rows = items?.map((file) => ({
        id: file.id,
        filename: file.filename,
        uploaded_by: file.owner_email,
        uploaded_at: dayjs(file.uploaded_at).format('YYYY-MM-DD HH:mm'),
        file_url: file?.file_url,
        size: file.size,
    })) || [];

    return (
        <Box sx={{ p: "32px 5% 20px 5%" }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
                <Box sx={{ flex: 1 }}>
                    <Typography sx={{ display: "flex", alignItems: "center", fontFamily: "Lexend", fontSize: 22, fontWeight: 500 }}>
                        <Groups2RoundedIcon sx={{ mr: 1.5 }} /> Shared Files
                    </Typography>
                    <Typography sx={{ color: "#5C5C5C" }}>Documents and PDFs shared with you</Typography>
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

            
                <Dialog
                    open={openViewer}
                    onClose={() => setOpenViewer(false)}
                    fullWidth
                    maxWidth="lg"
                >
                    <PdfViewerWithComments
                        open={openViewer}
                        onClose={() => setOpenViewer(false)}
                        pdfUrl={selectedPdf}
                        fileId={selectedFileId}
                        user={user}
                    /> </Dialog>
            
        </Box>
    );
}

export default SharedFiles;
