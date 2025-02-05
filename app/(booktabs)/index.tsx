import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import tw from 'twrnc';

const data = [
  { id: 1, name: 'Souls of Wealth' },
  { id: 2, name: 'The Alchemist' },
  { id: 3, name: 'The Billion Man' },
  { id: 4, name: 'The Billion Man' },
  { id: 5, name: 'The Billion Man' },
  { id: 6, name: 'The Billion Man' },
];
const HomeScreen = () => {
  return (
    <View style={tw`flex-1 h-full bg-[#191327]`}>
      <Text style={tw`text-white text-4xl py-4 px-3 mt-24`}>Welcome Back! 📚 </Text>

      <View style={tw`p-4 gap-5`}>
        <Text style={tw`text-white text-left text-xl`}>Continue Reading</Text>
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <>
              <TouchableOpacity style={tw`flex justify-center items-center gap-4 bg-white rounded-lg px-3 py-4`}>
                <Text>{item.name}</Text>
              </TouchableOpacity>
            </>
          )}
          keyExtractor={(item: any) => item.id}
          horizontal={true}
          ItemSeparatorComponent={() => {
            return (
                <View
                    style={{
                        height: "100%",
                        width: 10,
                    }} />
            );
        }}
        />
      </View>
    </View>
  )
}

export default HomeScreen;