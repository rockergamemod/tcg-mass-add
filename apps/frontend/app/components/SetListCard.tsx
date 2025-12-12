import { type TcgSetDto } from '@repo/shared-types';
import React from 'react';

type SetListCardProps = {
  set: TcgSetDto;
  onSelect: (set: TcgSetDto) => void;
  isActive?: boolean;
};

export default function SetListCard({
  set,
  onSelect,
  isActive = false,
}: SetListCardProps) {
  const { id, name, logo } = set;
  const logoUrl = logo?.endsWith('.png') ? logo : `${logo}.png`;

  return (
    <button
      type="button"
      onClick={() => onSelect(set)}
      className={`group flex w-full items-center gap-4 rounded-2xl border px-4 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
        isActive
          ? 'border-emerald-400 bg-emerald-50 text-emerald-900 dark:border-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-100'
          : 'border-zinc-200 bg-white text-zinc-900 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100'
      }`}
    >
      <span className="flex h-14 aspect-[5/2] items-center justify-center overflow-hidden rounded-xl border border-dashed border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logoUrl}
            alt={`${name} logo`}
            className="h-full w-full object-contain"
            draggable={false}
          />
        ) : (
          <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
            No Logo
          </span>
        )}
      </span>
      <span className="flex flex-1 flex-col">
        <span className="text-sm font-semibold group-hover:text-black">
          {name}
        </span>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          Tap to add cards from this set
        </span>
      </span>
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400 group-hover:text-emerald-500">
        Select
      </span>
    </button>
  );
}
