import React from 'react'
import { Stack } from 'expo-router'

const OnboardingLayout = () => {
    return (
        <>
            <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
            </Stack>
        </>
    )
}

export default OnboardingLayout;