import React from "react";
import { NoSymbolIcon } from "@heroicons/react/24/solid";

export interface SelectedCardListProps {
  finishType: string;
  cards: {
    id?: string | number;
    image?: string; // URL
  }[];
  maxVisible?: number; // how many images to show before "+N"
}

function cardListToTcgPlayerString() {
  let baseUrl = `https://www.tcgplayer.com/massentry?productline=Pokemon`;

  // TODO: Implement this.
  const textData = "";

  baseUrl += `&c=${textData.split("\n").join("||")}`;
}

const FINISH_TYPE_LABEL: Record<string, string> = {
  normal: "Normal",
  "reverse-holo": "Rev. Holo",
  holofoil: "Holo",
  "unlimited-holo": "Unlm. Holo",
  unlimited: "Unlimited",
  "1st-edition-holo": "1st Ed. Holo",
  "1st-edition": "1st Ed.",
};

export default function SelectedCardList({
  finishType,
  cards,
  maxVisible = 4,
}: SelectedCardListProps) {
  const visibleCards = cards.slice(0, maxVisible);
  const remaining = cards.length - visibleCards.length;
  const remainingDigits = remaining.toString().length;
  const remainingTextSize =
    remainingDigits === 1
      ? "text-3xl"
      : remainingDigits === 2
      ? "text-2xl"
      : remainingDigits === 3
      ? "text-xl"
      : "text-l";

  return (
    <div className="rounded-3xl bg-black text-white px-6 py-5 border border-white/10 overflow-hidden">
      <p>{FINISH_TYPE_LABEL[finishType] ?? finishType}</p>
      {/* Row 1: count + arrow */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-3xl font-semibold leading-none">
          {cards.length} Cards
        </p>
        {/* <button>arrow</button> */}
      </div>

      {/* Row 2: images */}
      <div className="flex items-center gap-4 overflow-x-auto">
        {visibleCards.map((card, i) => (
          <div
            key={card.id ? `${card.id}-${i}` : `${card.image}-${i}`}
            className="shrink-0"
          >
            {card.image ? (
              <img src={card.image} alt="" className="h-20 object-cover" />
            ) : (
              <div className="bg-black border hrink-0 h-20 w-14 rounded-xl bg-gray/70 flex items-center justify-center font-semibold transition">
                <NoSymbolIcon className="size-6" />
                {/* <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636"
                  />
                </svg> */}
              </div>
            )}
          </div>
        ))}

        {remaining > 0 && (
          <button
            type="button"
            // TODO: Implement on click
            onClick={undefined}
            className="hover:bg-gray-900 border hrink-0 h-20 w-14 rounded-xl bg-black/70 flex items-center justify-center font-semibold hover:bg-white/10 transition"
            aria-label={`Show remaining ${remaining} cards`}
          >
            <span className={remainingTextSize}>+{remaining}</span>
          </button>
        )}
      </div>
    </div>
  );
}
