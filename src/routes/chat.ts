import express from 'express';
import { models } from '../index'; // Use the exported models

const router = express.Router();

router.get('/messages/:sessionId', async (req, res) => {
  const { sessionId } = req.params;

  try {
    // Prisma's `findMany` with `where` and `orderBy` is Sequelize's `findAll`
    const messages = await models.Message.findAll({
      where: { sessionId },
      order: [['createdAt', 'ASC']],
    });

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/messages', async (req, res) => {
  const { sessionId, senderType, senderId, content } = req.body;

  try {
    // Prisma's `create` is Sequelize's `create`
    const message = await models.Message.create({
      sessionId,
      senderType,
      senderId,
      content,
    });

    // Update session timestamp using Sequelize's `update`
    await models.ChatSession.update(
      { updatedAt: new Date() },
      { where: { id: sessionId } }
    );

    res.json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/messages/:id/read', async (req, res) => {
  const { id } = req.params;

  try {
    // Prisma's `update` is Sequelize's `update`
    await models.Message.update(
      { isRead: true },
      {
        where: { id },
      }
    );

    // Fetch the updated message
    const message = await models.Message.findByPk(id);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;