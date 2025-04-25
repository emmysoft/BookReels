import { apiClient } from "@/api/api"

class BookService {
    getBooks = async () => {
        return await apiClient.get('/books')
    }

    getRandomBooks = async () => {
        return await apiClient.get('/books/random')
    }

    getCharacters = async () => {
        return await apiClient.get(`/characters`)
    }
}

const bookService = new BookService();
export default bookService;