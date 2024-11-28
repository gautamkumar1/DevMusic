import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Coffee, Rocket, Waves, Music, Users, LayoutList, Search } from 'lucide-react';

export default function Playlist() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-12">
        Curated Playlists for Every Developer Mood
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Deep Focus Beats */}
        <Card className="group hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-xl">Deep Focus Beats</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Stay in the zone with calming, instrumental beats designed for deep concentration during coding marathons.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-2 bg-primary/10 rounded-full overflow-hidden">
              <div className="w-full h-full bg-primary rounded-full animate-pulse" />
            </div>
          </CardContent>
        </Card>

        {/* Debug & Chill */}
        <Card className="group hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Waves className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-xl">Debug & Chill</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Unwind while debugging with a mix of chill electronic and lo-fi tracks that help you think through complex issues.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-2 bg-primary/10 rounded-full overflow-hidden">
              <div className="w-full h-full bg-primary rounded-full animate-pulse" />
            </div>
          </CardContent>
        </Card>

        {/* Epic Launch Mode */}
        <Card className="group hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Rocket className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-xl">Epic Launch Mode</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Boost your energy with high-tempo tracks to power through your final stretch before a big launch.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-2 bg-primary/10 rounded-full overflow-hidden">
              <div className="w-full h-full bg-primary rounded-full animate-pulse" />
            </div>
          </CardContent>
        </Card>

        {/* Morning Code Boost */}
        <Card className="group hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Coffee className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-xl">Morning Code Boost</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Start your day with upbeat tunes to kickstart your morning coding session and spark fresh ideas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-2 bg-primary/10 rounded-full overflow-hidden">
              <div className="w-full h-full bg-primary rounded-full animate-pulse" />
            </div>
          </CardContent>
        </Card>

        {/* Code & Coffee */}
        <Card className="group hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Coffee className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-xl">Code & Coffee</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Smooth jazz and acoustic vibes for early mornings and late-night coding sessions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-2 bg-primary/10 rounded-full overflow-hidden">
              <div className="w-full h-full bg-primary rounded-full animate-pulse" />
            </div>
          </CardContent>
        </Card>

        {/* Hackathon Hype */}
        <Card className="group hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-xl">Hackathon Hype</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              High-energy tracks to fuel your coding sprints and hackathons.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-2 bg-primary/10 rounded-full overflow-hidden">
              <div className="w-full h-full bg-primary rounded-full animate-pulse" />
            </div>
          </CardContent>
        </Card>

        {/* Retro Code Jams */}
        <Card className="group hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <LayoutList className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-xl">Retro Code Jams</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              8-bit and retro synth tracks for nostalgic coding vibes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-2 bg-primary/10 rounded-full overflow-hidden">
              <div className="w-full h-full bg-primary rounded-full animate-pulse" />
            </div>
          </CardContent>
        </Card>

        {/* Zen Coding */}
        <Card className="group hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Search className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-xl">Zen Coding</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Ambient nature sounds for a calm, focused coding environment.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-2 bg-primary/10 rounded-full overflow-hidden">
              <div className="w-full h-full bg-primary rounded-full animate-pulse" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
