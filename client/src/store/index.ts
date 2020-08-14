import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import userReducer from "./userReducer";
import notificationReducer from "./notificationReducer";
import subscriptionsReducer from "./subscriptionReducer";
import playlistReducer from "./playlistReducer";

const rootReducer = combineReducers({
  user: userReducer,
  notifications: notificationReducer,
  subscriptions: subscriptionsReducer,
  playlists: playlistReducer
});

const store = createStore(rootReducer, applyMiddleware(thunk));
export type AppState = ReturnType<typeof rootReducer>;
export default store;
