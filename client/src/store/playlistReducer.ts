import { Playlist } from "../interfaces/Playlist";
import { Dispatch } from "redux";
import { getUserPlaylists } from "../services/playlist";

const reducer = (state: Playlist[] = [], action: any) => {
  switch (action.type) {
    case "INIT_PLAYLISTS":
      return action.data;
    default:
      return state;
  }
};

export const initPlaylistsAction = () => {
  return async (dispatch: Dispatch) => {
    const playlists = await getUserPlaylists();
    dispatch({
      type: "INIT_PLAYLISTS",
      data: playlists
    });
  };
};

export default reducer;
