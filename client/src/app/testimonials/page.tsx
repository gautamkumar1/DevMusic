import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import React from "react";


function Testimonials() {
  return (
    <div className="h-[40rem] rounded-md flex flex-col antialiased bg-white dark:bg-[#0C0A09] dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards
        items={testimonialsData}
        direction="right"
        speed="slow"
      />
    </div>
  );
}

const testimonialsData = [
    {
      quote:
        "The live code-sharing feature has completely transformed how I collaborate with my team. Real-time debugging and music make coding sessions more productive and enjoyable.",
      name: "Aarav Patel",
      title: "Software Engineer, Pune",
    },
    {
      quote:
        "I never thought I'd find a platform where I could chat with fellow developers while listening to mood-based playlists. It's my go-to space for finding coding inspiration.",
      name: "Neha Sharma",
      title: "Frontend Developer, Bengaluru",
    },
    {
      quote:
        "Creating rooms and inviting my friends for coding marathons has never been this fun! The seamless collaboration features keep us focused without any distractions.",
      name: "Rohan Gupta",
      title: "Full Stack Developer, Mumbai",
    },
    {
      quote:
        "No ads, just code. That's exactly what I needed. DevMusic offers a distraction-free environment that keeps me in the zone for hours.",
      name: "Priya Iyer",
      title: "Backend Developer, Chennai",
    },
    {
      quote:
        "Finding a coding buddy has been a game-changer for me. I’ve met so many like-minded developers who’ve helped me level up my skills while sharing some great tunes!",
      name: "Vikram Mehta",
      title: "DevOps Engineer, Hyderabad",
    },
  ];
  
export default Testimonials;