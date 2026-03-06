import axiosClient from '@/api/api';

class BookService {
    searchBooks = async (query: string) => {
        console.log("Searching books with query:", query);
        return await axiosClient.get(`/books/search`, { params: { query } });
    };

    getBookById = async (id: string) => {
        return await axiosClient.get(`/books/${id}`);
    };
};

export default new BookService();