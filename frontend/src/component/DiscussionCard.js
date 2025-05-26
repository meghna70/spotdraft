import React from 'react';
import Card from '@mui/joy/Card';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import Box from '@mui/joy/Box';
import { CssVarsProvider } from '@mui/joy/styles';
import { fetchComments } from '../redux/commentSlice';
import { useDispatch } from 'react-redux';

export default function DiscussionCard(props) {
    const dispatch = useDispatch();

    const handleViewClick = () => {
        console.log("click");
        props.setCurrentPdfUrl(props.file_link);
        props.setCommentingOnFileId(props.id);
        props.setPdfModalOpen(true);
        dispatch(fetchComments(props.id));
    };

    return (
        <CssVarsProvider>
            <Card
                sx={{
                    width: 400,
                    height: 170,
                    zIndex: 0,
                    mb: 2,
                    borderRadius: '20px',
                    background: props.bgColor || 'linear-gradient(135deg, #74b9ff 0%, #a29bfe 100%)',
                    color: 'white',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    p: 2,
                    position: "relative"
                }}
            >
                {/* FILE INFO */}
                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography level="title-lg" sx={{ color:"#f2f2f2", fontWeight: 'bold' }}>
                            {props.filename}
                        </Typography>
                        <Typography level="body-sm">{props.size}</Typography>
                    </Box>
                    <Typography level="body-sm" sx={{ mt: 0.5 }}>
                        Uploaded at {props.date}
                    </Typography>
                </Box>

                {/* ACTION BUTTONS */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', gap: 1, zIndex: 2 }}>
                        <Button onClick={handleViewClick} size="sm" variant="soft" color="neutral">
                            View
                        </Button>
                        <Button onClick={()=>props.handleShareClick(props.id)} size="sm" variant="soft" color="primary">
                            Share
                        </Button>
                    </Box>
                </Box>

                {/* BACKGROUND CIRCLE */}
                <Box
                    sx={{
                        pointerEvents: 'none',
                        filter: `drop-shadow(0 0 0.75rem ${props.shadowColor || '#a29bfe'})`,
                        transform: "rotate(45deg)",
                        zIndex: -1,
                        width: "200px",
                        height: "220px",
                        position: "absolute",
                        top: "-20%",
                        right: "-5%",
                        backgroundColor: props.shapeColor || "#ffffff33",
                        borderRadius: "50%",
                    }}
                />
            </Card>
        </CssVarsProvider>
    );
}
