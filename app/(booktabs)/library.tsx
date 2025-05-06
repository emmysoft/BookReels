import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Image, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import tw from 'twrnc';

type Book = {
  id: string;
  title: string;
  authors?: string[];
  imageLinks?: {
    thumbnail?: string;
  };
};

const STORAGE_KEY = 'bookmarkedBooks';

const Library = () => {
  const [bookmarkedBooks, setBookmarkedBooks] = useState<Book[]>([]);
  const router = useRouter();

  const loadBookmarkedBooks = async () => {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    setBookmarkedBooks(parsed);
  };

  useFocusEffect(
    useCallback(() => {
      loadBookmarkedBooks();
    }, [])
  );

  const renderItem = ({ item }: { item: Book }) => (
    <Pressable
      onPress={() => router.push({ pathname: '/bookdetails', params: { id: item.id } })}
      style={tw`mb-4 bg-[#28203F] p-4 rounded-xl justify-center items-center`}
    >
      <Image
        source={{ uri: item.imageLinks?.thumbnail }}
        style={tw`w-36 h-36 rounded-md`}
      />
      <Text style={tw`text-white text-lg mt-2`}>{item.title}</Text>
      <Text style={tw`text-gray-400 text-sm`}>
        {item.authors?.join(', ') || 'Unknown'}
      </Text>
    </Pressable>
  );

  if (bookmarkedBooks.length === 0) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-[#191327]`}>
        <Text style={tw`text-white text-xl`}>No bookmarked books yet.</Text>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-[#191327] h-full`}>
      <View style={tw`flex justify-start items-start gap-4 py-12 px-5`}>
        <FlatList
          data={bookmarkedBooks}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
};

export default Library;
