import { View, Text, Pressable } from 'react-native';
import React from 'react'
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';

const Discussion = () => {
    return (
        <>
            <View style={tw`flex justify-center items-center bg-[#191327] h-full p-8`}>
                <View style={tw`justify-start items-start p-4`}>
                    <Text style={tw`text-left text-3xl text-[#fff]`}>Discussions</Text>
                    <Text style={tw`text-left text-base text-[#fff]`}>Join any Group to start a discussion on your book of Choice</Text>
                </View>
                <View style={tw`absolute bottom-12 right-5`}>
                    <Pressable onPress={() => console.log("Add topic")} style={tw`m-auto bg-[#808080] rounded-full p-4 shadow-xl`}>
                        <Ionicons name="add" size={32} color="white" />
                    </Pressable>
                </View>
            </View>
        </>
    )
}

export default Discussion;