import { io } from "socket.io-client";
import { deployApi, devApi } from "../data/env";
export const ws = io(devApi || deployApi);
