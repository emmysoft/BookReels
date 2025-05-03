// import { BASE_URL, API_KEY } from '@env';
import axios from 'axios';

const BASE_URL = 'https://www.googleapis.com/books/v1/volumes';
const API_KEY = 'AIzaSyBJt_8_obdFDOziIJGFnVEovnu1i4bCkOY';

export const fetchBooks = async (searchTerm: string) => {
    try {
        const response = await axios.get(BASE_URL, {
            params: {
                q: searchTerm,
                maxResults: 20,
                key: API_KEY,
            },
        });
        return response.data.items; // array of book results
    } catch (error) {
        console.error('Error fetching books:', error);
        throw error;
    }
};