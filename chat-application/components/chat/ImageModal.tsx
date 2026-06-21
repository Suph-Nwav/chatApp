'use client';

import { Box, Modal, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';

interface ImageModalProps {
    open: boolean;
    onClose: () => void;
    imageUrl: string;
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxHeight: '90vh',
    maxWidth: '90vw',
    boxShadow: 24,
    p: 1, // Khoảng cách nhỏ giữa ảnh và viền modal
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Nền tối trong suốt
    borderRadius: 2,
    outline: 'none', // Bỏ viền mặc định của Modal
};

export default function ImageModal({ open, onClose, imageUrl }: ImageModalProps) {
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="image-viewer-modal"
            aria-describedby="shows-full-size-image"
            // Khi click vào vùng nền tối, modal sẽ đóng
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
            <Box sx={style}>
                {/* Nút đóng modal ở góc trên bên phải */}
                <IconButton
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        color: 'white',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.2)'
                        }
                    }}
                >
                    <Close />
                </IconButton>

                {/* Ảnh full-size */}
                <img
                    src={imageUrl}
                    alt="Full size chat image"
                    style={{
                        maxHeight: '80vh',
                        maxWidth: '80vw',
                        objectFit: 'contain', // Đảm bảo ảnh không bị méo
                        borderRadius: '4px' // Viền bo nhẹ cho ảnh
                    }}
                />
            </Box>
        </Modal>
    );
}