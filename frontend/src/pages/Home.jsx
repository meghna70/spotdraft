import React, { useEffect, useState } from 'react';
import StoargePercent from '../component/StoargePercent';
import Hello from '../component/Hello';
import SearchIcon from '@mui/icons-material/Search';
import { currentTime } from '../utils/Time';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography, Link } from '@mui/material';
import Groups2RoundedIcon from '@mui/icons-material/Groups2Rounded';
import DiscussionCard from '../component/DiscussionCard';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecentShared, shareFileByEmail, shareFileByLink } from '../redux/sharedSlice';
import { fetchFiles } from '../redux/fileSlice';
import { fetchComments } from '../redux/commentSlice';
import dayjs from 'dayjs';
import ShareFileDialog from './ShareFileDialog';
import Dialog from '@mui/material/Dialog';
import PdfViewerWithComments from './PdfViewerWithComments';


function Home() {
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('user'));
    const { items, loading } = useSelector((state) => state.shared);
    const { items: ownItems } = useSelector((state) => state.files);

    const [pdfModalOpen, setPdfModalOpen] = useState(false);
    const [currentPdfUrl, setCurrentPdfUrl] = useState('');
    const [commentingOnFileId, setCommentingOnFileId] = useState(null);
    const [shareDialogOpen, setShareDialogOpen] = useState(false);
    const [shareEmail, setShareEmail] = useState('');
    const [shareStatus, setShareStatus] = useState(null);
    const [copySuccess, setCopySuccess] = useState(false);
    const [shareFileId, setShareFileId] = useState(null);
    console.log(shareStatus, copySuccess)
    const handleShareClick = (fileId) => {
        setShareFileId(fileId);
        setShareEmail('');
        setShareDialogOpen(true);
        setShareStatus(null);
        setCopySuccess(false);
    };

    const handleShareByEmail = async () => {
        if (!shareEmail.trim()) return;
        try {
            setShareStatus('loading');
            await dispatch(shareFileByEmail({
                file_id: shareFileId,
                user_name: user.name || 'User',
                user_email: shareEmail,
                role: 'viewer',
            })).unwrap();
            setShareStatus('success');
            setShareDialogOpen(false);
            alert(`File shared with ${shareEmail}`);
        } catch (error) {
            setShareStatus('error');
            alert(`Error sharing file: ${error.message}`);
        }
    };

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

    useEffect(() => {
        if (user?.email && user?.token) {
          dispatch(fetchRecentShared(user.email));
          dispatch(fetchFiles({ email: user.email, token: user.token }));
        }
      }, [dispatch, user.email, user.token]);
      

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'filename',
            headerName: 'File Name',
            width: 120,
            renderCell: (params) => (
                <Link
                    onClick={() => {
                        setCurrentPdfUrl(params.row.file_link);
                        setCommentingOnFileId(params.row.id);
                        setPdfModalOpen(true);
                        dispatch(fetchComments(params.row.id));
                    }}
                    sx={{ color: "#1976d2", textDecoration: "underline", cursor: "pointer" }}
                >
                    {params.row.filename}
                </Link>
            )
        },
        { field: 'uploaded_by', headerName: 'Uploaded By', width: 200 },
        { field: 'uploaded_at', headerName: 'Uploaded At', width: 180 },
        { field: 'size', headerName: 'Size', width: 100 },
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
        <Box sx={{ padding: "32px 5% 20px 5%" }}>
            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, alignItems: "center", mb: 4 }}>
                <Box sx={{ width: { xs: "100%", md: "50%" } }}>
                    <Typography sx={{ fontFamily: "Lexend", fontSize: "22px", fontWeight: 500 }}>
                        Dashboard
                    </Typography>
                    <Typography sx={{ color: "#5C5C5C" }}>Documents, Folders</Typography>
                </Box>
                <Box
                    sx={{
                        width: { xs: "100%", md: "50%" },
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        alignItems: "center",
                        justifyContent: "space-between",
                        mt: { xs: 2, md: 0 },
                        gap: 2
                    }}
                >
                    <Paper component="form" sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 300 }}>
                        <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="Search files"
                            inputProps={{ 'aria-label': 'search files' }}
                        />
                        <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                            <SearchIcon />
                        </IconButton>
                    </Paper>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <CalendarTodayIcon sx={{ color: "#5C5C5C", mx: 1 }} />
                        {currentTime()}
                    </Box>
                </Box>
            </Box>

            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    justifyContent: "space-between",
                    alignItems: { xs: "stretch", md: "flex-start" },
                    gap: 4,
                    paddingTop: 4
                }}
            >
                <Box sx={{ width: { xs: "100%", md: "55%" } }}>
                    <Hello />
                    <Box sx={{ pt: 4 }}>
                        <Typography sx={{
                            color: "#5C5C5C",
                            pb: 4,
                            display: "flex",
                            alignItems: "center",
                            fontFamily: "Lexend",
                            fontSize: "22px",
                            fontWeight: 500
                        }}>
                            <Groups2RoundedIcon sx={{ mr: 2 }} />
                            Recently Shared
                        </Typography>
                        <Box sx={{ width: '100%' }}>
                            <DataGrid
                                columns={columns}
                                rows={rows}
                                loading={loading}
                                rowHeight={38}
                                disableRowSelectionOnClick
                                autoHeight
                            />
                        </Box>
                    </Box>
                </Box>

                <Box sx={{ width: { xs: "100%", md: "35%" } }}>
                    <StoargePercent />
                    <Typography sx={{ color: "#5C5C5C", fontFamily: "Lexend", fontSize: "22px", fontWeight: 500 }}>
                        Recently Uploaded
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                        {ownItems?.slice(0, 2).map((file, idx) => (
                            <DiscussionCard
                                key={file.id}
                                setPdfModalOpen={setPdfModalOpen}
                                setCurrentPdfUrl={setCurrentPdfUrl}
                                handleShareClick={handleShareClick}
                                setCommentingOnFileId={setCommentingOnFileId}
                                bgColor={idx === 0 ? "#85BFF8" : "#FFD178"}
                                shapeColor={idx === 0 ? "#A8C9F2" : "#FFDB94"}
                                shadowColor={idx === 0 ? "#6B9DED" : "#F3AD45"}
                                id={file.id}
                                filename={file.filename}
                                file_link={file.file_url}
                                size={file.size}
                                owner={file.owner_email}
                                date={dayjs(file.uploaded_at).format('YYYY-MM-DD HH:mm')}
                            />
                        ))}
                    </Box>
                </Box>
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
        </Box>
    );
}

export default Home;
