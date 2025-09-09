import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useChatStore = create((set, get) => ({
  isSendingMsg: false,
  messages: [],
  
  sendMessage: async (data) => {
    set({ isSendingMsg: true });
    try {
      const res = await axiosInstance.post("/chats/sendMessage", data);
      if (!res.data) {
        throw new Error(res.data?.message || "Failed to send message");
      }
      await get().getMessages();
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
      console.error("Error sending message:", error);
      throw error;
    } finally {
      set({ isSendingMsg: false });
    }
  },
  
  getMessages: async () => {
    try {
      const res = await axiosInstance.get("/chats/getMessages");
      if (res.data?.chats) {
        // Sort messages by timestamp when fetching
        const sortedMessages = res.data.chats.sort((a, b) => 
          new Date(a.timestamp || a.createdAt) - new Date(b.timestamp || b.createdAt)
        );
        set({ messages: sortedMessages });
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      toast.error("Failed to load messages");
      console.error("Error fetching messages:", error);
    }
  },
  
  addMessage: (msg) => {
    set((state) => {
      const messageExists = state.messages.some(
        m => (m._id && m._id === msg._id) ||
             (m.timestamp && m.timestamp === msg.timestamp &&
              m.user?._id === msg.user?._id &&
              m.text === msg.text)
      );
      
      if (messageExists) {
        return state;
      }
      
      // Add new message and sort
      const updatedMessages = [...state.messages, msg].sort((a, b) => 
        new Date(a.timestamp || a.createdAt) - new Date(b.timestamp || b.createdAt)
      );
      
      return {
        messages: updatedMessages
      };
    });
  },
}));