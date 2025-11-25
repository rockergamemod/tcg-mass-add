import {
  CardResume,
  Query,
  SerieResume,
  SetResume,
  type Card,
} from "@tcgdex/sdk";
import { useEffect, useState } from "react";
import tcgdex from "../utils/tcgdex";

type VariantKey = keyof NonNullable<Card["variants"]>;

const VARIANT_LABELS: Record<VariantKey, string> = {
  normal: "Normal",
  reverse: "Reverse",
  holo: "Holo",
  firstEdition: "1st Edition",
};

type CardListProps = {
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
  Rare: ["holo"],
  "Double rare": ["holo"],
  "Illustration rare": ["holo"],
  "Ultra Rare": ["holo"],
  "Special illustration rare": ["holo"],
  "Black White Rare": ["holo"],
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
}: CardListProps) {
  const [cards, setCards] = useState<FetchSetReturnType>();
  useEffect(() => {
    tcgdex.card
      .list(Query.create().equal("set", selectedSet.id))
      .then((cards) => {
        console.log(cards);
        if (cards) {
          console.log(cards[2]);
          cards[2].getCard().then((card) => console.log(card));
          Promise.all(cards.map((c) => c.getCard())).then((mappedCards) => {
            const rarities = mappedCards.reduce<string[]>((acc, c) => {
              if (acc.includes(c.rarity)) {
                return acc;
              }
              acc.push(c.rarity);
              return acc;
            }, []);
            console.log(rarities);
            setCards(mappedCards);
          });
        }
      });
  }, [selectedSeries, selectedSet]);

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
          const { id, image, name, set, rarity, category, variants, localId } =
            card as any;
          const activeVariants = Object.entries(variants).filter(
            ([name, has]) => has
          );

          return (
            <article
              key={`${set.id}-${id}`}
              className="flex gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm shadow-zinc-200/60 dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-none"
            >
              <span className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
                {image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`${image}/high.webp`}
                    alt={name}
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
                <header className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-400">
                      {set.name}
                    </p>
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                      {name}
                      {localId ? (
                        <span className="ml-2 text-sm font-medium text-zinc-400">
                          #{localId}
                        </span>
                      ) : null}
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {category}
                    </p>
                  </div>
                  <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200">
                    {rarity || "Unknown Rarity"}
                  </span>
                </header>

                <div className="flex flex-wrap gap-2">
                  {rarity ? (
                    rarityVariantMap[rarity].map((variantKey) => (
                      <button
                        key={variantKey}
                        type="button"
                        onClick={() => onAddVariant?.(card, variantKey)}
                        className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-900 transition hover:border-emerald-300 hover:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-100"
                      >
                        Add{" "}
                        {
                          VARIANT_LABELS[
                            variantKey as keyof typeof VARIANT_LABELS
                          ]
                        }
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
