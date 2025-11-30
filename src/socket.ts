// src/socket.ts
import { Server, Socket } from 'socket.io';
import { models } from './index'; // Import models
import { MessagePayload, TypingPayload } from './type';

export const setupSocketIO = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join_session', (sessionId: string) => {
      socket.join(`session:${sessionId}`);
      console.log(`Socket ${socket.id} joined session:${sessionId}`);
    });

    socket.on('leave_session', (sessionId: string) => {
      socket.leave(`session:${sessionId}`);
      console.log(`Socket ${socket.id} left session:${sessionId}`);
    });

    socket.on('send_message', async (payload: MessagePayload) => {
      try {
        // Create the message using Sequelize
        const message = await models.Message.create({
          sessionId: payload.sessionId,
          senderType: payload.senderType,
          senderId: payload.senderId,
          content: payload.content,
        });

        // Update session timestamp
        await models.ChatSession.update(
          { updatedAt: new Date() },
          { where: { id: payload.sessionId } }
        );

        // Emit to all clients in the session room
        io.to(`session:${payload.sessionId}`).emit('new_message', message);
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    socket.on('typing', async (payload: TypingPayload) => {
      try {
        // Prisma's `upsert` is Sequelize's `findOrCreate` followed by `update` or direct `upsert` (if supported).
        // Since Sequelize's `upsert` isn't fully reliable/standard across dialects, we use `findOrCreate` and `update`.
        // However, given the unique index on `(sessionId, userType)`, `upsert` is a cleaner fit and is supported by PostgreSQL.
        const [typingIndicator, created] = await models.TypingIndicator.findOrCreate({
            where: {
                sessionId: payload.sessionId,
                userType: payload.userType,
            },
            defaults: {
                sessionId: payload.sessionId,
                userType: payload.userType,
                isTyping: payload.isTyping,
            }
        });

        if (!created) {
            // If it exists, update the isTyping status
            await typingIndicator.update({ isTyping: payload.isTyping });
        }

        // Broadcast the typing status to others in the session
        socket
          .to(`session:${payload.sessionId}`)
          .emit('user_typing', payload);
      } catch (error) {
        console.error('Error updating typing indicator:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};