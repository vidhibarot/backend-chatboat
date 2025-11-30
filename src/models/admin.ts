// src/models/Admin.ts
import { DataTypes, Model, Optional, ModelCtor } from 'sequelize';

interface AdminAttributes {
  id: string;
  email: string;
  password: string;
  fullName: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// Optional properties when creating an Admin
interface AdminCreationAttributes extends Optional<AdminAttributes, 'id' | 'createdAt' | 'updatedAt' | 'fullName'> {}

export class AdminModel extends Model<AdminAttributes, AdminCreationAttributes> implements AdminAttributes {
  public id!: string;
  public email!: string;
  public password!: string;
  public fullName!: string | null;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const AdminSchema = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fullName: {
    type: DataTypes.STRING,
    field: 'full_name', // Maps to full_name in DB
  },
  // createdAt and updatedAt are automatically managed by Sequelize if `timestamps: true`
};