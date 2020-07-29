import { Sequelize } from "sequelize";
import VideoModel from "./components/videos/model";
import UserModel from "./components/users/model";
import CommentModel from "./components/comments/model";
import SubscriptionModel from "./components/users/subscribeModel";
import CommentLikeModel from "./components/comments/commentLikeModel";
import VideoLikeModel from "./components/videos/videoLikeModel";
import PlaylistModel from "./components/playlists/model";
import NotificationModel from "./components/notifications/model";
import CommunityModel from "./components/community/model";
import CommunityLikeModel from "./components/community/communityLikeModel";

let database = "youtube";
if (process.env.NODE_ENV === "test") {
  database = "youtubetest";
}

export const sequelize = new Sequelize(database, "postgres", "password", {
  host: "localhost",
  dialect: "postgres",
  logging: false
});
(async () => await sequelize.sync({ alter: true }))();

// model definitions
export const Video = VideoModel(sequelize);
export const User = UserModel(sequelize);
export const Comment = CommentModel(sequelize);
export const Subscription = SubscriptionModel(sequelize);
export const CommentLike = CommentLikeModel(sequelize);
export const VideoLike = VideoLikeModel(sequelize);
export const Playlist = PlaylistModel(sequelize);
export const Notification = NotificationModel(sequelize);
export const Community = CommunityModel(sequelize);
export const CommunityLike = CommunityLikeModel(sequelize);

// associations
Video.belongsTo(User, { foreignKey: "userId" });

Video.hasMany(Comment, { foreignKey: "videoId" });
User.hasMany(Comment, { foreignKey: "userId" });
Comment.belongsTo(User, { foreignKey: "userId" });

Playlist.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Notification, { foreignKey: "toUserId" });

Notification.belongsTo(User, { foreignKey: "userId" });
Notification.hasOne(Video, { foreignKey: "videoId" });

Community.belongsTo(User, { foreignKey: "userId" });
