import React, {
  useState,
  useEffect,
  useCallback,
  MouseEvent,
  ChangeEvent,
  Dispatch,
  SetStateAction
} from "react";
import { connect } from "react-redux";
import { AppState } from "../../store";
import { Video } from "../../interfaces/Video";
import {
  getSingleVideo,
  likeVideoService,
  dislikeVideoService
} from "../../services/video";
import { Comment, RateComment } from "../../interfaces/Comment";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import { User } from "../../interfaces/User";
import { createComment, rateComment } from "../../services/comment";
import { Helmet } from "react-helmet";
import Grid from "@material-ui/core/Grid";
import { SmallListVideo } from "../other/SmallListVideo";
import {
  subscribeToUserAction,
  removeSubscriptionAction
} from "../../store/subscriptionReducer";
import { PlaylistVideoEntry } from "../other/VideoPlaylistEntry";
import CommentField from "./WatchPageComponents/CommentField";
import VideoInformation from "./WatchPageComponents/VideoInformation";

type Props = {
  id: string;
  user: User | null;
  subscriptions: User[];
  subscribeToUserAction: (userId: string) => void;
  removeSubscriptionAction: (userId: string) => void;
  playlistMode?: boolean;
  playlistVideos?: any;
  setSelectedVideo?: Dispatch<SetStateAction<Video | null>>;
  selectedVideo?: Video | null;
};

interface WatchPage {
  comments: Comment[];
  video: Video;
  next: Video[];
  likeStatus: number;
}

const WatchVideo: React.FC<Props> = ({
  id,
  user,
  subscriptions,
  subscribeToUserAction,
  removeSubscriptionAction,
  playlistMode,
  playlistVideos,
  setSelectedVideo,
  selectedVideo
}) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [video, setVideo] = useState<WatchPage | null>(null);
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [subscribed, setSubscribed] = useState<boolean | null>(null);
  const [currentVideoId, setCurrentVideoId] = useState<string>("");

  // 0=no like, 1=liked, 2=disliked
  const [likeStatus, setLikeStatus] = useState<number>(0);

  const loadVideo = useCallback(async () => {
    const data = await getSingleVideo(id);
    setVideo(data);
    setComments(data.comments);
    setLikeStatus(data.likeStatus);
  }, [id]);

  useEffect(() => {
    if (!loaded && video === null) {
      setCurrentVideoId(id);
      loadVideo();
      setLoaded(true);
    }

    if (subscribed === null && user && video && subscriptions.length) {
      const found = subscriptions.find(
        (subscription: User) => subscription.id === video.video.userId
      );

      if (found) {
        setSubscribed(true);
      } else {
        setSubscribed(false);
      }
    }

    if (selectedVideo && selectedVideo.id !== currentVideoId) {
      setVideo(null);
      setLoaded(false);
    }
  }, [
    loaded,
    video,
    loadVideo,
    user,
    subscribed,
    subscriptions,
    selectedVideo,
    id,
    currentVideoId
  ]);

  const handleSubscribe = async () => {
    if (user !== null && video !== null && video.video.User !== undefined) {
      subscribeToUserAction(video.video.User.id);
      setSubscribed(true);
    }
  };

  const handleUnsubscribe = async () => {
    if (user !== null && video !== null && video.video.User !== undefined) {
      removeSubscriptionAction(video.video.User.id);
      setSubscribed(false);
    }
  };

  const handleCommentCreation = async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user && video === null) {
      return;
    }

    let content = await createComment(id, { content: comment });
    let copy = video;
    // typescript for some reason requires a check that copy is not null
    if (copy === null) {
      return;
    }

    copy.comments = [...copy.comments, content];

    setVideo(copy);
  };

  const handleCommentRate = async (action: RateComment, commentId: string) => {
    if (comments === null) {
      return;
    }

    // check if the comment exists here, so that we can save calling the back-end if it doesn't
    let ratedComment = comments.find((c: Comment) => c.id === commentId);
    if (!ratedComment) {
      return;
    }

    await rateComment(action, commentId);
    if (action === "like") {
      ratedComment.likes++;
    } else if (action === "dislike") {
      ratedComment.dislikes++;
    }

    // update comments array
    const updatedComments = comments.map((c: Comment) =>
      c.id === commentId && ratedComment !== undefined ? ratedComment : c
    );
    if (!updatedComments) {
      return;
    }

    setComments(updatedComments);
  };

  const handleVideoLike = async () => {
    if (video === null) return;
    await likeVideoService(id);
    let copy: WatchPage = video;
    copy.video.likes++;

    setVideo(copy);
  };

  const handleVideoDislike = async () => {
    if (video === null) return;
    await dislikeVideoService(id);
    let copy: WatchPage = video;
    copy.video.dislikes--;

    setVideo(copy);
  };

  return (
    <Container maxWidth="xl">
      {video !== null && comments !== null && (
        <div style={{ marginTop: "2rem" }}>
          <Helmet>
            <meta charSet="utf-8" />
            <title>{video.video.title} - TypeTube</title>
          </Helmet>
          <Grid container spacing={2}>
            <Grid item xs={12} lg={9} md={9}>
              <video style={{ width: "100%" }} controls>
                <source
                  src={`http://localhost:3001/video/${video.video.id}.${video.video.fileExtension}`}
                  type="video/webm"
                />
              </video>
              <VideoInformation
                subscribed={subscribed}
                video={video.video}
                handleUnsubscribe={handleUnsubscribe}
                handleSubscribe={handleSubscribe}
              />
            </Grid>
            <Grid item sm={12} lg={3} md={3}>
              {playlistMode &&
                playlistVideos &&
                setSelectedVideo &&
                selectedVideo && (
                  <div
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      padding: "1rem 1rem"
                    }}
                  >
                    <Typography>Playlist videos</Typography>
                    <Divider />
                    {playlistVideos.map((video: any) => (
                      <PlaylistVideoEntry
                        video={video[0]}
                        key={video[0].id}
                        setSelectedVideo={setSelectedVideo}
                        selectedVideoId={selectedVideo.id}
                      />
                    ))}
                  </div>
                )}
              <div style={{ marginTop: "1rem" }}>
                {video.next.map((video: Video) => (
                  <SmallListVideo key={video.id} video={video} />
                ))}
              </div>
            </Grid>
          </Grid>
          <Grid container>
            <Grid sm={12} lg={9} md={9}>
              <CommentField
                comments={video.comments}
                handleCommentRate={handleCommentRate}
                handleCommentCreation={handleCommentCreation}
              />
            </Grid>
          </Grid>
        </div>
      )}
    </Container>
  );
};

const mapStateToProps = (state: AppState) => ({
  videos: state.videos,
  user: state.user,
  subscriptions: state.subscriptions
});

export default connect(mapStateToProps, {
  removeSubscriptionAction,
  subscribeToUserAction
})(WatchVideo);
