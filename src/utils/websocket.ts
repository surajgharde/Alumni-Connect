import io, { Socket } from 'socket.io-client';

class WebSocketService {
  private socket: Socket | null = null;
  private static instance: WebSocketService;
  
  public connect() {
    if (!this.socket) {
      this.socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 3000,
      });
    }
  }

  public joinRoom(roomId: string) {
    this.socket?.emit('join-room', roomId);
  }

  public sendMessage(message: string, roomId: string) {
    this.socket?.emit('send-message', {
      text: message,
      roomId,
      timestamp: new Date().toISOString()
    });
  }

  public onMessageReceived(callback: (message: any) => void) {
    this.socket?.on('new-message', callback);
  }

  public onError(callback: (error: string) => void) {
    this.socket?.on('connect_error', (err) => {
      callback(err.message);
    });
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }
}

export const webSocketService = WebSocketService.getInstance();