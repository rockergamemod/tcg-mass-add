import React from 'react';
import { NoSymbolIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { type TcgCardDto } from '@repo/shared-types';

export interface SelectedCardListProps {
  finishType: string;
  cards: TcgCardDto[];
  maxVisible?: number; // how many images to show before "+N"
  onRemoveCard?: (card: TcgCardDto, index: number) => void;
  onShowAll?: () => void;
}

function cardListToTcgPlayerString() {
  let baseUrl = `https://www.tcgplayer.com/massentry?productline=Pokemon`;

  // TODO: Implement this.
  const textData = '';

  baseUrl += `&c=${textData.split('\n').join('||')}`;
}

const FINISH_TYPE_LABEL: Record<string, string> = {
  normal: 'Normal',
  'reverse-holo': 'Rev. Holo',
  holofoil: 'Holo',
  'unlimited-holo': 'Unlm. Holo',
  unlimited: 'Unlimited',
  '1st-edition-holo': '1st Ed. Holo',
  '1st-edition': '1st Ed.',
};

export default function SelectedCardList({
  finishType,
  cards,
  maxVisible = 4,
  onRemoveCard,
  onShowAll,
}: SelectedCardListProps) {
  const visibleCards = cards.slice(0, maxVisible);
  const remaining = cards.length - visibleCards.length;
  const remainingDigits = remaining.toString().length;
  const remainingTextSize =
    remainingDigits === 1
      ? 'text-3xl'
      : remainingDigits === 2
      ? 'text-2xl'
      : remainingDigits === 3
      ? 'text-xl'
      : 'text-l';

  const handleCardClick = (card: TcgCardDto, index: number) => {
    if (
      onRemoveCard &&
      window.confirm('Are you sure you want to remove this card?')
    ) {
      onRemoveCard(card, index);
    }
  };

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
        {visibleCards.map((card, i) => {
          const cardKey = card.id ? `${card.id}-${i}` : `${card.image}-${i}`;
          return (
            <div
              key={cardKey}
              className="shrink-0 relative group cursor-pointer"
              onClick={() => handleCardClick(card, i)}
            >
              {card.image ? (
                <>
                  <img
                    src={card.image}
                    alt=""
                    className="h-20 object-cover rounded"
                  />
                  <div className="absolute inset-0 bg-gray-900/70 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                    <XMarkIcon className="size-8 text-red-500" />
                  </div>
                </>
              ) : (
                <div className="bg-black border hrink-0 h-20 w-14 rounded-xl bg-gray/70 flex items-center justify-center font-semibold transition relative group">
                  <NoSymbolIcon className="size-6" />
                  <div className="absolute inset-0 bg-gray-900/70 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                    <XMarkIcon className="size-8 text-red-500" />
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {remaining > 0 && (
          <button
            type="button"
            onClick={onShowAll}
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
