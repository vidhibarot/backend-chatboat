// src/routes/sessions.ts
import express from 'express';
import { models } from '../index'; // Use the exported models
import { authenticateToken } from '../middleware/auth';
import { Op } from 'sequelize';

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const sessions = await models.ChatSession.findAll({
      // Prisma's `include` is Sequelize's `include`
      include: [
        {
          model: models.Message,
          as: 'messages', // Use the alias defined in the models/index.ts association
          order: [['createdAt', 'DESC']], // Order messages inside the include
          limit: 1, // Only get the latest message per session
        },
      ],
      // Prisma's `orderBy` is Sequelize's `order`
      order: [['updatedAt', 'DESC']],
    });

    res.json(sessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  const { userId, userName, userEmail } = req.body;

  try {
    // Prisma's `create` is Sequelize's `create`
    const session = await models.ChatSession.create({
      userId,
      userName,
      userEmail,
    });

    res.json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/:id/status', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    // Prisma's `update` is Sequelize's `update`
    const [updatedRows] = await models.ChatSession.update(
      { status },
      {
        where: { id },
        returning: true, // Only for PostgreSQL to return the updated record
      }
    );

    if (updatedRows === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Fetch the updated session since `update` only returns count/rows
    const session = await models.ChatSession.findByPk(id);

    res.json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;