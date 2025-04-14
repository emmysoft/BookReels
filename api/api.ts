//set api call for url based on axios
import axios from 'axios';
import { baseUrl } from './baseUrl';

export const apiClient = axios.create({
    baseURL: baseUrl,
    headers: {
        "Content-Type": "application/json",
    },
})