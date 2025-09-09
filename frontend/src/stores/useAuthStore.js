import {create} from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true,

  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      console.error("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error in signup");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login:async(data)=>{
    set({isLoggingIn:true});
    try {
      const res=await axiosInstance.post("/auth/login",data);
      set({ authUser: res.data });
      toast.success("Logged In successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error in login");
    }
  },

  updateUser:async(data)=>{
    try {
      const res=await axiosInstance.put("/auth/update",data);
      set({ authUser: res.data });
      toast.success("Upadated successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error in update");
    }
  }
}));
