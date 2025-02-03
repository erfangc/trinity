import * as SecureStore from "expo-secure-store";

export async function saveCredentials(key: string, value: string) {
    try {
        await SecureStore.setItemAsync(key, value, {
            keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
        });
        console.log("Credentials saved securely!");
    } catch (error) {
        console.error("Error saving credentials: ", error);
    }
}

export async function getCredentials(key: string) {
    try {
        const value = await SecureStore.getItemAsync(key);
        if (value) {
            console.log("Retrieved securely stored value:", value);
            return value;
        } else {
            console.log("No stored value for key.");
            return null;
        }
    } catch (error) {
        console.error("Error retrieving credentials: ", error);
        return null;
    }
}

export async function removeCredentials(key: string) {
    try {
        await SecureStore.deleteItemAsync(key);
        console.log("Credentials removed securely!");
    } catch (error) {
        console.error("Error removing credentials: ", error);
    }
}