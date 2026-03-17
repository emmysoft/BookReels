//set api call for url based on axios
import axios from 'axios';
import { BACKEND_BASE_URL } from './key';

export const axiosClient = axios.create({
    baseURL: BACKEND_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// // Request interceptor to automatically add auth token
// axiosClient.interceptors.request.use(
//     (config) => {
//         const { accessToken } = UserStore.getState();

//         // Only add token for protected routes (exclude auth routes)
//         const isAuthRoute = config.url?.includes('/(onboarding)/login') ||
//             config.url?.includes('/(onboarding)/signup') ||
//             config.url?.includes('/(onboarding)/forgotPassword') ||
//             config.url?.includes('/(onboarding)/createpassword');

//         if (accessToken && !isAuthRoute) {
//             config.headers.Authorization = `Bearer ${accessToken}`;
//         }

//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

// // Response interceptor to handle token expiry
// axiosClient.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (error.response?.status === 401) {
//             // Token expired or invalid, logout user
//             const { logout } = useAuthStore.getState();
//             logout();
//             // You might want to redirect to login page here
//             router.push("/(onboarding)/login")
//         }
//         return Promise.reject(error);
//     }
// );


export default axiosClient;