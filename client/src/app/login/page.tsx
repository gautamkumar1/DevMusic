import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MusicIcon} from 'lucide-react'
import Link from "next/link";
export default function LoginPage() {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-900 via-gray-900 to-black flex items-center justify-center p-4 md:p-6 lg:p-8">
        <div className="w-full max-w-4xl flex flex-col items-center">
          <Card className="mt-10 backdrop-blur-sm bg-white/10 border-none text-white p-6 md:p-8">
            <CardHeader className="space-y-1 flex flex-col items-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
                <MusicIcon className="w-8 h-8" />
              </div>
              <CardTitle className="text-2xl md:text-3xl text-center">Log In to DevMusic</CardTitle>
              <CardDescription className="text-gray-300">
                Connect Your Passion for Code & Music
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-200">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-200">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>
              <Button className="w-full" size="lg">Log In</Button>
              <p className="text-gray-300 text-center mt-4">
                New here?
                <Link href={"/register"} target="_blank" className="text-blue-400 underline">Sign up now</Link>
                and create your developer-musician profile to join the community!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  

