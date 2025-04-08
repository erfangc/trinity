import React, {ReactNode, useEffect, useState, createContext} from "react";
import {User} from "@supabase/auth-js";
import {supabase} from "@/supabase";
import {registerForPushNotificationsAsync} from "@/registerForPushNotificationsAsync";
import { UserContext } from "./UserContext";

export const UserContextProvider = ({children}: { children: ReactNode }) => {

    const [user, setUser] = useState<User>();

    useEffect(() => {
        const {data: {subscription}} = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
                const expoPushToken = await registerForPushNotificationsAsync();
                if (expoPushToken) {
                    await supabase.auth.updateUser({data: {expoPushToken: [expoPushToken]}});
                }
                setUser(session?.user);
            } else if (event === 'USER_UPDATED') {
                setUser(session?.user);
            } else if (event === "SIGNED_OUT") {
                setUser(undefined);
            }
        });

        return subscription.unsubscribe;
    }, []);

    return (
        <UserContext.Provider value={{user}}>
            {children}
        </UserContext.Provider>
    );
};
