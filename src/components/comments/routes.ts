import express from 'express';
import { Video, Comment } from '../../sequelize';
import { v4 as uuidv4 } from 'uuid';
import authenticateToken from '../../middlewares/tokenAuth';

const router: express.Router = express.Router();

router.post(
  '/:videoId',
  authenticateToken,
  async (req: any, res: express.Response) => {
    try {
      const video = await Video.findOne({ where: { id: req.params.videoId } });
      if (!video) {
        return res.status(404).json({ message: 'Video not found.' });
      }

      const newComment = new Comment({
        id: uuidv4(),
        content: req.body.content,
        videoId: req.params.videoId,
        userId: req.user.id,
      });

      await newComment.save();
      res.status(200).json(newComment);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
);

router.delete(
  '/:commentId',
  async (req: express.Request, res: express.Response) => {
    try {
      const comment = await Comment.findOne({
        where: { id: req.params.commentId },
      });
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found.' });
      }

      await comment.destroy();
      res.status(204);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
);

export default router;
