import { FeatureSection } from "@/components/FeatureSection";
import { FooterSection } from "@/components/layout/sections/footer";
import { HeroSection } from "@/components/layout/sections/hero";
import Playlist  from "@/components/Playlist";
import AccordionExample from "./faq/page";


export const metadata = {
  title: "DevMusic - Music Website for developers",
  description: "Code with Beats",
  openGraph: {
    type: "website",
    url: "https://github.com/gautamkumar1/DevMusic",
    title: "DevMusic - Music Website for developers",
    description: "Code with Beats",
    images: [
      {
        url: "https://res.cloudinary.com/dbzv9xfjp/image/upload/v1723499276/og-images/shadcn-vue.jpg",
        width: 1200,
        height: 630,
        alt: "Shadcn - Landing template",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "https://github.com/gautamkumar1/DevMusic",
    title: "DevMusic - Music Website for developers",
    description: "Code with Beats",
    images: [
      "https://res.cloudinary.com/dbzv9xfjp/image/upload/v1723499276/og-images/shadcn-vue.jpg",
    ],
  },
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <Playlist />
      <FeatureSection/>
      <AccordionExample />
      <FooterSection />
    </>
  );
}
