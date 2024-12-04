import Link from 'next/link';
import { Search, Menu } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-[#18181B] sticky top-0 z-40 w-full border-b border-[#2A2A2E]">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/home" className="flex items-center space-x-2">
            <span className="inline-block font-bold text-white">DevMusic</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="#"
              className="flex items-center text-lg font-semibold text-gray-300 hover:text-white sm:text-sm"
            >
              Discover
            </Link>
            <Link
              href="#"
              className="flex items-center text-lg font-semibold text-gray-300 hover:text-white sm:text-sm"
            >
              Library
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search playlists..."
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px] h-9 bg-[#1F1F23] py-2 text-sm text-white placeholder-gray-500 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md border border-gray-600"
              />
            </div>
          </div>
          <button className="md:hidden">
            <Menu className="h-6 w-6 text-gray-300" />
            <span className="sr-only">Toggle menu</span>
          </button>
        </div>
      </div>
    </header>
  );
}
