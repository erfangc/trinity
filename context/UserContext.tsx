import {createContext, ReactNode, useEffect, useState} from "react";
import {User} from "@supabase/auth-js";
import {supabase} from "@/supabase";
import {registerForPushNotificationsAsync} from "@/registerForPushNotificationsAsync";
import {savePushToken} from "@/savePushToken";

interface UserContextValue {
    user?: User;
}

const UserContext = createContext<UserContextValue>({});

export const UserContextProvider = ({children}: { children: ReactNode }) => {

    const [user, setUser] = useState<User>();

    useEffect(() => {
        const subscription = supabase.auth.onAuthStateChange((event, session) => {
            if (event === "SIGNED_IN" || event === "USER_UPDATED") {
                registerForPushNotificationsAsync().then(
                    token => {
                        if (token) {
                            savePushToken(token);
                        }
                    }
                )
                setUser(session?.user);
            } else if (event === "SIGNED_OUT") {
                setUser(undefined);
            }
        }).data.subscription;

        return subscription.unsubscribe;

    }, []);

    return (
        <UserContext.Provider value={{user}}>
            {children}
        </UserContext.Provider>
    );
};
