import { View, Text, FlatList, Image, Pressable, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from 'twrnc';
import { fetchBooks } from '@/services/books';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Skeleton } from 'moti/skeleton';

const categories = [
  { label: "Faith", query: "faith books" },
  { label: "Family", query: "family books" },
  { label: "Education", query: "education books" },
  { label: "Parenting", query: "parenting books" },
  { label: "Fantasy", query: "fantasy books" },
  { label: "Romance", query: "romance books" },
  { label: "Science", query: "science books" },
  { label: "History", query: "history books" },
  { label: "Adventure", query: "adventure books" },
  { label: "Horror", query: "horror books" },
  { label: "Mystery", query: "mystery books" },
  { label: "Thriller", query: "thriller books" },
  { label: "Drama", query: "drama books" },
  { label: "Comedy", query: "comedy books" },
  { label: "Biography", query: "biography books" },
  { label: "Self Help", query: "self help books" },
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
  // const handleToggleLike = async (book: any) => {
  //   const isAlreadyLiked = likedBooks.some((b: any) => b.title === book?.title);

  //   let updatedLikes;
  //   let updatedLikeCounts = { ...likeCounts };

  //   if (isAlreadyLiked) {
  //     updatedLikes = likedBooks.filter((b) => b.title !== book?.title);
  //     updatedLikeCounts[book.title] = (updatedLikeCounts[book.title] || 1) - 1;
  //   } else {
  //     updatedLikes = [...likedBooks, book];
  //     updatedLikeCounts[book.title] = (updatedLikeCounts[book.title] || 0) + 1;
  //   }

  //   setLikedBooks(updatedLikes);
  //   setLikeCounts(updatedLikeCounts);
  //   await AsyncStorage.setItem('likedBooks', JSON.stringify(updatedLikes));
  //   await AsyncStorage.setItem('likeCounts', JSON.stringify(updatedLikeCounts));
  // };



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

  //loading
  const [isLoading, setIsLoading] = useState(true);

  const RenderBooks = ({ book }: any) => {
    const volume = book.volumeInfo; //book data
    const id = book.id; //book id

    // console.log(volume?.imageLinks?.thumbnail?.replace('http://', 'https://'));
    return (
      <>
        <Skeleton width={50} height={50} colorMode='light' transition={{ duration: 2 }}>
          {isLoading
            ?
            null
            :
            <Pressable onPress={() => router.push({ pathname: '/bookdetails', params: { id: id } })} style={tw`flex-1 p-4 rounded-xl`}>
              <View style={tw`flex justify-start items-start gap-4 p-2`}>
                {volume?.imageLinks?.thumbnail ? (
                  <Image
                    source={{ uri: volume.imageLinks.thumbnail.replace('http://', 'https://') }}
                    style={tw`w-50 h-50 rounded-xl m-auto`}
                    alt="Book Image"
                  />
                ) : (
                  <View style={tw`w-50 h-50 rounded-xl m-auto bg-gray-700 justify-center items-center`}>
                    <Text style={tw`text-white text-xs`}>No Image</Text>
                  </View>
                )}
              </View>
            </Pressable>
          }
        </Skeleton>
      </>
    )
  }

  return (
    <>
      <ScrollView style={tw`flex-1 bg-[#191327]`}>
        <Text style={tw`text-white text-4xl py-4 px-3 mt-24 mb-12`}>BookReels 📚</Text>
        {search.length === 0 ? (
          categories.map((category) => (
            <View key={category.label} style={tw`mb-6`}>
              <Text style={tw`text-white text-2xl px-4 mb-2`}>{category.label}</Text>
              <FlatList
                horizontal
                data={categoryBooks[category.label]}
                renderItem={({ item }) => <RenderBooks book={item} />}
                keyExtractor={(item) => item.id || item.title}
                showsHorizontalScrollIndicator={false}
              />
            </View>
          ))
        ) : (
          <>
            <FlatList
              data={books}
              renderItem={({ item }) => <RenderBooks book={item} />}
              keyExtractor={(item, index) => item.id || index.toString()}
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
    </>
  )
}

export default HomeScreen;