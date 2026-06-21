import { Client, StompSubscription } from '@stomp/stompjs';

class WebSocketService {
  private client: Client | null = null;

  connect(token: string, onConnected?: () => void) {
    this.client = new Client({
      brokerURL: 'ws://localhost:8088/ws',
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (str) => {
        console.log('[STOMP]', str);
      },
      onConnect: () => {
        console.log('[WebSocket] Connected successfully');
        onConnected?.();
      },
      onStompError: (error) => {
        console.error('[WebSocket] STOMP error:', error);
      },
      onWebSocketError: (error) => {
        console.error('[WebSocket] Connection error:', error);
      },
    });

    this.client.activate();
  }

  subscribe(destination: string, callback: (message: any) => void): StompSubscription | null {
    if (!this.client?.connected) {
      console.error('[WebSocket] Cannot subscribe - not connected');
      return null;
    }

    return this.client.subscribe(destination, (frame) => {
      const message = JSON.parse(frame.body);
      callback(message);
    });
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.client = null;
    }
  }
}

export const websocketService = new WebSocketService();
