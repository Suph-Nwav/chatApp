'use client';

import { useState, useRef, useEffect } from 'react';
import { Box, TextField, IconButton, Typography } from '@mui/material';
import { Send, AddCircleOutline, Close, InsertDriveFile } from '@mui/icons-material';

interface MessageInputProps {
    onSend: (content: string, file?: File) => void;
    disabled?: boolean;
}

export default function MessageInput({ onSend, disabled = false }: MessageInputProps) {
    const [message, setMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!selectedFile) {
            setPreviewUrl(null);
            return;
        }
        if (selectedFile.type.startsWith('image/') || selectedFile.type.startsWith('video/')) {
            const objectUrl = URL.createObjectURL(selectedFile);
            setPreviewUrl(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        } else {
            setPreviewUrl(null);
        }
    }, [selectedFile]);

    const handleSend = () => {
        if ((message.trim() || selectedFile) && !disabled) {
            // Truyền đối tượng File gốc (selectedFile) ra ngoài
            onSend(message.trim(), selectedFile ?? undefined);
            setMessage('');
            setSelectedFile(null);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleAttachmentClick = () => fileInputRef.current?.click();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) setSelectedFile(files[0]);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleRemoveFile = () => setSelectedFile(null);
    const isVideo = selectedFile?.type.startsWith('video/');

    return (
        <Box sx={{ p: 2, backgroundColor: '#36393f', display: 'flex', flexDirection: 'column', gap: 1 }}>
            {selectedFile && (
                <Box sx={{ position: 'relative', alignSelf: 'flex-start', p: previewUrl ? 0 : 1, borderRadius: 2, mt: 1 }}>
                    {previewUrl ? (
                        isVideo ? (
                            <Box component="video" src={previewUrl} controls sx={{ width: 200, borderRadius: 2 }} />
                        ) : (
                            <Box component="img" src={previewUrl} sx={{ width: 120, height: 120, borderRadius: 2 }} />
                        )
                    ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#2f3136', p: 1, borderRadius: 1 }}>
                            <InsertDriveFile sx={{ color: '#b9bbbe', mr: 1 }} />
                            <Typography noWrap sx={{ color: '#dcddde', fontSize: '0.875rem' }}>{selectedFile.name}</Typography>
                        </Box>
                    )}
                    <IconButton size="small" onClick={handleRemoveFile} sx={{ position: 'absolute', top: -10, right: -10, color: '#ed4245', backgroundColor: '#36393f' }}>
                        <Close fontSize="small" />
                    </IconButton>
                </Box>
            )}
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', backgroundColor: '#40444b', borderRadius: 2, px: 1.5, py: 0.5 }}>
                <IconButton size="small" onClick={handleAttachmentClick}><AddCircleOutline sx={{ color: '#b9bbbe' }} /></IconButton>
                <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} accept="image/*,video/*" />
                <TextField fullWidth multiline value={message} onChange={(e) => setMessage(e.target.value)} onKeyPress={handleKeyPress} placeholder="Nhập tin nhắn..." variant="standard" sx={{ '& .MuiInput-root': { color: '#dcddde' } }} />
                <IconButton onClick={handleSend} disabled={(!message.trim() && !selectedFile) || disabled}><Send fontSize="small" sx={{ color: (message.trim() || selectedFile) ? '#5865f2' : '#72767d' }} /></IconButton>
            </Box>
        </Box>
    );
}