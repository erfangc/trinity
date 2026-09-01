import React, {createContext, useContext} from "react";
import {useAudioPlayer, useAudioPlayerStatus} from "expo-audio";

type GregorianChatContextType = {
    isPlaying: boolean;
    togglePlayPause: () => void;
};

const GregorianChantContext = createContext<GregorianChatContextType>({
    isPlaying: false,
    togglePlayPause: () => {},
});

export const useGregorianChant = () => useContext(GregorianChantContext);

const chantSource = require('../assets/audio/gregorian-chant.mp3');

export const GregorianChantContextProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const player = useAudioPlayer(chantSource);
    const status = useAudioPlayerStatus(player);

    const togglePlayPause = () => {
        if (status.playing) {
            player.pause();
        } else {
            player.loop = true;
            player.play();
        }
    };

    return (
        <GregorianChantContext.Provider value={{isPlaying: status.playing, togglePlayPause}}>
            {children}
        </GregorianChantContext.Provider>
    );
};
