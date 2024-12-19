import { cn } from "@/lib/utils";
import {
  IconAdOff,
  IconCalendarEvent,
  IconCode,
  IconMessageChatbot,
  IconMusic,
  IconTerminal,
  IconUsers,
  IconUserSearch,
} from "@tabler/icons-react";

function FeatureSection() {
  const features = [
    {
      title: "Code-Friendly Soundscapes",
      description: "Music tailored for deep focus, debugging, and late-night coding sessions.",
      icon: <IconTerminal />,
    },
    {
      title: "Real-Time Developer Chat",
      description: "Collaborate and share ideas with fellow developers in real-time.",
      icon: <IconMessageChatbot />,
    },
    {
      title: "Live Code & Debug Sharing",
      description: "Seamlessly share and debug code with teammates while listening to your favorite tunes.",
      icon: <IconCode />,
    },
    {
      title: "Mood-Based Playlists",
      description: "Curated playlists for every coding mood, from 'Deep Focus' to 'Victory Dance'.",
      icon: <IconMusic />,
    },
    {
      title: "Create Rooms & Invite Friends",
      description: "Host private rooms, invite friends, and share your favorite tracks and code in real-time.",
      icon: <IconUsers />,
    },
    {
      title: "Developer Meetups & Events",
      description: "Join virtual coding jams, hackathons, and networking events.",
      icon: <IconCalendarEvent />,
    },
    {
      title: "No Ads, Just Code",
      description: "Enjoy an ad-free experience that keeps your coding flow uninterrupted.",
      icon: <IconAdOff />,
    },
    {
      title: "Find Your Coding Buddy",
      description: "Connect with like-minded developers for project collaborations and brainstorming.",
      icon: <IconUserSearch />,
    },
  ];

  return (
    <div>
      <h4 className="m-10 text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-semibold text-neutral-800 dark:text-neutral-200">
  Built for Coders, Powered by DevMusic
</h4>

<p className="text-sm lg:text-base max-w-2xl my-4 mx-auto text-neutral-600 text-center font-light dark:text-neutral-400">
  Discover developer-focused features blending code and music—API-driven playlists, flow-enhancing beats, and open-source tools for endless creativity.
</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  relative z-10 py-10 max-w-7xl mx-auto">

        {features.map((feature, index) => (
          <Feature key={feature.title} {...feature} index={index} />
        ))}
      </div>
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r  py-10 relative group/feature dark:border-neutral-800",
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
        index < 4 && "lg:border-b dark:border-neutral-800"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};

export default FeatureSection;