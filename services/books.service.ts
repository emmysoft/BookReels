import axiosClient from "@/api/api";

// books.service.ts
class BookService {
    searchBooks = async (query: string) => {
        return await axiosClient.get(`/books/search`, { params: { query } });
    };
    getBookById = async (id: string) => {
        return await axiosClient.get(`/books/${id}`);
    };
    getBooksByTopic = async (topic: string) => {       // 👈 new
        return await axiosClient.get(`/books/topic/${topic}`);
    };
    getReadUrl = async (id: string) => {               // 👈 new
        return await axiosClient.get(`/books/${id}/read`);
    };
};

const booksService = new BookService();
export default booksService;