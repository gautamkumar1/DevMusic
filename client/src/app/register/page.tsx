'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, MusicIcon, Upload } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import useUserStore from '@/store/useUserStore'
import { useRouter } from 'next/navigation'
export default function RegisterPage() {
  const router = useRouter();
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    
  });
  const { isLoading,registerUser,registerSuccess } = useUserStore();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // console.log(`updatedFormData: ${JSON.stringify(updatedFormData)}`);
    await registerUser(formData);
  };
useEffect(()=>{
  if(registerSuccess){
    router.push("/login")
  }
})
return (
    <div className="mt-15 min-h-screen bg-gradient-to-br from-orange-900 via-gray-900 to-black p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        <Card className="mt-10 backdrop-blur-sm bg-white/10 border-none text-white">
          <CardHeader className="space-y-1 flex flex-col items-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
              <MusicIcon className="w-8 h-8" />
            </div>
            <CardTitle className="text-2xl md:text-3xl text-center">Join DevMusic</CardTitle>
            <CardDescription className="text-gray-300">
              Create your developer-musician profile
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-200">Username</Label>
                <Input
                  id="username"
                  placeholder="gautam.x3"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-200">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-200">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <Button className="w-full" size="lg" onClick={handleSubmit}>
              {isLoading ? <Loader2 className="animate-spin" /> : "Register"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


