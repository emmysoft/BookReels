import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import Login from './(auth)';
import tw from 'twrnc';

const HomeScreen = () => {

    const [showSplash, setShowSplash] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setShowSplash(true)
        }, 5000);
    });

    return (
        <>
            {showSplash ?
                <View style={tw`flex-1 justify-center items-center bg-[#191327]`}>
                    <Text style={tw`text-3xl text-white`}>BookReels</Text>
                </View>
                :
                <Login />
            }
        </>
    )
}

export default HomeScreen;