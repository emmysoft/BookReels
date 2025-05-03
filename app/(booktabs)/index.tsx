import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, Pressable, TextInput, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from 'twrnc';
import { fetchBooks } from '@/services/books';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';


const categories = [
  { label: "Fantasy", query: "fantasy books" },
  { label: "Romance", query: "romance books" },
  { label: "Science", query: "science books" },
  { label: "History", query: "history books" },
  { label: "Adventure", query: "adventure books" },
];

const HomeScreen = () => {

  const router = useRouter();

  //category books
  const [categoryBooks, setCategoryBooks] = useState<{ [key: string]: any[] }>({});

  //state for book data
  const [books, setBooks] = useState<any[]>([]);

  //state for search books and actors
  const [search, setSearch] = useState("");

  //like state
  const [likedBooks, setLikedBooks] = useState<any[]>([]);
  //like counts
  const [likeCounts, setLikeCounts] = useState<{ [key: string]: number }>({});

  //handle search 
  const handleSearch = async () => {
    if (!search) return;
    setIsLoading(true);
    const res = await fetchBooks(search);
    setBooks(res);
    setIsLoading(false);
  };

  //handle category display
  useEffect(() => {
    const fetchAllCategories = async () => {
      setIsLoading(true);
      const newCategoryBooks: { [key: string]: any[] } = {};

      for (const category of categories) {
        const books = await fetchBooks(category.query);
        newCategoryBooks[category.label] = books;
      }

      setCategoryBooks(newCategoryBooks);
      setIsLoading(false);
    };

    fetchAllCategories();
  }, []);

  //toggle like and unlike
  const handleToggleLike = async (book: any) => {
    const isAlreadyLiked = likedBooks.some((b: any) => b.title === book?.title);

    let updatedLikes;
    let updatedLikeCounts = { ...likeCounts };

    if (isAlreadyLiked) {
      updatedLikes = likedBooks.filter((b) => b.title !== book?.title);
      updatedLikeCounts[book.title] = (updatedLikeCounts[book.title] || 1) - 1;
    } else {
      updatedLikes = [...likedBooks, book];
      updatedLikeCounts[book.title] = (updatedLikeCounts[book.title] || 0) + 1;
    }

    setLikedBooks(updatedLikes);
    setLikeCounts(updatedLikeCounts);
    await AsyncStorage.setItem('likedBooks', JSON.stringify(updatedLikes));
    await AsyncStorage.setItem('likeCounts', JSON.stringify(updatedLikeCounts));
  };



  //function to handle likes count for each book
  useEffect(() => {
    const loadLikedBooks = async () => {
      const saved = await AsyncStorage.getItem('likedBooks');
      const savedCounts = await AsyncStorage.getItem('likeCounts');

      if (saved) {
        setLikedBooks(JSON.parse(saved));
      }
      if (savedCounts) {
        setLikeCounts(JSON.parse(savedCounts));
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

  const RenderBooks = ({ book }: any) => {

    const volume = book.volumeInfo;

    return (
      <>
        <TouchableOpacity onPress={() => handleBookPress(book)} style={tw`p-4 flex-1 p-4 m-6 bg-[#2a213f] rounded-xl`}>
          <View style={tw`flex justify-start items-start gap-4 p-2`}>
            <Image source={{ uri: volume?.imageLinks?.thumbnail }} style={tw`w-32 h-32 rounded-xl`} alt="Book Image" />
            <Text style={tw`text-white text-left text-xl`}>Title: {volume?.title}</Text>
            <Text style={tw`text-white text-left text-sm`}>Author: {volume?.authors}
            </Text><Text style={tw`text-white text-left text-sm`}> Publisher: {volume?.publisher}</Text>
            <View style={tw`flex-row justify-center items-center gap-4 w-full`}>
              <Pressable onPress={() => handleToggleLike(book)}>
                <Ionicons
                  name={likedBooks.some((b) => b.title === book.title) ? 'heart' : 'heart-outline'}
                  size={24}
                  color={likedBooks.some((b) => b.title === book.title) ? 'red' : 'white'}
                />
              </Pressable>
              <Pressable onPress={() => router.push("/(booktabs)/discussion")}>
                <Ionicons name="chatbubble-ellipses-outline" size={24} color="white" />
              </Pressable>
              {/**likes per book */}
              <Text style={tw`text-white text-left text-base`}>{likeCounts[volume?.title] || 0}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </>
    )
  }

  return (
    <ScrollView style={tw`flex-1 bg-[#191327]`}>
      <Text style={tw`text-white text-4xl py-4 px-3 mt-24`}>BookReels 📚</Text>

      {search.length === 0 ? (
        categories.map((category) => (
          <View key={category.label} style={tw`mb-6`}>
            <Text style={tw`text-white text-2xl px-4 mb-2`}>{category.label}</Text>
            <FlatList
              horizontal
              data={categoryBooks[category.label]}
              renderItem={({ item }) => <RenderBooks book={item} />}
              keyExtractor={(item) => item._id || item.title}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        ))
      ) : (
        <>
          <Text style={tw`text-white text-2xl px-4 mb-2`}>Search Results</Text>
          <FlatList
            data={books}
            renderItem={({ item }) => <RenderBooks book={item} />}
            keyExtractor={(item, index) => item._id || index.toString()}
            numColumns={2}
            scrollEnabled
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <View style={tw`m-auto`}>
                <Text style={tw`text-white text-left text-xl`}>No books found</Text>
              </View>
            )}
          />
        </>
      )}
    </ScrollView>

  )
}

export default HomeScreen;