'use client'

import { useRef, useState } from 'react'
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
    bio: "",
    role: "",
    githubLink: "",
    linkedInLink: "",
    portfolioLink: "",
    skills: "" as string | string[],
  });
  const fileInputRef = useRef<any>(null);
  const [profile_picture, setProfileImage] = useState<File | null>(null);
  const { isLoading,registerUser,registerSuccess } = useUserStore();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleAddSkill = () => {
    if (skillInput && !selectedSkills.includes(skillInput)) {
      setSelectedSkills([...selectedSkills, skillInput]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skill));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedFormData = { ...formData, skills: Array.isArray(formData.skills) ? formData.skills : [] };
    updatedFormData.skills = selectedSkills;
    console.log(`updatedFormData: ${JSON.stringify(updatedFormData)}`);
    
    await registerUser(updatedFormData,profile_picture);
    if(registerSuccess){
      router.push("/user-dashboard");
    }
  };

  const skills = [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python',
    'Music Production', 'Audio Engineering', 'Sound Design',
    'AWS', 'Docker', 'Git', 'CI/CD',
  ];

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

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-gray-200">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about your musical journey and coding expertise..."
                value={formData.bio}
                onChange={handleInputChange}
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile" className="text-gray-200">Profile Picture</Label>
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
                      onChange={handleFileChange}
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
                value={formData.role}
                onChange={handleInputChange}
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="githubLink" className="text-gray-200">GitHub Profile</Label>
                <Input
                  id="githubLink"
                  placeholder="https://github.com/username"
                  value={formData.githubLink}
                  onChange={handleInputChange}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedInLink" className="text-gray-200">LinkedIn Profile</Label>
                <Input
                  id="linkedInLink"
                  placeholder="https://linkedin.com/username"
                  value={formData.linkedInLink}
                  onChange={handleInputChange}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="portfolioLink" className="text-gray-200">Portfolio Website</Label>
                <Input
                  id="portfolioLink"
                  placeholder="https://yourportfolio.com"
                  value={formData.portfolioLink}
                  onChange={handleInputChange}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                />
              </div>
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


