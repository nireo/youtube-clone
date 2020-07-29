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

export default router;
