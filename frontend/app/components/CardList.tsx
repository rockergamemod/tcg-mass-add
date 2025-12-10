import {
  CardResume,
  Query,
  SerieResume,
  SetResume,
  type Card,
} from "@tcgdex/sdk";
import { useEffect, useState } from "react";
import tcgdex from "../utils/tcgdex";
import React from "react";
import clsx from "clsx"; // optional but nice

type VariantKey = keyof NonNullable<Card["variants"]>;

const VARIANT_LABELS: Record<VariantKey, string> = {
  normal: "Normal",
  reverse: "Reverse",
  holo: "Holo",
  firstEdition: "1st Edition",
};

export enum CardFinishType {
  Normal = "normal",
  Holo = "holofoil",
  ReverseHolo = "reverse-holo",
  Unlimited = "unlimited",
  UnlimitedHolo = "unlimited-holo",
  FirstEdition = "1st-edition",
  FirstEditionHolo = "1st-edition-holo",
  // Extend as needed
}

const FINISH_LABELS: Record<CardFinishType, string> = {
  [CardFinishType.Normal]: "Normal",
  [CardFinishType.Holo]: "Holo",
  [CardFinishType.ReverseHolo]: "Reverse Holo",
  [CardFinishType.Unlimited]: "Unlimited",
  [CardFinishType.UnlimitedHolo]: "Unlimited Holo",
  [CardFinishType.FirstEdition]: "1st Edition",
  [CardFinishType.FirstEditionHolo]: "1st Edition Holo",
};

export enum CardArtVariant {
  Normal = "normal",
  IllustrationRare = "illustration-rare",
  SpecialIllustrationRare = "special-illustration-rare",
  AltArt = "alt-art",
  AltFullArt = "alt-full-art",
  AltArtSecret = "alt-art-secret",
  PokeBall = "poke-ball",
  MasterBall = "master-ball",
  Secret = "secret",
  // Extend as needed
}

const ART_VARIANT_LABEL: Record<CardArtVariant, string> = {
  [CardArtVariant.Normal]: "",
  [CardArtVariant.IllustrationRare]: "(IR)",
  [CardArtVariant.SpecialIllustrationRare]: "(SIR)",
  [CardArtVariant.AltArt]: "(Alt Art)",
  [CardArtVariant.AltFullArt]: "(Alt Full Art)",
  [CardArtVariant.AltArtSecret]: "(Alt Art Secret)",
  [CardArtVariant.PokeBall]: "(Pokeball)",
  [CardArtVariant.MasterBall]: "(Masterball)",
  [CardArtVariant.Secret]: "(Secret)",
};

const RARITY_TO_COLOR: Record<string, string> = {
  Common: "green",
  Uncommon: "amber",
  Rare: "blue",
  "Double rare": "purple",
  "Illustration rare": "pink",
  "Ultra Rare": "gray",
  "Special illustration rare": "red",
  "Mega Hyper Rare": "yellow",
  "Holo Rare V": "purple",
  "Black White Rare": "white",
};

// fallback style if rarity isn't in the map
const DEFAULT_RARITY_STYLE =
  "bg-amber-400/10 text-amber-400 inset-ring inset-ring-amber-400/20";

const RARITY_STYLES: Record<string, string> = {
  Common: "bg-green-400/10 text-green-400 inset-ring inset-ring-green-400/20",
  Uncommon: "bg-amber-400/10 text-amber-400 inset-ring inset-ring-amber-400/20",
  Rare: "bg-blue-400/10 text-blue-400 inset-ring inset-ring-blue-400/20",
  "Holo Rare": "bg-blue-400/10 text-blue-400 inset-ring inset-ring-blue-400/20",
  "Rare Holo": "bg-blue-400/10 text-blue-400 inset-ring inset-ring-blue-400/20",
  "Radiant Rare":
    "bg-purple-400/10 text-purple-400 inset-ring inset-ring-purple-400/20",
  "Double rare":
    "bg-purple-400/10 text-purple-400 inset-ring inset-ring-purple-400/20",
  "Illustration rare":
    "bg-pink-400/10 text-pink-400 inset-ring inset-ring-pink-400/20",
  "Ultra Rare":
    "bg-gray-400/10 text-gray-400 inset-ring inset-ring-gray-400/20",
  "Special illustration rare":
    "bg-red-400/10 text-red-400 inset-ring inset-ring-red-400/20",
  "Mega Hyper Rare":
    "bg-yellow-400/10 text-yellow-400 inset-ring inset-ring-yellow-400/20",
  "Holo Rare V":
    "bg-purple-400/10 text-purple-400 inset-ring inset-ring-purple-400/20",
  "Holo Rare VMAX":
    "bg-purple-600/10 text-purple-600 inset-ring inset-ring-purple-600/20",
  "Black White Rare": "bg-white/10 text-white inset-ring inset-ring-white/20", // note: white has no -400 scale
  "Hyper rare":
    "bg-yellow-400/10 text-yellow-400 inset-ring inset-ring-yellow-400/20",
  "ACE SPEC Rare":
    "bg-pink-400/10 text-pink-400 inset-ring inset-ring-pink-400/20",
  "Shiny rare":
    "bg-orange-400/10 text-orange-400 inset-ring inset-ring-orange-400/20",
  "Shiny Ultra Rare":
    "bg-orange-400/10 text-orange-400 inset-ring inset-ring-orange-400/20",
  "Secret Rare":
    "bg-orange-400/10 text-orange-400 inset-ring inset-ring-orange-400/20",
  "Classic Collection":
    "bg-yellow-400/10 text-yellow-400 inset-ring inset-ring-yellow-400/20",
  LEGEND:
    "bg-yellow-400/10 text-yellow-400 inset-ring inset-ring-yellow-400/20",
};

