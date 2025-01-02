import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserFormData {
  username: string;
  email: string;
  password: string;
}
interface UserLoginData {
  email: string;
  password: string;
}

interface UserStore {
  registerLoading: boolean;
  loginLoading: boolean;
  isLoading: boolean; // This now dynamically depends on other states
  error: string | null;
  loginSuccess: boolean;
  registerSuccess: boolean;
  isLoggedIn: boolean;
  isAdmin: boolean;
  registerUser: (formData: UserFormData) => Promise<void>;
  loginUser: (loginData: UserLoginData) => Promise<void>;
  clearState: () => void;
}

const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      registerLoading: false,
      loginLoading: false,
      error: null,
      loginSuccess: false,
      registerSuccess: false,
      isLoggedIn: false,
      isAdmin: false,

      // Getter for `isLoading`: dependent on other states
      get isLoading() {
        return get().registerLoading || get().loginLoading;
      },

      registerUser: async (formData) => {
        set({ registerLoading: true, error: null, registerSuccess: false });
        try {
          const form = new FormData();
          form.append("username", formData.username);
          form.append("email", formData.email);
          form.append("password", formData.password);

          const response = await fetch("/api/user/register", {
            method: "POST",
            body: form,
          });

          if (response.ok) {
            const result = await response.json();
            set({ registerSuccess: true, registerLoading: false });
            toast.success(result.message);
          } else {
            const error = await response.json();
            set({ error: error.message, registerLoading: false });
            toast.warning(error.message);
          }
        } catch (err) {
          set({
            error: "Error during registration. Please try again.",
            registerLoading: false,
          });
          toast.error("Error during registration. Please try again.");
        }
      },

      loginUser: async (loginData) => {
        set({ loginLoading: true, error: null, loginSuccess: false });
        try {
          const response = await fetch("/api/user/login", {
            method: "POST",
            body: JSON.stringify(loginData),
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const result = await response.json();
            const isAdmin = result.userData.isAdmin;

            set({
              loginSuccess: true,
              loginLoading: false,
              isLoggedIn: true,
              isAdmin,
            });
            localStorage.setItem("token", result.token);
            toast.success(result.message);
          } else {
            const error = await response.json();
            set({ error: error.message, loginLoading: false, isLoggedIn: false });
            toast.warning(error.message);
          }
        } catch (err) {
          set({
            error: "Error during login. Please try again.",
            loginLoading: false,
            isLoggedIn: false,
          });
          toast.error("Error during login. Please try again.");
        }
      },

      clearState: () =>
        set({
          registerLoading: false,
          loginLoading: false,
          error: null,
          loginSuccess: false,
          registerSuccess: false,
          isLoggedIn: false,
          isAdmin: false,
        }),
    }),
    {
      name: "user-store",
      partialize: (state) => ({
        registerLoading: state.registerLoading,
        loginLoading: state.loginLoading,
        error: state.error,
        loginSuccess: state.loginSuccess,
        registerSuccess: state.registerSuccess,
        isLoggedIn: state.isLoggedIn,
        isAdmin: state.isAdmin,
      }),
    }
  )
);

export default useUserStore;
