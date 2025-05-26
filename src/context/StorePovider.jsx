import { useReducer } from "react";
import { decode_token } from "../utils";
import storeContext from "./storeContext";
import storeReducer from "./storeReducer";

const StoreProvider = ({ children }) => {
  const token = localStorage.getItem("newsToken") || "";
  const userInfo = decode_token(token);

  const initialState = {
    userInfo,
    token,
    categories: [],
  };

  const [store, dispatch] = useReducer(storeReducer, initialState);

  return (
    <storeContext.Provider value={{ store, dispatch }}>
      {children}
    </storeContext.Provider>
  );
};

export default StoreProvider;
