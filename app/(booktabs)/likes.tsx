import { View, Text, FlatList, Image, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import React, { useCallback, useState } from 'react';
import tw from 'twrnc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';

const Likes = () => {

  //liked books state
  const [likedBooks, setLikedBooks] = useState<any[]>([]);

  //load liked books
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const getLikedBooks = async () => {
        setLoading(true);
        try {
          const saved = await AsyncStorage.getItem('likedBooks');
          if (saved) {
            setLikedBooks(JSON.parse(saved));
          }
        } catch (err) {
          console.error("Failed to load liked books", err);
        } finally {
          setLoading(false);
        }
      };

      getLikedBooks();
    }, [])
  );

  //refresh liked books
  const handleRefresh = async () => {
    setLoading(true);
    try {
      const saved = await AsyncStorage.getItem('likedBooks');
      if (saved) {
        setLikedBooks(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Refresh failed", error);
    } finally {
      setLoading(false);
    }
  };



  return (
    <View style={tw`flex-1 bg-[#191327] pt-12 h-full`}>
      <Text style={tw`text-center text-white text-2xl mb-4`}>Your Likes 💟</Text>
      <View style={tw`p-4`}>
        {loading ?
          <View style={tw`flex-1 justify-center items-center`}>
            <ActivityIndicator size="large" color="white" />
          </View>
          :
          <FlatList
            data={likedBooks}
            keyExtractor={(item) => item?.title}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => router.push("/characters/index")} style={tw`mb-6 p-4 bg-[#2a213f] rounded-xl`}>
                <Image
                  source={{ uri: item?.cover }}
                  style={tw`w-full h-52 rounded-lg mb-3`}
                  resizeMode="cover"
                />
                <Text style={tw`text-white text-xl font-bold`}>Title: {item?.title}</Text>
                <Text style={tw`text-white text-sm mt-1`}>
                  Pages: {item?.pages} | {item?.releaseDate}
                </Text>
              </TouchableOpacity>
            )}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={handleRefresh}
                colors={["#fff"]}
                tintColor={"#fff"}
              />
            }
            ListEmptyComponent={
              <View style={tw`flex-1 justify-center items-center`}>
                <Text style={tw`text-white text-lg`}>No liked books yet</Text>
              </View>
            }
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={tw`h-4`} />}
          />
        }
      </View>
    </View>
  );
};

export default Likes;
