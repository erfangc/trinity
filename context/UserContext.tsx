import React, {createContext, ReactNode, useEffect, useState} from "react";
import {User} from "@supabase/auth-js";
import {supabase} from "@/supabase";
import {registerForPushNotificationsAsync} from "@/registerForPushNotificationsAsync";

interface UserContextValue {
    user?: User;
}

const UserContext = createContext<UserContextValue>({});

export const UserContextProvider = ({children}: { children: ReactNode }) => {

    const [user, setUser] = useState<User>();

    useEffect(() => {
        const {data:{subscription}} = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
                const expoPushToken = await registerForPushNotificationsAsync();
                // TODO save the expoPushToken
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

export const useUser = () => {
    const userContextValue = React.useContext(UserContext);
    return userContextValue.user;
};