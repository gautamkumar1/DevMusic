'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, MusicIcon } from 'lucide-react'
import useUserStore from '@/store/useUserStore'
import { useRouter } from 'next/navigation'
import { Alert, AlertDescription } from "@/components/ui/alert"

const RegisterPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  
  const { isLoading, registerUser, registerSuccess } = useUserStore();
  const [formErrors, setFormErrors] = useState({
    username: "",
    email: "",
    password: "",
  });

  const validateForm = () => {
    let isValid = true;
    const errors = {
      username: "",
      email: "",
      password: "",
    };

    if (!formData.username.trim()) {
      errors.username = "Username is required";
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email";
      isValid = false;
    }

    if (!formData.password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    // Clear error when user starts typing
    setFormErrors(prev => ({ ...prev, [id]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await registerUser(formData);
    }
  };

  useEffect(() => {
    if (registerSuccess) {
      router.push("/login");
    }
  }, [registerSuccess, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-gray-900 to-orange-900 p-4 md:p-6 lg:p-8 flex items-center justify-center">
      <div className="w-full max-w-xl">
        <Card className="backdrop-blur-md bg-white/10 border-white/20 shadow-xl">
          <CardHeader className="space-y-4">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-500 rounded-full flex items-center justify-center mb-4 shadow-lg transform hover:scale-105 transition-transform">
                <MusicIcon className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold text-white">DevMusic</CardTitle>
              <CardDescription className="text-lg text-gray-300">
                Where code meets melody
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-200">Username</Label>
                <Input
                  id="username"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-orange-500 transition-colors"
                />
                {formErrors.username && (
                  <Alert variant="destructive" className="mt-1 py-1 bg-red-900/50 border-red-500/50">
                    <AlertDescription>{formErrors.username}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-200">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-orange-500 transition-colors"
                />
                {formErrors.email && (
                  <Alert variant="destructive" className="mt-1 py-1 bg-red-900/50 border-red-500/50">
                    <AlertDescription>{formErrors.email}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-200">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-orange-500 transition-colors"
                />
                {formErrors.password && (
                  <Alert variant="destructive" className="mt-1 py-1 bg-red-900/50 border-red-500/50">
                    <AlertDescription>{formErrors.password}</AlertDescription>
                  </Alert>
                )}
              </div>

              <Button 
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-orange-500 hover:from-orange-600 hover:to-orange-600 transition-colors"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    <span>Creating account...</span>
                  </div>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-gray-400">
              Already have an account?{" "}
              <Button 
                variant="link" 
                className="text-orange-400 hover:text-orange-300 p-0"
                onClick={() => router.push('/login')}
              >
                Sign in
              </Button>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;