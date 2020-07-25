import express from "express";
import authenticateToken from "../../middlewares/tokenAuth";
import { Notification } from "../../sequelize";

const router: express.Router = express.Router();

router.patch(
  "/:notificationId",
  authenticateToken,
  async (req: any, res: express.Response) => {
    try {
      const { notificationId } = req.params;

      const notification: any = await Notification.findOne({
        where: { id: notificationId }
      });

      if (!notification) {
        return res.status(404);
      }

      if (notification.userId !== req.user.id) {
        return res.status(403);
      }

      notification.read = true;

      await notification.save();
      res.status(204);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
);

router.get("/", authenticateToken, async (req: any, res: express.Response) => {
  try {
    const notifications = await Notification.findAll({
      where: { toUserId: req.user.id }
    });

    res.json(notifications);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

router.delete(
  "/:notificationId",
  authenticateToken,
  async (req: any, res: express.Response) => {
    try {
      const { notificationId } = req.params;

      const notification: any = await Notification.findOne({
        where: { id: notificationId }
      });

      if (!notification) {
        return res.status(404);
      }

      if (notification.userId !== req.user.id) {
        return res.status(403);
      }

      await notification.destroy();
      res.status(204);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
);

export default router;
