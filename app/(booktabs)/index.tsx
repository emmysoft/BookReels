import { View, Text, FlatList, Image, Pressable, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from 'twrnc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import booksService from '@/services/books.service';
import { UserStore } from '@/stores/userStore';
import { Ionicons } from '@expo/vector-icons';

const categories = [
  { label: "All", query: "" },
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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [likedBooks, setLikedBooks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all categories
  useEffect(() => {
    const fetchAllCategories = async () => {
      setIsLoading(true);
      try {
        const results = await Promise.all(
          categories
            .filter(c => c.label !== "All") // 👈 add here, before .map
            .map(async (category) => {
              const response = await booksService.searchBooks(category.query);
              return { label: category.label, books: response.data };
            })
        );

        const newCategoryBooks: { [key: string]: any[] } = {};
        results.forEach(({ label, books }) => {
          newCategoryBooks[label] = books;
        });

        const allBooks = results.flatMap(r => r.books);
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

  // Fetch search results
  useEffect(() => {
    if (search.length === 0) return;
    const fetchSearchResults = async () => {
      try {
        const response = await booksService.searchBooks(search);
        setBooks(response.data);
        setSelectedCategory(null);
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
      if (saved) setLikedBooks(JSON.parse(saved));
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

      {/* Category Pills - horizontal scroll on top */}
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
        keyExtractor={(item) => item._id}
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