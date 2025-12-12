'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function NavBar() {
  return (
    <nav className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex w-full max-w-[1600px] items-center px-8 py-4">
        {/* Left side links */}
        <div
          className="flex flex-1 items-center justify-start"
          title="Check out the Rocker Gaming Store for Video Game console mod kits, accessories, and more!"
        >
          <a
            href="https://shop.rockergaming.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-medium text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            <Image
              src="/icons/logo.png"
              alt="Check out the Rocker Gaming Store for Video Game console mod kits, accessories, and more!"
              width={20}
              height={20}
              className="h-5 w-5"
            />
            <span>Rocker Gaming Store</span>
          </a>
        </div>

        {/* Center title */}
        <div className="flex flex-1 items-center justify-center">
          <Link
            href="/"
            className="text-xl font-semibold tracking-tight text-zinc-900 transition hover:text-zinc-700 dark:text-zinc-50 dark:hover:text-zinc-200"
          >
            TCGplayer Mass Add
          </Link>
        </div>

        {/* Right side links */}
        <div className="flex flex-1 items-center justify-end gap-4">
          {/* <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-medium text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            <Image
              src="/icons/github.svg"
              alt="GitHub"
              width={20}
              height={20}
              className="h-5 w-5"
            />
            <span>GitHub</span>
          </a> */}
        </div>
      </div>
    </nav>
  );
}
