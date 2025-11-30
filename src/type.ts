import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export interface MessagePayload {
  sessionId: string;
  senderType: 'user' | 'admin';
  senderId?: string;
  content: string;
}

export interface TypingPayload {
  sessionId: string;
  userType: 'user' | 'admin';
  isTyping: boolean;
}
