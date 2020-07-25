import { Notification } from "../interfaces/Notification";

const reducer = (state: Notification[] = [], action: any) => {
  switch (action.type) {
    case "INIT":
      return action.data;
    default:
      return state;
  }
};

export default reducer;
