import { combineReducers } from "redux";
import { user } from "./user";

const rootReducer = combineReducers({
  userState: user,
});

export default rootReducer;
