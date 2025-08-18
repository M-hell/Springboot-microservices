import { create } from "zustand";

const useUserStore = create((set) => ({
  id: null,
  email: null,
  firstName: null,
  lastName: null,

  setUser: ({ id, email, firstName, lastName }) =>
    set({
      id,
      email,
      firstName,
      lastName,
    }),

  logout: () => set({ id: null, email: null, firstName: null, lastName: null }),
}));

export default useUserStore;
