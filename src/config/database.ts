// src/config/database.ts
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { setupModels } from '../models';

dotenv.config();

// Extract connection details from DATABASE_URL
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

// Sequelize uses connection string but separates options
const sequelize = new Sequelize(dbUrl, {
  dialect: 'postgres',
  logging: false, // Set to console.log for query logging
  define: {
    timestamps: true, // Use automatic timestamps (createdAt, updatedAt)
    underscored: true, // Use snake_case for column names
  },
});

setupModels(sequelize);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Sync all models (create tables if they don't exist)
    await sequelize.sync({ alter: true }); // `alter: true` checks the current state and makes necessary changes
    console.log('Database synchronization complete (tables created/updated).');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

// Export the connection instance and the sync function
export { sequelize, connectDB };