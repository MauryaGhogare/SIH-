import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useReviewStore = create((set) => ({
  isSendingReview: false,
  reviews: [],
  
  sendReview: async (data) => {
    set({ isSendingReview: true });
    try {
      const res = await axiosInstance.post("/review/msg", data);
      set((prev) => ({
        reviews: [...prev.reviews, res.data.review]
      }));
      toast.success(res.data.message || "Review submitted successfully");
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
      console.error("Error in sendReview:", error);
    } finally {
      set({ isSendingReview: false });
    }
  },
  
  getReviews: async () => {
    try {
      const res = await axiosInstance.get("/review/getreviews");
      set({ reviews: res.data });
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to load reviews");
    }
  }
}));