// src/models/ChatSession.ts
import { DataTypes, Model, Optional } from 'sequelize';
import { MessageModel } from './message'; // For type hints
import { TypingIndicatorModel } from './TypingIndicator'; // For type hints

interface ChatSessionAttributes {
  id: string;
  userId: string;
  userName: string | null;
  userEmail: string | null;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ChatSessionCreationAttributes extends Optional<ChatSessionAttributes, 'id' | 'createdAt' | 'updatedAt' | 'userName' | 'userEmail' | 'status'> {}

export class ChatSessionModel extends Model<ChatSessionAttributes, ChatSessionCreationAttributes> implements ChatSessionAttributes {
  public id!: string;
  public userId!: string;
  public userName!: string | null;
  public userEmail!: string | null;
  public status!: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations (for type hints)
  public getMessages!: () => Promise<MessageModel[]>;
  public getTypingIndicators!: () => Promise<TypingIndicatorModel[]>;
}

export const ChatSessionSchema = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'user_id',
  },
  userName: {
    type: DataTypes.STRING,
    field: 'user_name',
  },
  userEmail: {
    type: DataTypes.STRING,
    field: 'user_email',
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'active',
  },
};