import { useContext } from "react";
import { UserContext } from "../lib/Context";

export const useUserContext = () => {
  const { user, setUser } = useContext(UserContext);
  return { user, setUser };
};
