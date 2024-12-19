"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { icons } from "lucide-react";

interface BenefitsProps {
  icon: string;
  title: string;
  description: string;
}

const benefitList: BenefitsProps[] = [
  {
    icon: "Headphones",  
    title: "Deep Focus Beats",
    description:
      "Stay in the zone with calming, instrumental beats designed for deep concentration during coding marathons.",
  },
  {
    icon: "Code",  
    title: "Debug & Chill",
    description:
      "Unwind while debugging with a mix of chill electronic and lo-fi tracks that help you think through complex issues.",
  },
  {
    icon: "Coffee",  
    title: "Morning Code Boost",
    description:
      "Start your day with upbeat tunes to kickstart your morning coding session and spark fresh ideas.",
  },
  {
    icon: "Music",  
    title: "Code & Coffee",
    description:
      "Smooth jazz and acoustic vibes for early mornings and late-night coding sessions.",
  },
];

export const BenefitsSection = () => {
  return (
    <section id="benefits" className="container py-24 sm:py-32">
      <div className="grid lg:grid-cols-2 place-items-center lg:gap-24">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Stay Focused and Inspired with Music for Coding
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
          Enjoy tunes that help developers stay focused, think clearly, and code better during every session.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 w-full">
          {benefitList.map(({ icon, title, description }, index) => (
            <Card
              key={title}
              className="bg-muted/50 dark:bg-card hover:bg-background transition-all delay-75 group/number"
            >
              <CardHeader>
                <div className="flex justify-between">
                  <Icon
                    name={icon as keyof typeof icons}
                    size={32}
                    color="hsl(var(--primary))"
                    className="mb-6 text-primary"
                  />
                  <span className="text-5xl text-muted-foreground/15 font-medium transition-all delay-75 group-hover/number:text-muted-foreground/30">
                    0{index + 1}
                  </span>
                </div>

                <CardTitle>{title}</CardTitle>
              </CardHeader>

              <CardContent className="text-muted-foreground">
                {description}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
