import { View, Text, TextInput, Pressable } from 'react-native'
import React, { useState } from 'react'
import tw from 'twrnc';
import { router } from 'expo-router';

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <>
            <View style={tw`flex-1 justify-center items-center bg-[#191327] h-full p-24`}>
                <Text style={tw`text-center text-xl text-[#000]`}>Login</Text>
                <View style={tw`flex justify-center items-center w-full gap-4`}>
                    <TextInput
                        value={email}
                        onChangeText={(text: string) => setEmail(text)}
                        placeholder='Email'
                        placeholderTextColor={'#fff'}
                        style={tw`p-4 w-full text-[#fff] rounded-xl border-2 border-[#fff]`}
                    />

                    <TextInput
                        value={password}
                        onChangeText={(text: string) => setPassword(text)}
                        placeholder='Password'
                        placeholderTextColor={'#fff'}
                        style={tw`p-4 w-full text-[#fff] rounded-xl border-2 border-[#fff]`}
                    />
                </View>
                <Pressable onPress={() => router.push('/signup')} style={tw`flex-row justify-center items-center gap-2`}>
                    <Text style={tw`text-[#000]`}>Don't have an account? </Text>
                    <Text style={tw`text-[#fff]`}>Sign Up</Text>
                </Pressable>
            </View>
        </>
    )
}

export default Login