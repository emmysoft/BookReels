//zustand store for user data
import { create } from 'zustand';

interface User {
    id: string;
    name: string;
    email: string;
    image: string;
    role: string;
}

interface UserStore {
    user: User | null;
    setUser: (user: User) => void;
    removeUser: () => void;
}

export const UserStore = create<UserStore>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    removeUser: () => set({ user: null }),
}));