
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
  skills: string[];  // Changed from "" to string[]
}
interface UserLoginData {
  email: string;
  password: string;
  
}

interface UserStore {
  isLoading: boolean;
  error: string | null;
  success: boolean;
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
      success: false,
      isLoggedIn: false,
      isAdmin: false,
      registerUser: async (formData, profile_picture) => {
        set({ isLoading: true, error: null, success: false });
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
          form.append("skills", JSON.stringify(formData.skills)); // Serialize skills array

          if (profile_picture) {
            form.append("profile_picture", profile_picture);
          }

          const response = await fetch("/api/user/register", {
            method: "POST",
            body: form,
          });

          if (response.ok) {
            set({ success: true, isLoading: false });
            const result = await response.json();
            toast.success(result.message);
            
          } else {
            const error = await response.json();
            toast.warning(error.message);
            set({ error: error.message, isLoading: false });
            console.log(`error: ${error.message}`);
          }
        } catch (err) {
            toast.error("Error during registration. Please try again.");
            set({ error: "Error during registration. Please try again.", isLoading: false });
            console.error("Error during registration. Please try again.", err);
        }
      },
      
      loginUser: async (loginData) => {
        set({ isLoading: true, error: null, success: false, isLoggedIn: false });
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
            console.log(`isAdmin:?????? ${isAdmin}`);
            
            set({ success: true, isLoading: false, isLoggedIn: true,isAdmin: isAdmin });
            localStorage.setItem("token", result.token);
            toast.success(result.message);
          } else {
            const error = await response.json();
            set({ error: error.message, isLoading: false, isLoggedIn: false });
            toast.warning(error.message);
            console.log(`Error: ${error.message}`);
          }
        } catch (err) {
          set({ error: "Error during login. Please try again.", isLoading: false, isLoggedIn: false });
          toast.error("Error during login. Please try again.");
          console.error("Error during login. Please try again.", err);
        }
      },
      
      clearState: () => set({ isLoading: false, error: null, success: false, isLoggedIn: false,isAdmin: false }),
    }),
    {
      name: "user-store", // Name of the persisted storage
      partialize: (state) => ({ isLoading: state.isLoading, error: state.error, success: state.success,isLoggedIn: state.isLoggedIn,isAdmin: state.isAdmin }),
    }
  )
);

export default useUserStore;
