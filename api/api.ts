//set api call for url based on axios
import axios from 'axios';
import { GOOGLE_BASE_URL } from './key';

export const apiClient = axios.create({
    baseURL: GOOGLE_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
})