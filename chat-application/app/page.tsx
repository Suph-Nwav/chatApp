'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Divider, IconButton, Menu, MenuItem } from '@mui/material';
import { Add, Menu as MenuIcon } from '@mui/icons-material';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { useWebSocket } from '@/hooks/useWebSocket';
import { conversationService } from '@/services/conversation.service';
import { messageService } from '@/services/message.service';
import { ConversationDetailResponse, ChatMessageResponse, MessageType } from '@/types';
import { useUserStore } from '@/store/useUserStore';
import ConversationList from '@/components/chat/ConversationList';
import MessageList from '@/components/chat/MessageList';
import MessageInput from '@/components/chat/MessageInput';
import UserProfile from '@/components/common/UserProfile';
import Logo from '@/components/common/Logo';
import NewConversationDialog from '@/components/chat/NewConversationDialog';
import ChatPlaceholder from '@/components/chat/ChatPlaceholder';

export default function HomePage() {
    const { isAuthenticated } = useAuthGuard();
    const { user } = useUserStore();

    const [conversations, setConversations] = useState<ConversationDetailResponse[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatMessageResponse[]>([]);
    const [loadingConversations, setLoadingConversations] = useState(false);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [sendingMessage, setSendingMessage] = useState(false);
    const [showSidebar, setShowSidebar] = useState(true);
    const [showNewConversation, setShowNewConversation] = useState(false);
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);


    // ĐÃ CẬP NHẬT: Logic WebSocket Realtime tối ưu như Zalo
    useWebSocket((message: ChatMessageResponse) => {
        // 1. Nếu đang mở đúng cuộc trò chuyện đó -> Đẩy ngay tin nhắn vào màn hình chat
        if (selectedConversation && message.conversationId === selectedConversation) {
            setMessages((prev) => {
                // Nếu tin nhắn đã tồn tại (dựa trên tempId hoặc id), thay thế nó
                const existingIndex = prev.findIndex(
                    (m) => (m.tempId && m.tempId === message.tempId) || m.id === message.id
                );

                if (existingIndex > -1) {
                    const updated = [...prev];
                    updated[existingIndex] = message;
                    return updated;
                }
                // Nếu không, thêm tin nhắn mới
                return [...prev, message];
            });
        }

        // 2. Cập nhật danh sách cuộc hội thoại bên trái và đẩy lên đầu trang
        setConversations((prevConversations) => {
            const updated = [...prevConversations];
            const index = updated.findIndex((c) => c.id === message.conversationId);

            if (index > -1) {
                // Bóc cuộc hội thoại cũ ra để biến đổi
                const [item] = updated.splice(index, 1);

                // Xác định nội dung hiển thị vắn tắt ở sidebar bên trái
                if (message.messageMedia && message.messageMedia.length > 0) {
                    const firstMedia = message.messageMedia[0];
                    if (firstMedia.fileType.startsWith('image/')) {
                        item.lastMessageContent = '[Hình ảnh]';
                    } else if (firstMedia.fileType.startsWith('video/')) {
                        item.lastMessageContent = '[Video]';
                    } else {
                        item.lastMessageContent = '[Tài liệu đính kèm]';
                    }
                } else {
                    item.lastMessageContent = message.content || '';
                }

                item.lastMessageTime = message.createdAt;

                // Trả về mảng mới với cuộc hội thoại vừa có tin nhắn nằm ở đầu tiên
                return [item, ...updated];
            }

            // Nếu là cuộc hội thoại mới tinh chưa có trong danh sách, tải lại toàn bộ danh sách để cập nhật
            loadConversations();
            return prevConversations;
        });
    });

    // Load conversations
    useEffect(() => {
        if (isAuthenticated) {
            loadConversations();
        }
    }, [isAuthenticated]);

    // Load messages when conversation selected
    useEffect(() => {
        if (selectedConversation) {
            loadMessages(selectedConversation);
        }
    }, [selectedConversation]);

    const loadConversations = async () => {
        try {
            setLoadingConversations(true);
            const response = await conversationService.getMyConversations(1, 50);
            setConversations(response.data.content);
        } catch (error) {
            console.error('Failed to load conversations:', error);
        } finally {
            setLoadingConversations(false);
        }
    };

    const loadMessages = async (conversationId: string) => {
        try {
            setLoadingMessages(true);
            const response = await messageService.getMessages(conversationId, 1, 20);
            setMessages(response.data.content.reverse());
        } catch (error) {
            console.error('Failed to load messages:', error);
        } finally {
            setLoadingMessages(false);
        }
    };

    const handleSendMessage = async (content: string, file?: File) => {
        if (!selectedConversation || !user) return;

        const tempId = `temp-${crypto.randomUUID()}`;
        const messageType = file ? (file.type.startsWith('video/') ? 'VIDEO' : 'IMAGE') : 'TEXT';

        // Tạo một tin nhắn tạm thời để hiển thị ngay lập tức
        const tempMessage: ChatMessageResponse = {
            id: tempId, // Sử dụng tempId làm key tạm thời
            tempId: tempId,
            conversationId: selectedConversation,
            senderId: user.userId,
            senderName: user.username,
            content: content,
            messageType: messageType,
            messageMedia: file ? [{
                fileName: file.name,
                fileType: file.type,
                thumbnailUrl: URL.createObjectURL(file) // Tạo URL tạm thời cho ảnh/video
            }] : null,
            createdAt: new Date().toISOString(),
            conversationAvatar: null,
        };

        setMessages((prev) => [...prev, tempMessage]);


        try {
            setSendingMessage(true);

            // Gửi tin nhắn thực sự lên server
            await messageService.sendMessage({
                conversationId: selectedConversation,
                content: content,
                messageType: messageType,
                tempId,
                files: file ? [file] : undefined
            });

            // Không cần thêm response.data vào messages ở đây nữa
            // vì WebSocket sẽ xử lý việc cập nhật tin nhắn với ID thật từ server

            // Cập nhật sidebar
            setConversations((prevConversations) => {
                const updated = [...prevConversations];
                const index = updated.findIndex((c) => c.id === selectedConversation);
                if (index > -1) {
                    const [item] = updated.splice(index, 1);
                    item.lastMessageContent = file ? (file.type.startsWith('video/') ? '[Video]' : '[Hình ảnh]') : content;
                    item.lastMessageTime = new Date().toISOString();
                    return [item, ...updated];
                }
                return prevConversations;
            });

        } catch (error) {
            console.error('Failed to send message:', error);
            // Xử lý lỗi: ví dụ, đánh dấu tin nhắn tạm thời là đã gửi lỗi
            setMessages(prev => prev.map(m => m.id === tempId ? { ...m, id: `error-${tempId}` } : m));
        } finally {
            setSendingMessage(false);
        }
    };

    const handleConversationCreated = (conversationId: string) => {
        loadConversations();
        setSelectedConversation(conversationId);
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMenuAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };

    const handleOpenNewConversationDialog = () => {
        setShowNewConversation(true);
        handleMenuClose();
    };

    const selectedConv = conversations.find((c) => c.id === selectedConversation);

    if (!isAuthenticated) {
        return null;
    }

    return (
        <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#36393f' }}>
            {/* Sidebar - Conversations */}
            <Box
                sx={{
                    width: showSidebar ? 280 : 0,
                    backgroundColor: '#2f3136',
                    borderRight: '1px solid #202225',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'width 0.3s',
                    overflow: 'hidden',
                }}
            >
                {/* Header */}
                <Box
                    sx={{
                        height: 48,
                        px: 2,
                        borderBottom: '1px solid #202225',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                    }}
                >
                    <Logo size="small" showText={false} />
                    <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '0.9375rem', flex: 1 }}>
                        Tin nhắn
                    </Typography>
                    <IconButton
                        size="small"
                        onClick={handleMenuOpen}
                        sx={{ color: '#b9bbbe', '&:hover': { color: '#fff' } }}
                    >
                        <Add fontSize="small" />
                    </IconButton>
                    <Menu
                        anchorEl={menuAnchorEl}
                        open={Boolean(menuAnchorEl)}
                        onClose={handleMenuClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                        PaperProps={{
                            sx: {
                                backgroundColor: '#2f3136',
                                color: '#b9bbbe',
                            }
                        }}
                    >
                        <MenuItem onClick={handleOpenNewConversationDialog}>Tin nhắn mới</MenuItem>
                        <MenuItem onClick={handleOpenNewConversationDialog}>Tạo nhóm mới</MenuItem>
                    </Menu>
                </Box>

                {/* Conversation List */}
                <Box sx={{ flex: 1, overflowY: 'auto' }}>
                    <ConversationList
                        conversations={conversations}
                        selectedId={selectedConversation}
                        onSelect={setSelectedConversation}
                        loading={loadingConversations}
                    />
                </Box>

                {/* User Profile */}
                <Box sx={{ borderTop: '1px solid #202225' }}>
                    <UserProfile />
                </Box>
            </Box>

            {/* Main Chat Area */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Chat Header */}
                <Box
                    sx={{
                        height: 48,
                        backgroundColor: '#36393f',
                        borderBottom: '1px solid #202225',
                        display: 'flex',
                        alignItems: 'center',
                        px: 2,
                        gap: 2,
                    }}
                >
                    <IconButton
                        onClick={() => setShowSidebar(!showSidebar)}
                        sx={{ color: '#b9bbbe', display: { md: 'none' } }}
                        size="small"
                    >
                        <MenuIcon fontSize="small" />
                    </IconButton>

                    {selectedConv && (
                        <>
                            <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '0.9375rem' }}>
                                {selectedConv.name || selectedConv.participantInfo?.map(p => p.username).join(', ')}
                            </Typography>
                            <Divider orientation="vertical" flexItem sx={{ borderColor: '#202225' }} />
                            <Typography sx={{ color: '#b9bbbe', fontSize: '0.8125rem' }}>
                                {selectedConv.participantInfo?.length} thành viên
                            </Typography>
                            {/* Online status */}
                            <Divider orientation="vertical" flexItem sx={{ borderColor: '#202225', mx: 1 }} />
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                <Box
                                    sx={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: '50%',
                                        backgroundColor: selectedConv.isOnline ? '#23a55a' : '#80848e',
                                        border: '2px solid #36393f',
                                        boxSizing: 'border-box',
                                    }}
                                />
                                <Typography sx={{
                                    color: selectedConv.isOnline ? '#23a55a' : '#b9bbbe',
                                    fontSize: '0.875rem',
                                    fontWeight: 500,
                                }}>
                                    {selectedConv.isOnline ? 'Đang hoạt động' : selectedConv.lastOnlineAt || 'Không hoạt động'}
                                </Typography>
                            </Box>
                        </>
                    )}
                </Box>

                {/* Messages */}
                {selectedConversation ? (
                    <>
                        <MessageList messages={messages} loading={loadingMessages} />
                        <MessageInput onSend={handleSendMessage} disabled={sendingMessage} />
                    </>
                ) : (
                    <ChatPlaceholder variant="no-conversation" />
                )}
            </Box>

            {/* New Conversation Dialog */}
            <NewConversationDialog
                open={showNewConversation}
                onClose={() => setShowNewConversation(false)}
                onConversationCreated={handleConversationCreated}
            />
        </Box>
    );
}
