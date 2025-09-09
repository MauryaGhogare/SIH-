import { create } from "zustand";

export const useBidStore = create((set, get) => ({
  shortlisted: [],
  addBid: (bid) => {
    const exists = get().shortlisted.some((b) => b.id === bid.id);
    if (exists) return;
    set({ shortlisted: [...get().shortlisted, bid] });
  },
  removeBid: (id) => set({ shortlisted: get().shortlisted.filter((b) => b.id !== id) }),
  clear: () => set({ shortlisted: [] }),
}));


