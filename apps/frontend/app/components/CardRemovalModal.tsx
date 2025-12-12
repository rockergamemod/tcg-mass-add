import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { type TcgCardDto } from '@repo/shared-types';

export interface CardRemovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  cards: TcgCardDto[];
  finishType: string;
  onRemoveCard: (card: TcgCardDto, index: number) => void;
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

const formatArtVariant = (artVariant?: string): string => {
  if (!artVariant) return '';
  return artVariant
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default function CardRemovalModal({
  isOpen,
  onClose,
  cards,
  finishType,
  onRemoveCard,
}: CardRemovalModalProps) {
  if (!isOpen) return null;

  const handleCardClick = (card: TcgCardDto, index: number) => {
    if (window.confirm('Are you sure you want to remove this card?')) {
      onRemoveCard(card, index);
    }
  };

  // Find the printing for this finishType for each card
  const getPrintingForCard = (card: TcgCardDto) => {
    return card.printings?.find((p) => p.finishType === finishType);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-zinc-950 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            {FINISH_TYPE_LABEL[finishType] ?? finishType} - {cards.length} Cards
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Close modal"
          >
            <XMarkIcon className="size-6 text-zinc-600 dark:text-zinc-400" />
          </button>
        </div>

        {/* Grid of cards */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {cards.map((card, i) => {
              const printing = getPrintingForCard(card);
              const cardKey = card.id
                ? `${card.id}-${i}`
                : `${card.image}-${i}`;

              return (
                <div
                  key={cardKey}
                  className="relative group cursor-pointer"
                  onClick={() => handleCardClick(card, i)}
                >
                  <div className="aspect-[63/88] rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                    {card.image ? (
                      <img
                        src={card.image}
                        alt={card.canonicalName || 'Card'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-zinc-400 dark:text-zinc-600 text-sm">
                          No Image
                        </span>
                      </div>
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gray-900/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <XMarkIcon className="size-8 text-red-500" />
                    </div>
                  </div>
                  {/* Card info */}
                  <div className="mt-2 space-y-1">
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50 line-clamp-2">
                      {card.canonicalName}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                      <span>#{card.collectorNumber}</span>
                      {printing && (
                        <>
                          <span>•</span>
                          <span>
                            {FINISH_TYPE_LABEL[printing.finishType] ??
                              printing.finishType}
                            {printing.artVariant &&
                              `${printing.artVariant}` !==
                                `${printing.finishType}` &&
                              ` • ${formatArtVariant(printing.artVariant)}`}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
