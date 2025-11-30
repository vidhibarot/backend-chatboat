// src/models/Message.ts
import { DataTypes, Model, Optional } from 'sequelize';
import { ChatSessionModel } from './chatsession'; // For type hints

interface MessageAttributes {
  id: string;
  sessionId: string;
  senderType: 'user' | 'admin';
  senderId: string | null;
  content: string;
  isRead: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface MessageCreationAttributes extends Optional<MessageAttributes, 'id' | 'createdAt' | 'updatedAt' | 'isRead' | 'senderId'> {}

export class MessageModel extends Model<MessageAttributes, MessageCreationAttributes> implements MessageAttributes {
  public id!: string;
  public sessionId!: string;
  public senderType!: 'user' | 'admin';
  public senderId!: string | null;
  public content!: string;
  public isRead!: boolean;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations (for type hints)
  public getSession!: () => Promise<ChatSessionModel>;
}

export const MessageSchema = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  sessionId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'session_id',
    references: {
      model: ChatSessionModel, // Sequelize references model class
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  senderType: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'sender_type',
  },
  senderId: {
    type: DataTypes.STRING,
    field: 'sender_id',
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_read',
  },
};