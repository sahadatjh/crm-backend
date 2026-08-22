import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*', // For production, restrict this to the frontend URL
  },
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // Frontend will emit this event when a user logs in, passing their user ID
  @SubscribeMessage('joinUserRoom')
  handleJoinRoom(@MessageBody() userId: string, @ConnectedSocket() client: Socket) {
    const roomName = `user_${userId}`;
    client.join(roomName);
    this.logger.log(`Client ${client.id} joined room: ${roomName}`);
    
    // Acknowledge connection
    return { event: 'joined', data: { room: roomName } };
  }

  // Helper method to push notifications to a specific user
  sendNotificationToUser(userId: string, notification: any) {
    const roomName = `user_${userId}`;
    this.server.to(roomName).emit('newNotification', notification);
    this.logger.log(`Pushed notification to room ${roomName}`);
  }
}
