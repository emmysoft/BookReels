import axiosClient from "@/api/api";

class AuthService {
    register = async ({ name, username, email, password }: { name: string; username: string; email: string; password: string }) => {
        return await axiosClient.post('/auth/register', { name, username, email, password });
    };

    login = async ({ username, password }: { username: string; password: string }) => {
        return await axiosClient.post('/auth/login', { username, password });
    };
};

export default new AuthService();