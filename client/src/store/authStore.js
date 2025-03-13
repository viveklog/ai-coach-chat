import { create } from "zustand";

const useAuthStore = create((set) => ({
  token: localStorage.getItem("token") || null,
  userId: localStorage.getItem("userId") || null,

  login: (token, userId) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    set({ token, userId });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    set({ token: null, userId: null });
  },
}));

export default useAuthStore;
