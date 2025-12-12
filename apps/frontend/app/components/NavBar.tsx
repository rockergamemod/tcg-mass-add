'use client';

import Link from 'next/link';

export default function NavBar() {
  return (
    <nav className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex w-full max-w-[1600px] items-center px-8 py-4">
        {/* Left side links */}
        <div className="flex flex-1 items-center justify-start">
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            YouTube
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
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}
