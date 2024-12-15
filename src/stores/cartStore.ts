import { ICheckoutStore } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const checkoutStore = create<ICheckoutStore>()(
  persist(
    (set, get) => ({
      checkout: null,
      setCheckout: (checkout) => set({ checkout: { ...get().checkout, ...checkout } }),
      emptyCheckout: () => set({ checkout: null }),
    }),
    {
      name: "nvt-checkout-storage",
    }
  )
);

export default checkoutStore;
