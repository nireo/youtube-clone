import express from "express";
import { User, Community } from "../../sequelize";
import authenticateToken from "../../middlewares/tokenAuth";
import { v4 as uuidv4 } from "uuid";

const router: express.Router = express.Router();

router.get("/:userId", async (req: express.Request, res: express.Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(204);
    }

    const communityPosts = await Community.findAll({ where: { userId } });
    res.status(200).json(communityPosts);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

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

export default router;
