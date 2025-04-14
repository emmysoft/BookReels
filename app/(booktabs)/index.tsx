import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from 'twrnc';
import bookService from '@/services/books';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const HomeScreen = () => {

  const router = useRouter();

  //state for book data
  const [books, setBooks] = useState<any[]>([]);

  //like state
  const [isLikedBooks, setIsLikedBooks] = useState<any[]>([]);

  //like handler
  const handleLike = async (book: any) => {
    const alreadyLiked = isLikedBooks.some((b) => b.title === book?.title);
    console.log(book?.title);
    const updatedLikes = alreadyLiked
      ? isLikedBooks.filter((b) => b.title !== book?.title)
      : [...isLikedBooks, book];
  
    setIsLikedBooks(updatedLikes);
    await AsyncStorage.setItem('likedBooks', JSON.stringify(updatedLikes));
  };
  

  useEffect(() => {
    const loadLikedBooks = async () => {
      const saved = await AsyncStorage.getItem('likedBooks');
      if (saved) {
        setIsLikedBooks(JSON.parse(saved));
      }
    };
    loadLikedBooks();
  }, []);

  //route to likes screen with books properties
  const handleBookPress = (book: any) => {
    router.push('/(booktabs)/likes');
  }

  //loading
  const [isLoading, setIsLoading] = useState(false);

  //fetch books
  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      try {
        const res: any = await bookService.getBooks();
        // console.log(res?.data);
        setBooks(res?.data);
      } catch (error: any) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBooks();
  }, [])

  const handleEndOfScroll = () => {
    console.log('end of scroll');
  }

  const RenderBooks = ({ book }: any) => {
    return (
      <>
        <TouchableOpacity onPress={() => handleBookPress(book)} style={tw`p-4 flex justify-start items-start gap-3 p-4 w-full mb-6 bg-[#2a213f] rounded-xl`}>
          <View style={tw`flex-row justify-between items-center w-full`}>
            <Image source={{ uri: book?.cover }} style={tw`w-32 h-32 rounded-xl`} alt="Book Image" />
            <Pressable onPress={() => handleLike(book)}>
              <Ionicons name={isLikedBooks.some((b) => b.title === book.title) ? 'heart' : 'heart-outline'} size={24} color={isLikedBooks.some((b) => b.title === book.title) ? 'red' : 'white'} />
            </Pressable>
          </View>
          <Text style={tw`text-white text-left text-xl`}>Title: {book?.title}</Text>
          <Text style={tw`text-white text-left text-sm`}>About: {book?.description}</Text>
          <Text style={tw`text-white text-left text-sm`}>Pages: {book?.pages} | {book?.releaseDate}</Text>
        </TouchableOpacity>
      </>
    )
  }

  return (
    <View style={tw`flex-1 h-full bg-[#191327]`}>
      <Text style={tw`text-white text-4xl py-4 px-3 mt-24`}>Harry Pottereans! 📚 </Text>

      <View style={tw`p-4 gap-5 mb-42`}>
        {isLoading ?
          <ActivityIndicator size="large" color="#fff" />
          :
          <FlatList
            data={books}
            renderItem={({ item }) => <RenderBooks book={item} />}
            keyExtractor={(item: any, index) => item._id || index.toString()}
            onEndReached={handleEndOfScroll}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={() =>
              <View style={tw`m-auto`}>
                <Text style={tw`text-white text-left text-xl`}>No books found</Text>
              </View>
            }
            ItemSeparatorComponent={() => <View style={tw`h-8`} />}
            scrollEnabled
          />
        }
      </View>
    </View>
  )
}

export default HomeScreen;