import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import tw from 'twrnc';
import { router } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { AUTH } from '@/firebase.config';
import Toast from 'react-native-toast-message';

const SignUp = () => {

  const auth = AUTH;

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    setLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      console.log(res);
      Toast.show({
        type: 'success',
        text1: 'Registration successful',
      })
      router.push('/(auth)');
    } catch (error: any) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: 'Registration Failed!',
        text2: 'Try again'
      })
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <View style={tw`flex-1 justify-center items-center bg-[#191327] h-full p-12 w-full`}>
        <View style={tw`flex justify-start items-start w-full gap-12`}>
          <Text style={tw`text-center text-3xl text-[#fff]`}>Register Here</Text>
          <View style={tw`flex justify-center items-center w-full gap-6`}>
            <TextInput
              value={email}
              onChangeText={(text: string) => setEmail(text)}
              placeholder='Email'
              placeholderTextColor={'#fff'}
              style={tw`p-4 w-full text-[#fff] text-xl rounded-xl border-2 border-[#fff]`}
            />

            <TextInput
              value={password}
              onChangeText={(text: string) => setPassword(text)}
              placeholder='Password'
              placeholderTextColor={'#fff'}
              style={tw`p-4 w-full text-[#fff] text-xl rounded-xl border-2 border-[#fff]`}
            />
          </View>

          {loading ?
            <View style={tw`m-auto`}>
              <ActivityIndicator size="large" color="#fff" />
            </View>
            :
            <Pressable onPress={() => handleRegister()} style={tw`flex-row justify-center items-center gap-2 bg-[#fff] p-4 rounded-xl w-full`}>
              <Text style={tw`text-[#191327] text-xl`}>Register</Text>
            </Pressable>
          }
          <Pressable onPress={() => router.push('/(auth)')} style={tw`flex-row justify-center items-center gap-4`}>
            <Text style={tw`text-[#fff] underline`}>Already have an account? Login Here</Text>
          </Pressable>
        </View>
      </View>
    </>
  )
}

export default SignUp;