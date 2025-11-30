// src/models/index.ts
import { Sequelize } from 'sequelize';
import { AdminModel, AdminSchema } from './admin';
import { ChatSessionModel, ChatSessionSchema } from './chatsession';
import { MessageModel, MessageSchema } from './message';
import { TypingIndicatorModel, TypingIndicatorSchema } from './TypingIndicator';

export function setupModels(sequelize: Sequelize) {
  // 1. Initialize models
  AdminModel.init(AdminSchema, { sequelize, modelName: 'Admin', tableName: 'admins' });
  ChatSessionModel.init(ChatSessionSchema, { sequelize, modelName: 'ChatSession', tableName: 'chat_sessions' });
  MessageModel.init(MessageSchema, { sequelize, modelName: 'Message', tableName: 'messages' });
  TypingIndicatorModel.init(TypingIndicatorSchema, { sequelize, modelName: 'TypingIndicator', tableName: 'typing_indicators' });

  // 2. Define associations (Relationships)
  
  // ChatSession <-> Message (One-to-Many)
  ChatSessionModel.hasMany(MessageModel, {
    foreignKey: 'session_id',
    as: 'messages',
    onDelete: 'CASCADE',
  });
  MessageModel.belongsTo(ChatSessionModel, {
    foreignKey: 'session_id',
    as: 'session',
  });

  // ChatSession <-> TypingIndicator (One-to-Many)
  ChatSessionModel.hasMany(TypingIndicatorModel, {
    foreignKey: 'session_id',
    as: 'typingIndicators',
    onDelete: 'CASCADE',
  });
  TypingIndicatorModel.belongsTo(ChatSessionModel, {
    foreignKey: 'session_id',
    as: 'session',
  });

  // 3. Export models for use
  const models = {
    Admin: AdminModel,
    ChatSession: ChatSessionModel,
    Message: MessageModel,
    TypingIndicator: TypingIndicatorModel,
  };
  
  // Attach models to the sequelize instance for easier access
  (sequelize as any).models = models;

  return models;
}

// Re-export models for direct import in services/routes
export * from './admin';
export * from './chatsession';
export * from './message';
export * from './TypingIndicator';