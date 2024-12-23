import { toast } from 'sonner';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserFormData {
  username: string;
  email: string;
  password: string;
  bio: string;
  role: string;
  githubLink: string;
  linkedInLink: string;
  portfolioLink: string;
  skills: string[]; // Changed from "" to string[]
  fullName: string;
}
interface UserLoginData {
  email: string;
  password: string;
}

interface UserStore {
  isLoading: boolean;
  error: string | null;
  loginSuccess: boolean;
  registerSuccess: boolean;
  isLoggedIn: boolean;
  isAdmin: boolean;
  registerUser: (formData: UserFormData, profile_picture?: File | null) => Promise<void>;
  loginUser: (loginData: UserLoginData) => Promise<void>;
  clearState: () => void;
}

const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      isLoading: false,
      error: null,
      loginSuccess: false,
      registerSuccess: false,
      isLoggedIn: false,
      isAdmin: false,

      registerUser: async (formData, profile_picture) => {
        set({ isLoading: true, error: null, registerSuccess: false });
        try {
          const form = new FormData();
          form.append("username", formData.username);
          form.append("email", formData.email);
          form.append("password", formData.password);
          form.append("bio", formData.bio);
          form.append("role", formData.role);
          form.append("githubLink", formData.githubLink);
          form.append("linkedInLink", formData.linkedInLink);
          form.append("portfolioLink", formData.portfolioLink);
          form.append("skills", JSON.stringify(formData.skills));
          form.append("fullName", formData.fullName);

          if (profile_picture) {
            form.append("profile_picture", profile_picture);
          }

          const response = await fetch("/api/user/register", {
            method: "POST",
            body: form,
          });

          if (response.ok) {
            const result = await response.json();
            set({ registerSuccess: true, isLoading: false });
            toast.success(result.message);
          } else {
            const error = await response.json();
            set({ error: error.message, isLoading: false });
            toast.warning(error.message);
          }
        } catch (err) {
          set({ error: "Error during registration. Please try again.", isLoading: false });
          toast.error("Error during registration. Please try again.");
        }
      },

      loginUser: async (loginData) => {
        set({ isLoading: true, error: null, loginSuccess: false });
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
              isLoading: false,
              isLoggedIn: true,
              isAdmin,
            });
            localStorage.setItem("token", result.token);
            toast.success(result.message);
          } else {
            const error = await response.json();
            set({ error: error.message, isLoading: false, isLoggedIn: false });
            toast.warning(error.message);
          }
        } catch (err) {
          set({
            error: "Error during login. Please try again.",
            isLoading: false,
            isLoggedIn: false,
          });
          toast.error("Error during login. Please try again.");
        }
      },

      clearState: () =>
        set({
          isLoading: false,
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
        isLoading: state.isLoading,
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
