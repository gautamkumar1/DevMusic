import { FC } from 'react'
import Image from 'next/image'

const testimonials = [
  {
    name: 'Priyank Saxena',
    description:
    "The live code-sharing feature has completely transformed how I collaborate with my team. Real-time debugging and music make coding sessions more productive and enjoyable.",
    profession: 'Software Engineer, Pune',
    image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
  },
  {
    name: 'Rahul Sharma',
    profession: 'Design Engineer',
    description:
    "I never thought I'd find a platform where I could chat with fellow developers while listening to mood-based playlists. It's my go-to space for finding coding inspiration.",
    image: 'https://images.unsplash.com/photo-1601455763557-db1bea8a9a5a',
  },
  {
    name: 'Priyanka Gupta',
    profession: 'Full Stack Developer, Mumbai',
    description:
    "Creating rooms and inviting my friends for coding marathons has never been this fun! The seamless collaboration features keep us focused without any distractions.",
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
  },
  {
    name: 'Khushbu Mandal',
    profession: 'Backend Developer',
    description:
    "No ads, just code. That's exactly what I needed. DevMusic offers a distraction-free environment that keeps me in the zone for hours.",
    image: 'https://images.unsplash.com/photo-1569913486515-b74bf7751574',
  },
  {
    name: 'Ankush Kumar',
    profession: 'Game Developer',
    description:
    "Finding a coding buddy has been a game-changer for me. I’ve met so many like-minded developers who’ve helped me level up my skills while sharing some great tunes!",
    image: 'https://images.unsplash.com/photo-1645830166230-187caf791b90',
  },
  {
    name: 'Tiya Patel',
    profession: 'UX Designer',
    description:
      "Collaborating with fellow coders has been amazing! 🤝 Learned a ton, made new friends, and had a blast. 🎧",
    image: 'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa',
  },
]

interface TestimonialCardProps {
  name: string
  description: string
  image: string
  profession: string
}

const TestimonialCard: FC<TestimonialCardProps> = ({
  name,
  description,
  image,
  profession,
}) => {
  return (
    <div
      className="card-shadow dark:border-neutral-90 relative flex h-auto max-w-[22rem] select-none flex-col items-start justify-center overflow-hidden rounded-2xl border border-neutral-100 p-5 shadow-sm transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-sm dark:border-neutral-800 dark:hover:shadow-white/10"
    >
      <div className="absolute right-0 top-0 h-24 w-24 rounded-2xl bg-gradient-to-r from-[#fb3a5d]  to-[#fb3a5d] opacity-20 blur-3xl"></div>
      <div className="mb-0 flex h-fit flex-row items-center gap-3">
        <Image
          className="m-0 block h-11 w-11 rounded-full object-cover"
          src={image}
          alt={`Avatar of ${name}`}
          width={120}
          height={80}
        />
        <div className="mb-0 flex h-fit flex-col items-start">
          <h3 className="m-0 text-base font-medium text-gray-900 dark:text-gray-100">
            {name}
          </h3>
          <p className="font-regular m-0 text-center text-sm text-gray-600 dark:text-gray-400">
            {profession}
          </p>
        </div>
      </div>
      <p className="mb-0 mt-3 text-left text-sm font-light text-gray-600 md:text-base dark:text-gray-400">
        {description}
      </p>
    </div>
  )
}

const Testimonials = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-12">
      <h1 className="mb-1 max-w-2xl text-center text-5xl font-semibold tracking-tighter text-gray-900 dark:text-gray-100 md:text-4xl">
         <span className="text-green-500 text-5xl font-bold">Wall of Love ❤️</span>
      </h1>
      <p className="max-w-2xl text-center text-sm font-light text-gray-600 dark:text-gray-400 md:text-base">
      Join a community of developers who love music and code.
      </p>
      <div className="relative mt-12 flex h-full w-full flex-col items-center justify-center gap-5 md:flex-row">
        {[0, 1, 2].map((colIndex) => (
          <div key={colIndex} className="flex flex-col justify-center gap-4">
            {testimonials
              .slice(colIndex * 2, colIndex * 2 + 2)
              .map((testimonial) => (
                <TestimonialCard key={testimonial.name} {...testimonial} />
              ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Testimonials;
