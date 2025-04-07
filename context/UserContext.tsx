import React, {createContext, ReactNode, useEffect, useState} from "react";
import {User} from "@supabase/auth-js";
import {supabase} from "@/supabase";
import {registerForPushNotificationsAsync} from "@/registerForPushNotificationsAsync";
import {api} from "@/sdk";

interface UserContextValue {
    user?: User;
}

const UserContext = createContext<UserContextValue>({});

export const UserContextProvider = ({children}: { children: ReactNode }) => {

    const [user, setUser] = useState<User>();

    useEffect(() => {
        const {data: {subscription}} = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
                const expoPushToken = await registerForPushNotificationsAsync();
                if (expoPushToken) {
                    await supabase.auth.updateUser({data: {expoPushToken: [expoPushToken]}});
                } else {
                    console.log(
                        "Failed to register for push notifications"
                    );
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

export const useUser = () => {
    const userContextValue = React.useContext(UserContext);
    return userContextValue.user;
};