import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, Pressable, TextInput } from 'react-native'
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

  //state for search books and actors
  const [search, setSearch] = useState("");

  //like state
  const [likedBooks, setLikedBooks] = useState<any[]>([]);
  //like counts
  const [likeCount, setLikeCount] = useState(0);

  //toggle like and unlike
  const handleToggleLike = async (book: any) => {
    const isAlreadyLiked = likedBooks.some((b: any) => b.title === book?.title);

    const updatedLikes = isAlreadyLiked
      ? likedBooks.filter((b) => b.title !== book?.title) // remove
      : [...likedBooks, book]; // add back (optional)

    setLikedBooks(updatedLikes);
    handleLikeCount();
    await AsyncStorage.setItem('likedBooks', JSON.stringify(updatedLikes));
  };


  //function to handle likes count for each book
  const handleLikeCount = () => {
    setLikeCount(likeCount + 1);
  }

  useEffect(() => {
    const loadLikedBooks = async () => {
      const saved = await AsyncStorage.getItem('likedBooks');
      if (saved) {
        setLikedBooks(JSON.parse(saved));
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
  }, []);

  const RenderBooks = ({ book }: any) => {
    return (
      <>
        <TouchableOpacity onPress={() => handleBookPress(book)} style={tw`p-4 flex-1 p-4 m-6 bg-[#2a213f] rounded-xl`}>
          <View style={tw`flex justify-start items-start gap-4 p-2`}>
          <Image source={{ uri: book?.cover }} style={tw`w-32 h-32 rounded-xl`} alt="Book Image" />
          <Text style={tw`text-white text-left text-xl`}>Title: {book?.title}</Text>
          <Text style={tw`text-white text-left text-sm`}>Pages: {book?.pages} | {book?.releaseDate}</Text>
          <View style={tw`flex-row justify-start items-start gap-32 min-w-full`}>
            <Pressable onPress={() => handleToggleLike(book)}>
              <Ionicons
                name={likedBooks.some((b) => b.title === book.title) ? 'heart' : 'heart-outline'}
                size={24}
                color={likedBooks.some((b) => b.title === book.title) ? 'red' : 'white'}
              />
            </Pressable>
            {/**likes per book */}
            <Text style={tw`text-white text-left text-base`}>{likeCount}</Text>
            
          </View>
          </View>
        </TouchableOpacity>
      </>
    )
  }

  return (
    <View style={tw`flex-1 h-full bg-[#191327]`}>
      <Text style={tw`text-white text-4xl py-4 px-3 mt-24`}>BookReels  📚 </Text>
      <View style={tw`p-4 min-w-full`}>
        <TextInput
          value={search}
          onChangeText={(text: string) => setSearch(text)}
          placeholder='Search for books'
          style={tw`px-6 py-4 rounded-md border-2 border-[#2A213F] flex justify-start items-start text-white text-xl w-full`}
          placeholderTextColor={"#fff"}
        />
      </View>

      <View style={tw`p-4 gap-5 mb-42`}>
        {isLoading ?
          <ActivityIndicator size="large" color="#fff" />
          :
          <FlatList
            data={books}
            renderItem={({ item }) => <RenderBooks book={item} />}
            keyExtractor={(item: any, index) => item._id || index.toString()}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={() =>
              <View style={tw`m-auto`}>
                <Text style={tw`text-white text-left text-xl`}>No books found</Text>
              </View>
            }
            // ItemSeparatorComponent={() => <View style={tw`h-8`} />}
            numColumns={2}
            scrollEnabled
            showsVerticalScrollIndicator={false}
          />
        }
      </View>
    </View>
  )
}

export default HomeScreen;