import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Github, Globe, Linkedin } from 'lucide-react'

interface ContactInfoProps {
  email: string
  githubLink: string
  portfolioLink: string
  linkedinLink: string
}

export default function ContactInfo({ email, githubLink, portfolioLink, linkedinLink }: ContactInfoProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button variant="outline" className="w-full">
            <Mail className="mr-2 h-4 w-4" />
            {email}
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <a href={githubLink} target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </a>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <a href={portfolioLink} target="_blank" rel="noopener noreferrer">
              <Globe className="mr-2 h-4 w-4" />
              Portfolio
            </a>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <a href={linkedinLink} target="_blank" rel="noopener noreferrer">
              <Linkedin className="mr-2 h-4 w-4" />
              LinkedIn
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

