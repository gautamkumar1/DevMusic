'use client'

import { useRef, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MusicIcon, Upload } from 'lucide-react'
import { Badge } from "@/components/ui/badge"

export default function RegisterPage() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState('')
  const fileInputRef:any = useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };
  const skills = [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python',
    'Music Production', 'Audio Engineering', 'Sound Design',
    'AWS', 'Docker', 'Git', 'CI/CD'
  ]

  const handleAddSkill = () => {
    if (skillInput && !selectedSkills.includes(skillInput)) {
      setSelectedSkills([...selectedSkills, skillInput])
      setSkillInput('')
    }
  }

  const handleRemoveSkill = (skill: string) => {
    setSelectedSkills(selectedSkills.filter(s => s !== skill))
  }

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
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-200">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-200">Password</Label>
              <Input
                id="password"
                type="password"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-gray-200">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about your musical journey and coding expertise..."
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
      <Label htmlFor="profile" className="text-gray-200">
        Profile Picture
      </Label>
      <div className="flex items-center justify-center border-2 border-dashed border-white/10 rounded-lg p-6 bg-white/5">
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-2">
            <Button variant="secondary" size="sm" onClick={handleUploadClick}>
              Upload Photo
            </Button>
            <input
              ref={fileInputRef}
              id="fileInput"
              type="file"
              className="hidden"
              accept="image/*"
            />
          </div>
        </div>
      </div>
    </div>
            <div className="space-y-2">
              <Label className="text-gray-200">Skills</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedSkills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => handleRemoveSkill(skill)}
                  >
                    {skill} ×
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="Add a skill..."
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                  list="skill-suggestions"
                />
                <Button onClick={handleAddSkill} variant="secondary">Add</Button>
              </div>
              <datalist id="skill-suggestions">
                {skills.map((skill) => (
                  <option key={skill} value={skill} />
                ))}
              </datalist>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-gray-200">Role</Label>
              <Input
                id="role"
                placeholder="Full Stack Developer"
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="github" className="text-gray-200">GitHub Profile</Label>
                <Input
                  id="github"
                  placeholder="https://github.com/username"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin" className="text-gray-200">LinkedIn Profile</Label>
                <Input
                  id="linkedin"
                  placeholder="https://linkedin.com/username"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="portfolio" className="text-gray-200">Portfolio Website</Label>
                <Input
                  id="portfolio"
                  placeholder="https://yourportfolio.com"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                />
              </div>
            </div>

            <Button className="w-full" size="lg">
              Create Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

