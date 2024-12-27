import React from 'react';
import { Separator } from "@/components/ui/separator";
import { CodeIcon, GithubIcon, TwitterIcon, BookOpenIcon, HeartIcon, CpuIcon } from "lucide-react";
import Link from "next/link";

export const FooterSection = () => {
  return (
    <footer id="footer" className="container py-24 sm:py-32">
      <div className="p-10 bg-card border border-secondary rounded-2xl">
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-x-12 gap-y-8">
          <div className="col-span-full xl:col-span-2">
            <Link href="#" className="flex font-bold items-center">
              <CodeIcon className="w-9 h-9 mr-2 bg-gradient-to-tr from-primary via-primary/70 to-primary rounded-lg border border-secondary" />
              <h3 className="text-2xl">DevMusic</h3>
            </Link>
            <p className="mt-4 text-sm opacity-70">
              Where code meets melody. Build, customize, and integrate music into your applications.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">Developer Tools</h3>
            <div>
              <Link href="#" className="opacity-60 hover:opacity-100 flex items-center gap-2">
                <CpuIcon className="w-4 h-4" />
                API Docs
              </Link>
            </div>
            <div>
              <Link href="#" className="opacity-60 hover:opacity-100 flex items-center gap-2">
                <BookOpenIcon className="w-4 h-4" />
                SDK Guide
              </Link>
            </div>
            <div>
              <Link href="#" className="opacity-60 hover:opacity-100">
                Playground
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">Resources</h3>
            <div>
              <Link href="#" className="opacity-60 hover:opacity-100">
                Code Examples
              </Link>
            </div>
            <div>
              <Link href="#" className="opacity-60 hover:opacity-100">
                Best Practices
              </Link>
            </div>
            <div>
              <Link href="#" className="opacity-60 hover:opacity-100">
                Change Log
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">Community</h3>
            <div>
              <Link href="#" className="opacity-60 hover:opacity-100">
                Discord Server
              </Link>
            </div>
            <div>
              <Link href="#" className="opacity-60 hover:opacity-100">
                Stack Overflow
              </Link>
            </div>
            <div>
              <Link href="#" className="opacity-60 hover:opacity-100">
                GitHub Discussions
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">Open Source</h3>
            <div>
              <Link href="#" className="opacity-60 hover:opacity-100">
                Contribute
              </Link>
            </div>
            <div>
              <Link href="#" className="opacity-60 hover:opacity-100">
                Report Issues
              </Link>
            </div>
            <div>
              <Link href="#" className="opacity-60 hover:opacity-100">
                Project Roadmap
              </Link>
            </div>
          </div>
        </div>

        <Separator className="my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <Link href="https://github.com/gautamkumar1" className="opacity-60 hover:opacity-100">
              <GithubIcon className="w-5 h-5" />
            </Link>
            <Link href="https://x.com/xXGauTamxX_" className="opacity-60 hover:opacity-100">
              <TwitterIcon className="w-5 h-5" />
            </Link>
          </div>
          
          <p className="text-sm opacity-70">
            Made with <HeartIcon className="w-4 h-4 inline mx-1 text-red-500" /> by
            <Link
              target="_blank"
              href="https://github.com/gautamkumar1"
              className="text-primary transition-all border-primary hover:border-b-2 ml-1"
            >
              Gautam
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;