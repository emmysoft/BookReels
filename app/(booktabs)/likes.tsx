import { View, Text, FlatList, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import tw from 'twrnc';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Likes = () => {
  const [likedBooks, setLikedBooks] = useState<any[]>([]);

  useEffect(() => {
    const getLikedBooks = async () => {
      const saved = await AsyncStorage.getItem('likedBooks');
      if (saved) {
        setLikedBooks(JSON.parse(saved));
      }
    };
    getLikedBooks();
  }, []);

  return (
    <View style={tw`flex-1 bg-[#191327] pt-12 h-full`}>
      <Text style={tw`text-center text-white text-2xl mb-4`}>Your Likes 💟</Text>
      <View style={tw`p-4`}>
        <FlatList
          data={likedBooks}
          keyExtractor={(item) => item?.title}
          renderItem={({ item }) => (
            <View style={tw`mb-6 p-4 bg-[#2a213f] rounded-xl`}>
              <Image
                source={{ uri: item?.cover }}
                style={tw`w-full h-52 rounded-lg mb-3`}
                resizeMode="cover"
              />
              <Text style={tw`text-white text-xl font-bold`}>Title: {item?.title}</Text>
              <Text style={tw`text-white text-sm mt-1`}>
                Pages: {item?.pages} | {item?.releaseDate}
              </Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default Likes;
