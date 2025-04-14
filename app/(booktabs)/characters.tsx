import { View, Text, FlatList, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import bookService from '@/services/books';
import tw from 'twrnc';

const Characters = () => {

    //state for characters data
    const [characterList, setCharacterList] = useState<any[]>([]);

    //function to fetch characters
    const fetchCharacters = async () => {
        try {
            const response = await bookService.getCharacters();
            setCharacterList(response?.data);
            // console.log(response?.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchCharacters();
    }, []);

    //render characters list
    const RenderCharacters = ({ character }: any) => {
        return (
            <View style={tw`p-4 flex justify-start items-start gap-3 p-4 w-full mb-6 bg-[#2a213f] rounded-xl`}>
                <Image source={{ uri: character?.image }} style={{ width: 24, height: 24, borderRadius: 24 }} alt="image" />
                <Text style={tw`text-center text-[#fff]`}>{character?.fullName}</Text>
                <Text style={tw`text-center text-[#fff]`}>{character?.hogwartsHouse}</Text>
                <Text style={tw`text-center text-[#fff]`}>{character?.birthdate}</Text>
            </View>
        )
    }

    return (
        <>
            <View style={tw`flex-1 h-full`}>
                <View style={tw`flex justify-start items-start gap-5 p-12 w-full`}>
                    <Text style={tw`text-white text-center`}>Characters</Text>
                    <FlatList
                        data={characterList}
                        renderItem={({ item }) => <RenderCharacters character={item} />}
                        keyExtractor={(item, index) => item?._id || index?.toString()}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </View>
        </>
    )
}

export default Characters;