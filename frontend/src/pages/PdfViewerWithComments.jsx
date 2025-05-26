// components/PdfViewerWithComments.jsx
import React, { useState } from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { postComment } from '../redux/commentSlice';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, Strikethrough } from 'lucide-react';

const PdfViewerWithComments = ({ open, onClose, pdfUrl, fileId, user }) => {
    const dispatch = useDispatch();
    const { items: comments, loading: commentsLoading } = useSelector((state) => state.comments);
    const editor = useEditor({
        extensions: [StarterKit],
        content: '',
    });

    const handlePostComment = () => {
        const html = editor?.getHTML();
        if (html && html.trim() !== '<p></p>') {
            dispatch(postComment({
                text: html,
                commenter_email: user?.email,
                commenter_name: user?.name,
                file_id: fileId
            }));
            editor.commands.clearContent();
        }
    };

    if (!open) return null;

    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'row', padding: 4 }}>
            <Box sx={{ flex: 1 }}>
                <iframe
                    src={pdfUrl}
                    title="PDF Preview"
                    width="100%"
                    height="100%"
                    style={{ border: 'none' }}
                />
            </Box>

            <Box sx={{ width: 340, p: 2, flexShrink: 0 }}>
                <Typography variant="h6" gutterBottom>Comments</Typography>

                <Box
                    sx={{
                        maxHeight: "65%",
                        overflowY: 'auto',
                        backgroundColor: '#f4f4f4',
                        borderRadius: 1,
                        p: 1,
                        mb: 2,
                    }}
                >
                    {commentsLoading ? (
                        <Typography variant="body2">Loading comments...</Typography>
                    ) : comments.length === 0 ? (
                        <Typography variant="body2" color="text.secondary">No comments yet.</Typography>
                    ) : (
                        comments.map((c, i) => (
                            <Box key={i} sx={{ mb: 1 }}>
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                    {c.commenter_name || 'Anonymous'}:
                                </Typography>
                                <Typography
                                    variant="body2"
                                    component="div"
                                    dangerouslySetInnerHTML={{ __html: c.text }}
                                />
                            </Box>
                        ))
                    )}
                </Box>

                {/* Rich Text Toolbar */}
                <Box sx={{ mb: 1, display: 'flex', gap: 1 }}>
                    <IconButton onClick={() => editor.chain().focus().toggleBold().run()} color={editor?.isActive('bold') ? 'primary' : 'default'}>
                        <Bold size={18} />
                    </IconButton>
                    <IconButton onClick={() => editor.chain().focus().toggleItalic().run()} color={editor?.isActive('italic') ? 'primary' : 'default'}>
                        <Italic size={18} />
                    </IconButton>
                    <IconButton onClick={() => editor.chain().focus().toggleStrike().run()} color={editor?.isActive('strike') ? 'primary' : 'default'}>
                        <Strikethrough size={18} />
                    </IconButton>
                </Box>

                {/* Editor & Post Button */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <EditorContent
                        editor={editor}
                        style={{
                            border: '1px solid #ccc',
                            borderRadius: 4,
                            padding: 10,
                            minHeight: 100,
                            background: '#fff'
                        }}
                    />
                    <Button variant="contained" onClick={handlePostComment}>
                        Post
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default PdfViewerWithComments;
