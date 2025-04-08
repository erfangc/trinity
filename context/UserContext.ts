import {createContext} from "react";
import {User} from "@supabase/auth-js";


export interface UserContextValue {
    user?: User;
}

export const UserContext = createContext<UserContextValue>({});