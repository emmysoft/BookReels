import { View, Text, TextInput, Pressable, FlatList, Image, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router';
import { fetchBooks } from '@/services/books';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';

const Search = () => {

    const router = useRouter();

    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);

    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = async () => {
        setIsLoading(true);
        const res = await fetchBooks(query);
        setResults(res);
        setIsLoading(false);
    }

    const RenderBooksSearch = () => {
        const volume = results[0]?.volumeInfo;
        const id = results[0]?.id;

        return (
            <>
                <Pressable
                    onPress={() => router.push({
                        pathname: '/bookdetails',
                        params: { id: id }
                    })}
                    style={tw`flex-1 p-4 rounded-xl`}
                >
                    <View style={tw`flex justify-start items-start gap-4 p-2`}>
                        <Image
                            source={{ uri: volume?.imageLinks?.thumbnail }}
                            style={tw`w-50 h-50 rounded-xl m-auto`}
                            alt="Book Image"
                        />
                    </View>
                </Pressable>
            </>
        )
    }

    return (
        <View style={tw`flex-1 bg-[#191237] p-12 h-full`}>
            <View style={tw`flex-row justify-center items-center p-2`}>
                <TextInput
                    placeholder='Search Books'
                    style={tw`px-6 py-4 rounded-xl border-2 border-[#fff] w-full text-[#fff]`}
                    value={query}
                    onChangeText={setQuery}
                    onSubmitEditing={handleSearch}
                    placeholderTextColor={"#fff"}
                />
                <Pressable onPress={() => handleSearch()} style={tw`absolute right-6`}>
                    <Ionicons name="search" size={22} color={"#fff"} />
                </Pressable>
            </View>

            {isLoading
                ?
                <ActivityIndicator size={"large"} color={"#fff"} />
                :
                <FlatList
                    data={results}
                    keyExtractor={(item, index) => item._id || index.toString()}
                    renderItem={({ item }) => <RenderBooksSearch />}
                    ListEmptyComponent={() => <Text style={tw`text-white text-lg m-auto pt-24`}>No books search yet</Text>}
                    numColumns={2}
                />
            }
        </View>
    )
}

export default Search;