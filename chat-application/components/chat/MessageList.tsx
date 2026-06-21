'use client';

import { useState } from 'react'; // Bổ sung useState
import { Box, Avatar, Typography, CircularProgress } from '@mui/material';
import { ChatMessageResponse } from '@/types';
import { format, isToday, isYesterday } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useUserStore } from '@/store/useUserStore';
import ImageModal from './ImageModal'; // Import ImageModal mới

interface MessageListProps {
    messages: ChatMessageResponse[];
    loading?: boolean;
}

export default function MessageList({ messages, loading = false }: MessageListProps) {
    const { user } = useUserStore();

    // --- LOGIC CHO IMAGE MODAL (ZALO/FACEBOOK STYLE) ---
    const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = (imageUrl: string) => {
        setSelectedImageUrl(imageUrl);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        // Đặt selectedImageUrl về null sau khi modal đã đóng hoàn toàn
        // để tránh ảnh bị nhảy khi mở modal tiếp theo
        setTimeout(() => setSelectedImageUrl(null), 300);
    };
    // --------------------------------------------------

    const formatMessageTime = (dateString: string) => {
        const date = new Date(dateString);
        if (isToday(date)) {
            return format(date, 'HH:mm', { locale: vi });
        } else if (isYesterday(date)) {
            return `Hôm qua ${format(date, 'HH:mm', { locale: vi })}`;
        }
        return format(date, 'dd/MM HH:mm', { locale: vi });
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress sx={{ color: '#5865f2' }} />
            </Box>
        );
    }

    if (messages.length === 0) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    color: '#72767d',
                }}
            >
                <Typography variant="body2">Chưa có tin nhắn nào</Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                flex: 1,
                overflowY: 'auto',
                px: 3,
                py: 2,
                display: 'flex',
                flexDirection: 'column',
                '&::-webkit-scrollbar': {
                    width: '6px',
                },
                '&::-webkit-scrollbar-track': {
                    background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                    background: '#1a1b1e',
                    borderRadius: '3px',
                    '&:hover': {
                        background: '#2e3035',
                    },
                },
            }}
        >
            {/* Modal hiển thị ảnh phóng to, đặt ở mức cao nhất của render */}
            {selectedImageUrl && (
                <ImageModal
                    open={isModalOpen}
                    onClose={handleCloseModal}
                    imageUrl={selectedImageUrl}
                />
            )}

            {messages.map((message, index) => {
                const isOwn = message.senderId === user?.userId;
                const prevMessage = messages[index - 1];
                const showAvatar = !prevMessage || prevMessage.senderId !== message.senderId;

                const hasText = Boolean(message.content && message.content.trim() !== '');
                const hasMedia = Boolean(message.messageMedia && message.messageMedia.length > 0);
                const onlyMedia = hasMedia && !hasText;

                return (
                    <Box
                        key={message.id}
                        sx={{
                            display: 'flex',
                            gap: 1,
                            mb: showAvatar ? 2 : 0.5,
                            justifyContent: isOwn ? 'flex-end' : 'flex-start',
                            alignItems: 'flex-end',
                        }}
                    >
                        {!isOwn && (
                            <Box sx={{ width: 32, height: 32, flexShrink: 0 }}>
                                {showAvatar && (
                                    <Avatar
                                        sx={{
                                            bgcolor: '#43b581',
                                            width: 32,
                                            height: 32,
                                            fontSize: '0.875rem',
                                            fontWeight: 600,
                                        }}
                                    >
                                        {message.senderName[0]?.toUpperCase()}
                                    </Avatar>
                                )}
                            </Box>
                        )}

                        <Box
                            sx={{
                                maxWidth: '65%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: isOwn ? 'flex-end' : 'flex-start',
                            }}
                        >
                            {showAvatar && (
                                <Typography
                                    sx={{
                                        color: isOwn ? '#5865f2' : '#43b581',
                                        fontWeight: 600,
                                        fontSize: '0.8125rem',
                                        mb: 0.5,
                                        px: 1.5,
                                    }}
                                >
                                    {message.senderName}
                                </Typography>
                            )}

                            <Box
                                sx={{
                                    position: 'relative',
                                    backgroundColor: onlyMedia ? 'transparent' : (isOwn ? '#5865f2' : '#40444b'),
                                    color: '#fff',
                                    px: onlyMedia ? 0 : 2,
                                    py: onlyMedia ? 0 : 1.25,
                                    borderRadius: '16px',
                                    boxShadow: onlyMedia ? 'none' : '0 1px 2px rgba(0, 0, 0, 0.15)',
                                    '&:hover .message-time': {
                                        opacity: 1,
                                    },
                                }}
                            >
                                {/* KHU VỰC RENDER ẢNH/VIDEO */}
                                {hasMedia && (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: hasText ? 1 : 0 }}>
                                        {message.messageMedia!.map((media, idx) => {
                                            const isImage = media.fileType.startsWith('image/');
                                            const isVideo = media.fileType.startsWith('video/');

                                            if (isImage) {
                                                return (
                                                    // ĐÃ CẬP NHẬT: Không dùng thẻ <a> mở tab mới nữa
                                                    // Thay vào đó dùng div và onClick để mở Modal
                                                    <Box
                                                        key={idx}
                                                        component="div"
                                                        onClick={() => handleOpenModal(media.thumbnailUrl)} // Gọi hàm mở modal
                                                        sx={{
                                                            display: 'block',
                                                            cursor: 'pointer', // Hiện bàn tay khi rê chuột
                                                        }}
                                                    >
                                                        <Box
                                                            component="img"
                                                            src={media.thumbnailUrl}
                                                            alt={media.fileName}
                                                            sx={{
                                                                maxWidth: 250,
                                                                maxHeight: 250,
                                                                borderRadius: '12px',
                                                                objectFit: 'cover',
                                                                transition: 'opacity 0.2s',
                                                                '&:hover': {
                                                                    opacity: 0.85, // Hiệu ứng mờ nhẹ báo hiệu có thể click
                                                                },
                                                            }}
                                                        />
                                                    </Box>
                                                );
                                            } else if (isVideo) {
                                                return (
                                                    <Box
                                                        key={idx}
                                                        component="video"
                                                        src={media.thumbnailUrl}
                                                        controls
                                                        sx={{
                                                            maxWidth: 300,
                                                            maxHeight: 300,
                                                            borderRadius: '12px',
                                                            backgroundColor: '#000',
                                                        }}
                                                    />
                                                );
                                            }
                                            return (
                                                <Box key={idx} sx={{ backgroundColor: '#2f3136', p: 1, borderRadius: 1 }}>
                                                    <Typography variant="body2">{media.fileName || 'Tài liệu đính kèm'}</Typography>
                                                </Box>
                                            );
                                        })}
                                    </Box>
                                )}

                                {/* KHU VỰC RENDER CHỮ */}
                                {hasText && (
                                    <Typography
                                        sx={{
                                            fontSize: '0.9375rem',
                                            lineHeight: 1.5,
                                            wordBreak: 'break-word',
                                            whiteSpace: 'pre-wrap',
                                        }}
                                    >
                                        {message.content}
                                    </Typography>
                                )}

                                {/* HIỂN THỊ THỜI GIAN */}
                                {message.createdAt && (
                                    <Typography
                                        className="message-time"
                                        sx={{
                                            position: 'absolute',
                                            bottom: -20,
                                            [isOwn ? 'right' : 'left']: 8,
                                            color: '#72767d',
                                            fontSize: '0.6875rem',
                                            opacity: 0,
                                            transition: 'opacity 0.2s',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {formatMessageTime(message.createdAt)}
                                    </Typography>
                                )}
                            </Box>
                        </Box>

                        {isOwn && (
                            <Box sx={{ width: 32, height: 32, flexShrink: 0 }}>
                                {showAvatar && (
                                    <Avatar
                                        sx={{
                                            bgcolor: '#5865f2',
                                            width: 32,
                                            height: 32,
                                            fontSize: '0.875rem',
                                            fontWeight: 600,
                                        }}
                                    >
                                        {message.senderName[0]?.toUpperCase()}
                                    </Avatar>
                                )}
                            </Box>
                        )}
                    </Box>
                );
            })}
        </Box>
    );
}