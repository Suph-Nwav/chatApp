import { useEffect, useRef } from 'react';
import { websocketService } from '@/services/websocket.service';

export const useWebSocket = (onMessage: (message: any) => void) => {
  const onMessageRef = useRef(onMessage);

  // Đảm bảo callback luôn luôn mới nhất mà không gây re-run useEffect
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    let isComponentMounted = true;
    let subscription: any = null;

    // Kích hoạt kết nối và truyền một hàm Callback xử lý sau khi kết nối thành công
    websocketService.connect(token, () => {
      // KIỂM TRA BẮT BUỘC: Chỉ tiến hành subscribe nếu component chưa bị unmount
      if (!isComponentMounted) return;

      console.log('[WebSocket] Connected successfully! Registering subscription channel...');

      // Lúc này chắc chắn this.client.connected đã là true, đảm bảo không bị lỗi chặn nữa
      subscription = websocketService.subscribe(
          '/user/queue/messages',
          (message) => {
            if (onMessageRef.current) {
              onMessageRef.current(message);
            }
          }
      );
    });

    // Hàm dọn dẹp khi chuyển trang hoặc component bị hủy
    return () => {
      isComponentMounted = false;
      if (subscription) {
        console.log('[WebSocket] Unsubscribing channel...');
        subscription.unsubscribe();
      }
      // KHÔNG gọi websocketService.disconnect() ở đây nếu đây là cổng lắng nghe tin nhắn toàn cục (Zalo style).
      // Việc disconnect liên tục khi component render lại sẽ làm mất kết nối ngầm.
    };
  }, []); // Giữ mảng phụ thuộc rỗng để chỉ khởi tạo kết nối duy nhất 1 lần khi mở ứng dụng

  return null;
};