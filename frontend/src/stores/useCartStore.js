import { create } from "zustand";

export const useCartStore = create((set, get) => ({
  items: [],

  addItem: (product, quantity = 1) => {
    const current = get().items;
    const existingIndex = current.findIndex((i) => i.id === product.id);
    let next;
    if (existingIndex !== -1) {
      next = current.map((i, idx) =>
        idx === existingIndex ? { ...i, quantity: i.quantity + quantity } : i
      );
    } else {
      next = [...current, { ...product, quantity }];
    }
    set({ items: next });
  },

  removeItem: (productId) => {
    set({ items: get().items.filter((i) => i.id !== productId) });
  },

  clearCart: () => set({ items: [] }),

  getItemCount: () => get().items.reduce((sum, i) => sum + (i.quantity || 1), 0),
}));


