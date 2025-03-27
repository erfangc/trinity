import React, {createContext, useContext, useEffect, useState} from "react";
import {Audio} from "expo-av";

type GregorianChatContextType = {
    isPlaying: boolean;
    togglePlayPause: () => void;
};

const GregorianChantContext = createContext<GregorianChatContextType>({
    isPlaying: false,
    togglePlayPause: () => {},
});

export const useGregorianChant = () => useContext(GregorianChantContext);

export const GregorianChantContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if (sound) {
            sound.unloadAsync();
        }

        const loadAndPlay = async () => {
            const { sound } = await Audio.Sound.createAsync(
                require('../assets/audio/gregorian-chant.mp3'),
                { shouldPlay: true, isLooping: true }
            );
            setSound(sound);
            setIsPlaying(true);
        };

        loadAndPlay();

        return () => {
            sound?.unloadAsync();
        };
    }, []);

    const togglePlayPause = async () => {
        if (!sound) return;
        if (isPlaying) {
            await sound.pauseAsync();
        } else {
            await sound.playAsync();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <GregorianChantContext.Provider value={{ isPlaying, togglePlayPause }}>
            {children}
        </GregorianChantContext.Provider>
    );
};