import { Text, ScrollView, Image, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { fetchBookId } from '@/services/books';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';

type Book = {
  id: string;
  title: string;
  authors?: string[];
  description?: string;
  imageLinks?: {
    thumbnail?: string;
  };
};

const STORAGE_KEY = "bookedmarkBooks";

const BookDetails = () => {

  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [book, setBook] = useState<Book | null>(null);
  //click state for bookmarked
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchDetails = async () => {
      try {
        const res: any = await fetchBookId(id as string);
        console.log('Fetch book Details:', res);
        setBook(res);
      } catch (error: any) {
        console.log(error);
      }
    }
    fetchDetails();
  }, [id]);

  //check if book is bookmarked
  const checkIfBookmarked = async (bookId: string) => {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    const parsed: Book[] = stored ? JSON.parse(stored) : [];
    const found = parsed.find((b) => b.id === bookId);
    setBookmarked(!!found);
  };

  const toggleBookmark = async () => {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    const parsed: Book[] = stored ? JSON.parse(stored) : [];

    if (!book) return;

    const exists = parsed.find((b) => b.id === book.id);
    let updated: Book[];

    if (exists) {
      updated = parsed.filter((b) => b.id !== book.id);
      setBookmarked(false);
    } else {
      updated = [...parsed, book];
      setBookmarked(true);
    }

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };


  if (!book) return <Text style={{ textAlign: 'center', backgroundColor: '#191327', height: '100%', paddingVertical: 50, color: '#fff' }}>Loading...</Text>;

  return (
    <>
      <ScrollView style={tw`flex-1 bg-[#191327] p-12 h-full`}>
        <Image source={{ uri: book?.imageLinks?.thumbnail }} style={tw`rounded-xl m-auto w-50 h-50`} />
        <Text style={tw`text-white text-2xl font-bold mt-4`}>{book?.title}</Text>
        <Text style={tw`text-white text-lg mt-2`}>{book?.authors?.join(', ')}</Text>
        <Text style={tw`text-white text-lg mt-2`}>{book?.description}</Text>
        <Ionicons
          name='bookmark'
          size={32}
          color={bookmarked ? '#FFB900' : '#FFF'}
          onPress={toggleBookmark}
          style={tw`absolute top-4 right-4`}
        />
        <Pressable
          style={tw`absolute top-24 right-4`}
          onPress={() =>
            router.push({
              pathname: '/read',
              params: { id }
            })}>
          <Ionicons name="book" size={30} color={'#fff'} />
        </Pressable>
      </ScrollView>
    </>
  )
}

export default BookDetails;