import { IUserStore } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const userStore = create<IUserStore>()(
  persist(
    (set, get) => ({
      currentUser: null,
      setUser: (user) => set({ currentUser: user }),
      logout: () => set({ currentUser: null }),
      isAuth: () => get().currentUser !== null,
      sidebarCollapsed: false,
      toggleSidebar: (collapsed) => set({ sidebarCollapsed: collapsed }),
    }),
    {
      name: "nvt-user-storage",
    }
  )
);

export default userStore;
