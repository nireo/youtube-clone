import express from 'express';
import { Video, Comment, CommentLike, VideoLike } from '../../sequelize';
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

router.get('/:videoId', async (req: express.Request, res: express.Response) => {
  try {
    const comments = await Comment.findAll({
      where: { videoId: req.params.videoId },
    });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.patch(
  '/:action/:commentId',
  authenticateToken,
  async (req: any, res: express.Response) => {
    try {
      const comment: any = await Comment.findOne({
        where: { id: req.params.commentId },
      });

      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }

      // check if the user has already liked or disliked the comment
      const commentLike: any = await CommentLike.findOne({
        where: { userId: req.user.id, commentId: req.params.commentId },
      });

      if (commentLike) {
        // the like can change into a dislike and vice versa.
        // also if the actions are same, the like model is deleted
        if (commentLike.like && req.params.action === 'dislike') {
          comment.likes -= 1;
          comment.dislikes += 1;

          commentLike.like = false;
        } else if (commentLike.like === false && req.params.action === 'like') {
          comment.likes += 1;
          comment.dislikes -= 1;

          commentLike.like = true;
        } else if (commentLike.like && req.params.action === 'like') {
          await commentLike.destroy();
          return res.status(204);
        } else if (
          commentLike.like === false &&
          req.params.action === 'dislike'
        ) {
          await commentLike.destroy();
          return res.status(204);
        } else {
          return res.status(204);
        }
        await comment.save();
        await commentLike.save();
      }

      await CommentLike.create({
        id: uuidv4(),
        userId: req.user.id,
        commentId: req.params.commentId,
        like: req.params.action === 'like',
      });

      comment.likes += req.params.action === 'like' ? 1 : -1;
      comment.dislikes += req.params.action !== 'like' ? 1 : -1;
      await comment.save();

      res.status(204);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
);

router.patch(
  '/:commentId',
  authenticateToken,
  async (req: any, res: express.Response) => {
    try {
      const comment: any = await Comment.findOne({
        where: { id: req.params.commentId },
      });
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }

      if (comment.userId !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      comment.content = req.body.content;
      comment.edited = true;

      await comment.save();
      res.status(204);
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

router.delete(
  '/:videoId/:commentId',
  authenticateToken,
  async (req: any, res: express.Response) => {
    try {
      const video: any = await Video.findOne({
        where: { id: req.params.videoId },
      });
      if (!video) {
        return res.status(404).json({ message: 'Video not found' });
      }

      // only the user can remove comments from the video
      if (video.userId !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      const comment = await Comment.findOne({
        where: { id: req.params.commentId, videoId: req.params.videoId },
      });
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }

      await comment.destroy();
      res.status(204);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
);

export default router;
