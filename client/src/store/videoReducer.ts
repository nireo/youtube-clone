import { Dispatch } from "redux";
import {
  getVideos,
  updateVideo,
  rateVideo,
  deleteVideo
} from "../services/video";
import { Video, UpdateVideo, RateActions } from "../interfaces/Video";

const reducer = (state: Video[] = [], action: any) => {
  switch (action.type) {
    case "INIT":
      return action.data;
    case "DELETE":
      return state.filter((video: Video) => video.id !== action.id);
    case "RATE":
      let updated = state.find((video: Video) => video.id === action.id);
      if (!updated) {
        return state;
      }

      if (action.data === "like") {
        updated = { ...updated, likes: updated.likes++ };
      } else {
        updated = { ...updated, likes: updated.dislikes++ };
      }

      return state.map((video: Video) =>
        video.id === action.id ? updated : video
      );
    case "UPDATE":
      return state.map((video: Video) =>
        video.id === action.id ? action.data : video
      );

    default:
      return state;
  }
};

export const getVideosAction = () => {
  return async (dispatch: Dispatch) => {
    const videos = await getVideos();
    dispatch({
      type: "INIT",
      data: videos
    });
  };
};

export const updateVideoAction = (videoId: string, newInfo: UpdateVideo) => {
  return async (dispatch: Dispatch) => {
    const newVideo = await updateVideo(videoId, newInfo);
    dispatch({
      type: "UPDATE",
      id: videoId,
      data: newVideo
    });
  };
};

export const rateVideoAction = (action: RateActions, videoId: string) => {
  return async (dispatch: Dispatch) => {
    await rateVideo(action, videoId);
    dispatch({
      type: "RATE",
      id: videoId,
      data: action
    });
  };
};

export const deleteVideoAction = (videoId: string) => {
  return async (dispatch: Dispatch) => {
    await deleteVideo(videoId);
    dispatch({
      type: "DELETE",
      id: videoId
    });
  };
};

export default reducer;
