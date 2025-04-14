import { apiClient } from "@/api/api"

class BookService {
    getBooks = async () => {
        return await apiClient.get('/books')
    }

    getRandomBooks = async () => {
        return await apiClient.get('/books/random')
    }
}

const bookService = new BookService();
export default bookService;