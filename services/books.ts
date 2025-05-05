import { GOOGLE_API_KEY, GOOGLE_BASE_URL } from '@/api/key';
import axios from 'axios';

export const fetchBooks = async (searchTerm: string) => {
    try {
        const response = await axios.get(GOOGLE_BASE_URL, {
            params: {
                q: searchTerm,
                maxResults: 20,
                key: GOOGLE_API_KEY,
            },
        });
        return response.data.items; // array of book results
    } catch (error) {
        console.error('Error fetching books:', error);
        throw error;
    }
};

export const fetchBookId = async (id: string) => {
    try {
        const response = await axios.get(`${GOOGLE_BASE_URL}/${id}`, {
            params: {
                key: GOOGLE_API_KEY,
            },
        });
        const data = await response.data;

        return {
            id: data.id,
            title: data.volumeInfo.title,
            authors: data.volumeInfo.authors,
            description: data.volumeInfo.description,
            imageLinks: data.volumeInfo.imageLinks,
        };
    } catch (error) {
        console.error('Error fetching book ID:', error);
        throw error;
    }
}