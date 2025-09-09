import { create } from "zustand";

export const useSensorStore = create((set, get) => ({
  sensorDataStore: {},

  setSensorDataStore: (data) => set({ sensorDataStore: data }),

  getSensorData: () => get().sensorDataStore, // Always fetch the latest state
}));
