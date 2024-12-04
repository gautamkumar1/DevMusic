import ContactInfo from "./components/ContactInfo"
import ProfileHeader from "./components/ProfileHeader"
import Skills from "./components/Skills"

export default function ProfilePage() {
  const profileData = {
    imageUrl: "/placeholder.svg?height=200&width=200",
    username: "JohnDoe",
    bio: "Passionate web developer with a love for creating beautiful and functional user interfaces.",
    email: "johndoe@example.com",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js"],
    githubLink: "https://github.com/johndoe",
    portfolioLink: "https://johndoe.dev",
    linkedinLink: "https://linkedin.com/in/johndoe"
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <ProfileHeader
          imageUrl={profileData.imageUrl}
          username={profileData.username}
          bio={profileData.bio}
        />
        <ContactInfo
          email={profileData.email}
          githubLink={profileData.githubLink}
          portfolioLink={profileData.portfolioLink}
          linkedinLink={profileData.linkedinLink}
        />
        <Skills skills={profileData.skills} />
      </div>
    </div>
  )
}

