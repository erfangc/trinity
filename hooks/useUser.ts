import React from "react";
import {UserContext} from "@/context/UserContext";

export const useUser = () => {
    const userContextValue = React.useContext(UserContext);
    return userContextValue.user;
};