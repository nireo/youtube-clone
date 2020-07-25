import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import userReducer from "./userReducer";
import videoReducer from "./videoReducer";
import notificationReducer from "./notificationReducer";

const rootReducer = combineReducers({
  user: userReducer,
  videos: videoReducer,
  notifications: notificationReducer
});

const store = createStore(rootReducer, applyMiddleware(thunk));
export type AppState = ReturnType<typeof rootReducer>;
export default store;
