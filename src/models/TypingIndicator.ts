// src/models/TypingIndicator.ts
import { DataTypes, Model, Optional } from 'sequelize';
import { ChatSessionModel } from './chatsession'; // For type hints

interface TypingIndicatorAttributes {
  id: string;
  sessionId: string;
  userType: 'user' | 'admin';
  isTyping: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface TypingIndicatorCreationAttributes extends Optional<TypingIndicatorAttributes, 'id' | 'createdAt' | 'isTyping'> {}

export class TypingIndicatorModel extends Model<TypingIndicatorAttributes, TypingIndicatorCreationAttributes> implements TypingIndicatorAttributes {
  public id!: string;
  public sessionId!: string;
  public userType!: 'user' | 'admin';
  public isTyping!: boolean;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations (for type hints)
  public getSession!: () => Promise<ChatSessionModel>;
}

export const TypingIndicatorSchema = {
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
      model: ChatSessionModel,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  userType: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'user_type',
  },
  isTyping: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_typing',
  },
  // A unique constraint on sessionId and userType
  // This is set up in index.ts for the model options (Model.init)
};

// Unique index is handled in `src/models/index.ts` in the Model.init call options.
// For the unique constraint you had in Prisma: @@unique([sessionId, userType])
// This is added in index.ts using `uniqueKeys` or manually via `indexes` in the model definition's options object.