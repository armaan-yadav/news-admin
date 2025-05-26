import { decode_token } from "../utils/index";

const storeReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case "login_success":
      return {
        ...state,
        token: payload.token,
        userInfo: decode_token(payload.token),
      };

    case "logout":
      return {
        ...state,
        token: "",
        userInfo: "",
        categories: [],
      };

    case "set_categories":
      return {
        ...state,
        categories: payload,
      };

    default:
      return state;
  }
};

export default storeReducer;
