import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router';

const ReadLayout = () => {
    return (
        <>
            <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
            </Stack>
        </>
    )
}

export default ReadLayout;