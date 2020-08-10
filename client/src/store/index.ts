import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import userReducer from "./userReducer";
import videoReducer from "./videoReducer";
import notificationReducer from "./notificationReducer";
import subscriptionsReducer from "./subscriptionReducer";
import playlistReducer from "./playlistReducer";

const rootReducer = combineReducers({
  user: userReducer,
  videos: videoReducer,
  notifications: notificationReducer,
  subscriptions: subscriptionsReducer,
  playlists: playlistReducer
});

const store = createStore(rootReducer, applyMiddleware(thunk));
export type AppState = ReturnType<typeof rootReducer>;
export default store;
