import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import tw from 'twrnc';
import { router } from 'expo-router';
// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import { AUTH } from '@/firebase.config';
import Toast from 'react-native-toast-message';
import authService from '@/services/auth.service';

const SignUp = () => {

  // const auth = AUTH;

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  //function to check if passwords match while still typing
  const handleConfirmPassword = (text: string) => {
    setConfirmPassword(text);
    if (text !== password) {
      Toast.show({
        type: 'error',
        text1: 'Passwords do not match',
        text2: 'Try again'
      })
    }
  }

  const handleRegister = async () => {
    setLoading(true);
    if (password !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Passwords do not match',
        text2: 'Try again'
      })
    };
    try {
      const res = await authService.register({ name, username, email, password });
      console.log("user details:", JSON.stringify(res?.data, null, 2));
      Toast.show({
        type: 'success',
        text1: 'Registration successful',
      })
      router.push('/(booktabs)');
    } catch (error: any) {
      console.log(error?.response?.data?.message);
      Toast.show({
        type: 'error',
        text1: 'Registration Failed!',
        text2: error?.response?.data?.message
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
              value={name}
              onChangeText={(text: string) => setName(text)}
              placeholder='Name'
              placeholderTextColor={'#fff'}
              style={tw`p-4 w-full text-[#fff] text-xl rounded-xl border-2 border-[#fff]`}
            />

            <TextInput
              value={username}
              onChangeText={(text: string) => setUsername(text)}
              placeholder='Username'
              placeholderTextColor={'#fff'}
              style={tw`p-4 w-full text-[#fff] text-xl rounded-xl border-2 border-[#fff]`}
            />

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
              secureTextEntry={true}
            />
            <TextInput
              value={confirmPassword}
              onChangeText={handleConfirmPassword}
              placeholder='Confirm Password'
              placeholderTextColor={'#fff'}
              style={tw`p-4 w-full text-[#fff] text-xl rounded-xl border-2 border-[#fff]`}
              secureTextEntry={true}
            />
          </View>

          {loading ?
            <View style={tw`m-auto`}>
              <ActivityIndicator size="large" color="#fff" />
            </View>
            :
            <Pressable
              disabled={!name || !email || !password || !confirmPassword}
              onPress={() => handleRegister()}
              style={tw`flex-row justify-center items-center gap-2 bg-[#fff] p-4 rounded-xl w-full`}>
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