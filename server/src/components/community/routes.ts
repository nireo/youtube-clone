import express from "express";
import {
  User,
  Community,
  CommunityLike,
  CommunityComment
} from "../../sequelize";
import authenticateToken from "../../middlewares/tokenAuth";
import { v4 as uuidv4 } from "uuid";

const router: express.Router = express.Router();

router.get(
  "/user/:userId",
  async (req: express.Request, res: express.Response) => {
    try {
      const { userId } = req.params;
      const user = await User.findOne({ where: { id: userId } });
      if (!user) {
        return res.status(204);
      }

      const communityPosts = await Community.findAll({
        where: { userId },
        include: User
      });
      res.status(200).json(communityPosts);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
);

router.get(
  "/post/:postId",
  async (req: express.Request, res: express.Response) => {
    try {
      const post = await Community.findOne({
        where: { id: req.params.postId },
        include: User
      });

      if (!post) {
        return res.status(404);
      }

      res.status(200).json(post);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
);

router.post("/", authenticateToken, async (req: any, res: express.Response) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(401);
    }

    const newCommunityPost = await Community.create({
      id: uuidv4(),
      content,
      userId: req.user.id
    });

    res.status(200).json(newCommunityPost);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

router.delete(
  "/:postId",
  authenticateToken,
  async (req: any, res: express.Response) => {
    try {
      const communityPost: any = await Community.findOne({
        where: { id: req.params.postId }
      });

      if (!communityPost) {
        return res.status(404);
      }

      if (req.user.id !== communityPost.userId) {
        return res.status(403);
      }

      await communityPost.destroy();
      res.status(204);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
);

router.patch(
  "/rate/:postId",
  authenticateToken,
  async (req: any, res: express.Response) => {
    try {
      const communityPost: any = await Community.findOne({
        where: { id: req.params.postId }
      });

      if (!communityPost) {
        return res.status(404);
      }

      const action = req.query.action;
      const communityLike: any = await CommunityLike.findOne({
        where: { userId: req.user.id, likedPostId: communityPost.id }
      });

      if (communityLike) {
        if (action === "like" && communityLike.like) {
          await communityLike.destroy();
          communityPost.likes--;
        } else if (action !== "like" && !communityLike.like) {
          await communityLike.destroy();
          communityPost.likes++;
        } else {
          communityLike.like = action === "like";
          communityPost.likes += action === "like" ? 1 : -1;
        }
      } else {
        await CommunityLike.create({
          id: uuidv4(),
          userId: req.user.id,
          likedPostId: communityPost.id,
          like: action === "like"
        });
        communityPost.likes += action === "like" ? 1 : -1;
      }

      await communityPost.save();
      res.status(204);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
);

router.patch(
  "/:postId",
  authenticateToken,
  async (req: any, res: express.Response) => {
    try {
      const { content } = req.body;
      if (!content) {
        return res.status(401);
      }

      const communityPost: any = await Community.findOne({
        where: { id: req.params.postId }
      });
      if (!communityPost) {
        return res.status(404);
      }

      if (req.user.id !== communityPost.userId) {
        return res.status(403);
      }

      communityPost.content = content;
      communityPost.edited = true;
      await communityPost.save();

      res.status(200).json(communityPost);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
);

// add comment route
router.post(
  "/comment/:postId",
  authenticateToken,
  async (req: any, res: express.Response) => {
    try {
      const { postId } = req.params;
      const post = await Community.findOne({ where: { id: postId } });
      if (!post) {
        return res.status(404);
      }

      const newComment = await CommunityComment.create({
        id: uuidv4(),
        content: req.body.content,
        userId: req.user.id,
        communityPostId: postId
      });

      res.status(200).json(newComment);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
);

router.delete(
  "/comment/:commentId",
  authenticateToken,
  async (req: any, res: express.Response) => {
    try {
      const comment: any = CommunityComment.findOne({
        where: { id: req.params.commentId }
      });
      if (!comment) {
        return res.status(404);
      }

      if (comment.userId !== req.user.id) {
        return res.status(403);
      }

      await comment.destroy();
      res.status(204);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
);

export default router;