const RARITY_LABEL: Record<string, string> = {
  Common: "C",
  Uncommon: "U",
  Rare: "R",
  "Holo Rare": "R",
  "Rare Holo": "R",
  "Radiant Rare": "RR",
  "Double rare": "RR",
  "Illustration rare": "IR",
  "Ultra Rare": "UR",
  "Special illustration rare": "SIR",
  "Mega Hyper Rare": "MHR",
  "Holo Rare V": "V",
  "Holo Rare VMAX": "VMAX",
  "Holo Rare VSTAR": "VSTAR",
  "Black White Rare": "BWR",
  "Hyper rare": "HR",
  "ACE SPEC Rare": "ACE",
  "Shiny rare": "Shiny",
  "Shiny Ultra Rare": "Shiny UR",
  "Secret Rare": "SR",
  "Classic Collection": "CC",
  LEGEND: "L",
};

const labelForFinishAndArt = (finish: CardFinishType, art: CardArtVariant) => {
  const finishLabel = FINISH_LABELS[finish];
  if (art === CardArtVariant.Normal) {
    return finishLabel;
  }

  const artLabel = ART_VARIANT_LABEL[art];
  return `${finishLabel} ${artLabel}`;
};

type CardListProps = {
  cards: CardResume[];
  selectedSeries: SerieResume;
  selectedSet: SetResume;
  onAddVariant?: (card: CardResume, variant: string) => void;
  resetSet: () => void;
};

type FetchCardsFunctionType = typeof tcgdex.card.list;
type FetchSetReturnType = NonNullable<
  Awaited<ReturnType<FetchCardsFunctionType>>
>;

const rarityVariantMap: Record<string, string[]> = {
  Common: ["normal", "reverse"],
  Uncommon: ["normal", "reverse"],
  Rare: ["holo", "reverse"],
  "Double rare": ["holo"],
  "Illustration rare": ["holo"],
  "Ultra Rare": ["holo"],
  "Special illustration rare": ["holo"],
  "Black White Rare": ["holo"],
  // SV
  "Hyper rare": ["holo"],
  "ACE SPEC Rare": ["holo"],
  // MEGA
  "Mega Hyper Rare": ["holo"],
  // SWSH
  "Holo Rare V": ["holo"],
  "Holo Rare VSTAR": ["holo"],
  "Holo Rare": ["holo"],
  "Radiant Rare": ["holo"],
  "Holo Rare VMAX": ["holo"],
  "Secret Rare": ["holo"],
};

export default function CardList({
  selectedSeries,
  selectedSet,
  onAddVariant,
  resetSet,
  cards,
}: CardListProps) {
  if (!cards || !cards.length) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
        No cards available yet. Pick a set to start browsing cards.
      </div>
    );
  }

  return (
    <>
      <div className="flex ">
        <button onClick={resetSet}>&#8592; Back</button>
      </div>
      <div className="flex flex-col gap-4">
        {cards.map((card) => {
          const {
            id,
            image,
            canonicalName,
            collectorNumber,
            set,
            rarity,
            category,
            printings,
            localId,
          } = card as any;

          const rarityStyle = RARITY_STYLES[rarity] ?? DEFAULT_RARITY_STYLE;

          return (
            <article
              key={`${set.id}-${id}`}
              className="flex gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm shadow-zinc-200/60 dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-none"
            >
              <span className="flex h-28 aspect-[5/7] items-center justify-center overflow-hidden border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
                {image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`${image}`}
                    alt={canonicalName}
                    className="h-full w-full object-cover"
                    draggable={false}
                    loading="lazy"
                  />
                ) : (
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                    No Image
                  </span>
                )}
              </span>

              <div className="flex flex-1 flex-col gap-3">
                <header className="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 pb-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-400">
                      {set.name}
                    </p>
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                      {canonicalName}
                      {collectorNumber ? (
                        <span className="ml-2 text-sm font-medium text-zinc-400">
                          #{collectorNumber}
                        </span>
                      ) : null}
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {category}
                    </p>
                  </div>
                  {rarity !== "None" ? (
                    <span
                      className={clsx(
                        "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium",
                        rarityStyle
                      )}
                    >
                      {RARITY_LABEL?.[rarity] || "Unknown Rarity"}
                    </span>
                  ) : null}
                </header>
                <div className="flex flex-wrap gap-2 flex-row-reverse">
                  {printings.length > 0 ? (
                    printings.map((printing: any) => (
                      <button
                        key={printing.id}
                        type="button"
                        onClick={() => onAddVariant?.(card, printing)}
                        className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-900 transition hover:text-black hover:border-emerald-300 hover:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-100"
                      >
                        +{" "}
                        {labelForFinishAndArt(
                          printing.finishType,
                          printing.artVariant
                        )}
                      </button>
                    ))
                  ) : (
                    <span className="text-xs font-medium text-zinc-400">
                      No variants listed for this card.
                    </span>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
