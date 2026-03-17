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
  { label: "Faith", topic: "religion" },
  { label: "Family", topic: "family" },
  { label: "Education", topic: "education" },
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
  { label: "Comedy", topic: "comedy" },
  { label: "Biography", topic: "biography" },
  { label: "Self Help", topic: "self-help" },
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

  const [categoryBooks, setCategoryBooks] = useState<{ [key: string]: any[] }>({});
  const [books, setBooks] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all categories sequentially to avoid rate limiting
  useEffect(() => {
    const fetchAllCategories = async () => {
      setIsLoading(true);
      try {
        const newCategoryBooks: { [key: string]: any[] } = {};

        for (const category of categories.filter(c => c.label !== "All")) {
          try {
            const response = await booksService.getBooksByTopic(category.topic);
            newCategoryBooks[category.label] = response.data || [];
            console.log(`${category.label}: ${response.data?.length} books`);
          } catch (err) {
            console.warn(`Failed to fetch ${category.label}`, err);
            newCategoryBooks[category.label] = []; // don't block other categories
          }
          await new Promise(resolve => setTimeout(resolve, 300)); // avoid rate limiting
        }

        const allBooks = Object.values(newCategoryBooks).flat();
        newCategoryBooks["All"] = allBooks;

        setCategoryBooks(newCategoryBooks);
        setSelectedCategory("All");
        setBooks(allBooks);
      } catch (error: any) {
        console.error("Error fetching categories:", error?.response?.data);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllCategories();
  }, []);

  // Search
  useEffect(() => {
    if (!search || search.trim().length === 0) return;
    const fetchSearchResults = async () => {
      try {
        const response = await booksService.searchBooks(search);
        setBooks(response.data || []);
        setSelectedCategory("");
      } catch (error: any) {
        console.error("Error fetching search results:", error?.response?.data);
      }
    };
    fetchSearchResults();
  }, [search]);

  // Load liked books
  useEffect(() => {
    const loadLikedBooks = async () => {
      const saved = await AsyncStorage.getItem('likedBooks');
      // reserved for future use
    };
    loadLikedBooks();
  }, []);

  const handleCategoryPress = (label: string) => {
    setSelectedCategory(label);
    setBooks(categoryBooks[label] || []);
    setSearch("");
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
              onPress={() => handleCategoryPress(item.label)}
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
        keyExtractor={(item) => item._id?.toString() || item.gutenbergId?.toString()}
        numColumns={2}
        contentContainerStyle={tw`p-4`}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <RenderBookCard
            book={item}
            onPress={() => router.push({ pathname: '/bookdetails', params: { id: item._id } })}
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