import express from "express";
import { Notification, User } from "../../sequelize";
import withAuth from "../../utils/withAuth";

const router: express.Router = express.Router();

router.patch(
  "/:notificationId",
  withAuth,
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

router.get("/", withAuth, async (req: any, res: express.Response) => {
  try {
    const notifications = await Notification.findAll({
      where: { toUserId: req.user.id },
      include: User
    });

    res.json(notifications);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

router.get(
  "/:notificationId",
  withAuth,
  async (req: any, res: express.Response) => {
    try {
      const notification = await Notification.findOne({
        where: { id: req.params.notificationId }
      });

      if (!notification) {
        return res.status(404);
      }

      res.status(200).json(notification);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
);

router.delete(
  "/:notificationId",
  withAuth,
  async (req: any, res: express.Response) => {
    try {
      const { notificationId } = req.params;

      console.log(notificationId);

      const notification: any = await Notification.findOne({
        where: { id: notificationId }
      });

      if (!notification) {
        return res.status(404);
      }

      await notification.destroy();
      res.status(204);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
);

export default router;
