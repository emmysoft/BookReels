import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tw from 'twrnc';
import { fetchBookId } from '@/services/books';

type Book = {
  title: string;
  previewLink: string;
  description: string;
  authors: string
}

const Read = () => {
  const { id }: any = useLocalSearchParams();
  const [book, setBook] = useState<Book | null>(null);

  useEffect(() => {
    const load = async () => {
      const res: any = await fetchBookId(id as string);
      console.log('Read link:', res)
      setBook(res);
      await AsyncStorage.setItem('readingProgress', JSON.stringify({ [id]: true }));
    };
    load();
  }, [id]);

  if (!book) return <Text style={tw`text-white`}>Loading...</Text>;

  return (
    <ScrollView style={tw`bg-[#191327] p-20 h-full flex-1`}>
      <View style={tw`flex justify-center items-center gap-4`}>
        <Text style={tw`text-white text-2xl mb-4`}>{book.title}</Text>
        <Text style={tw`text-white text-2xl mb-4`}>{book.authors}</Text>
      </View>
      <Text style={tw`text-white h-full text-xl`}>{book.description || 'No preview available'}</Text>
    </ScrollView>
  );
}

export default Read;