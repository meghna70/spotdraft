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
import { fetchComments, postComment } from '../redux/commentSlice';
import dayjs from 'dayjs';
import ShareFileDialog from './ShareFileDialog';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import PdfViewerWithComments from './PdfViewerWithComments';

function Home() {

    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('user'));
    const { items, loading } = useSelector((state) => state.shared);
    // const { ownItems, loadingOwnItems } = useSelector((state) => state.files);
    const { items: ownItems, loading: loadingOwnItems } = useSelector((state) => state.files);

    const [pdfModalOpen, setPdfModalOpen] = useState(false);
    const [currentPdfUrl, setCurrentPdfUrl] = useState('');
    const [commentingOnFileId, setCommentingOnFileId] = useState(null);
    const [shareDialogOpen, setShareDialogOpen] = useState(false);
    const [shareEmail, setShareEmail] = useState('');
    const [shareStatus, setShareStatus] = useState(null);
    const [copySuccess, setCopySuccess] = useState(false)
    const [shareFileId, setShareFileId] = useState(null);
   
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


    useEffect(() => {
        if (user) {
            dispatch(fetchRecentShared(user.email));
            dispatch(fetchFiles({ email: user.email, token: user.token }));
            console.log("own items:", ownItems)
        }
    }, [dispatch]);

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'filename',
            headerName: 'File Name',
            width: 120,
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
        <div style={{ padding: "32px 5% 20px 5%" }}>
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <div style={{ width: "50%", fontFamily: "Lexend", fontSize: "22px", fontWeight: 500 }}>
                    Dashboard
                    <div style={{ color: "#5C5C5C" }}>Documents, Folders</div>
                </div>
                <div style={{
                    width: "50%", display: "flex",
                    flexDirection: "row", alignItems: "center", justifyContent: "space-between"
                }}>
                    <Paper
                        component="form"
                        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 300 }}>
                        <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="Search files"
                            inputProps={{ 'aria-label': 'search files' }}
                        />
                        <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                            <SearchIcon />
                        </IconButton>
                    </Paper>
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                        <CalendarTodayIcon style={{ color: "#5C5C5C", margin: "0px 12px" }} />
                        {currentTime()}
                    </div>
                </div>
            </div>

            <div style={{
                padding: "32px 0px", display: "flex",
                flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between"
            }}>
                <div style={{ width: "55%" }}>
                    <Hello />
                    <Box style={{ padding: "32px 0px" }}>
                        <Typography style={{
                            color: "#5C5C5C", paddingBottom: "32px",
                            display: "flex", flexDirection: "row", alignItems: "center",
                            fontFamily: "Lexend", fontSize: "22px", fontWeight: 500
                        }}>
                            <Groups2RoundedIcon sx={{ mr: "12px" }} />
                            Recently Shared
                        </Typography>
                        <Box sx={{ width: '100%' }}>
                            <DataGrid
                                columns={columns}
                                rows={rows}
                                loading={loading}
                                rowHeight={38}
                                disableRowSelectionOnClick
                            />
                        </Box>
                    </Box>
                </div>
                <div style={{ width: "35%" }}>
                    <StoargePercent />
                    <div style={{ color: "#5C5C5C", fontFamily: "Lexend", fontSize: "22px", fontWeight: 500 }}>
                        Recently Uploaded
                    </div>
                    <div style={{ marginTop: "12px" }}>
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
                    </div>
                </div>
            </div>
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
        </div>
    );
}

export default Home;
