import { View, Text, FlatList, Image, Pressable, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from 'twrnc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import booksService from '@/services/books.service';
import { UserStore } from '@/stores/userStore';
import { Ionicons } from '@expo/vector-icons';

const categories = [
  { label: "All", topic: "" },
  { label: "Religion", topic: "religion" },
  { label: "Family", topic: "domestic" },       // matches "Domestic fiction" in subjects
  { label: "Education", topic: "philosophy" },     // matches "Philosophy & Ethics" bookshelf
  { label: "Parenting", topic: "children" },
  { label: "Fantasy", topic: "fantasy" },
  { label: "Romance", topic: "romance" },
  { label: "Science", topic: "science" },
  { label: "History", topic: "history" },
  { label: "Adventure", topic: "adventure" },
  { label: "Horror", topic: "horror" },
  { label: "Mystery", topic: "mystery" },
  { label: "Thriller", topic: "thriller" },
  { label: "Drama", topic: "drama" },
  { label: "Comedy", topic: "humour" },         // Gutenberg uses "Humour" not "comedy"
  { label: "Biography", topic: "biograph" },       // catches both "Biography" and "Biographies"
  { label: "Self Help", topic: "self" },           // broadens match to catch any self-* shelf
];

const RenderBookCard = ({ book, onPress }: any) => {
  const thumbnail = book.thumbnail;
  return (
    <Pressable onPress={onPress} style={tw`flex justify-start items-start gap-2 p-2`}>
      {thumbnail ? (
        <Image
          source={{ uri: thumbnail.replace('http://', 'https://') }}
          style={tw`w-40 h-56 rounded-xl`}
        />
      ) : (
        <View style={tw`w-40 h-56 rounded-xl bg-gray-700 justify-center items-center`}>
          <Text style={tw`text-white text-xs`}>No Image</Text>
        </View>
      )}
      <Text style={tw`text-white text-xs w-40`} numberOfLines={2}>{book.title}</Text>
    </Pressable>
  );
};

const HomeScreen = () => {
  const { user, logout } = UserStore();
  const router = useRouter();

  const [allBooks, setAllBooks] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getAllBooks = async () => {
      setIsLoading(true);
      try {
        const response = await booksService.getBooks();
        const fetched = response.data || [];
        console.log("Fetched books:", JSON.stringify(fetched, null, 2));
        setAllBooks(fetched);
        setBooks(fetched);
      } catch (error: any) {
        console.error("Error fetching books:", error?.response?.data);
      } finally {
        setIsLoading(false);
      }
    };
    getAllBooks();
  }, []);

  // Load liked books
  useEffect(() => {
    const loadLikedBooks = async () => {
      const saved = await AsyncStorage.getItem('likedBooks');
      // reserved for future use
    };
    loadLikedBooks();
  }, []);

  const handleCategoryPress = (label: string, topic: string) => {
    setSelectedCategory(label);

    if (!topic) {
      // "All" — show everything
      setBooks(allBooks);
      return;
    }

    // Filter master list by checking if any of the book's categories/topics match
    const filtered = allBooks.filter((book) => {
      const bookCategories: string[] = book.categories ?? book.topics ?? book.genres ?? [];
      return bookCategories.some((c: string) =>
        c.toLowerCase().includes(topic.toLowerCase())
      );
    });

    setBooks(filtered);
  };

  const handleLogout = () => {
    logout();
    router.push('/(auth)');
  };

  return (
    <View style={tw`flex-1 bg-[#191327]`}>
      {/* Header */}
      <View style={tw`flex-row justify-between items-center px-4 pt-12 pb-2`}>
        <View>
          <Text style={tw`text-white text-3xl font-bold`}>BookReels 📚</Text>
          <Text style={tw`text-gray-400 text-sm`}>Welcome, {user?.username}!</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={tw`p-2`}>
          <Ionicons name="log-out-outline" size={24} color="red" />
        </TouchableOpacity>
      </View>

      {/* Category Pills */}
      <View style={tw`mt-2`}>
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item.label}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={tw`px-4 gap-2`}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handleCategoryPress(item.label, item.topic)}
              style={tw`px-4 py-2 rounded-full mr-2 ${selectedCategory === item.label ? 'bg-purple-600' : 'bg-gray-700'}`}
            >
              <Text style={tw`text-white text-sm font-medium`}>{item.label}</Text>
            </Pressable>
          )}
        />
      </View>

      {/* Books Grid */}
      <FlatList
        data={books}
        keyExtractor={(item) => item._id}
        numColumns={2}
        contentContainerStyle={tw`p-4`}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <RenderBookCard
            book={item}
            onPress={() => router.push({
              pathname: '/bookdetails',
              params: { id: item._id }
            })}
          />
        )}
        ListEmptyComponent={() => (
          <View style={tw`flex-1 justify-center items-center mt-20`}>
            <Text style={tw`text-gray-400 text-lg`}>
              {isLoading ? "Loading books..." : "No books found"}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default HomeScreen;