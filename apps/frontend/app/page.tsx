'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import SetList from './components/SetList';
import SeriesList from './components/SeriesList';
import CardList from './components/CardList';
import { createLine } from './utils/tcgplayer';
import React from 'react';
import { cardsApi } from './utils/api';
import SelectedCardList from './components/SelectedCardList';
import AcknowledgmentModal from './components/AcknowledgmentModal';
import CardRemovalModal from './components/CardRemovalModal';
import {
  type TcgSetDto,
  type TcgCardDto,
  type TcgSeriesDto,
} from '@repo/shared-types';

export default function Home() {
  const [copiedLabel, setCopiedLabel] = useState('');
  const [textData, setTextData] = useState<Record<string, string>>({
    holo: '',
    reverse: '',
    normal: '',
  });
  const [selectedSeries, setSelectedSeries] = useState<
    TcgSeriesDto | undefined
  >();
  const [selectedSet, setSelectedSet] = useState<TcgSetDto | undefined>();
  const [selectedCards, setSelectedCards] = useState<
    Record<string, TcgCardDto[]>
  >({});

  const [cards, setCards] = useState<TcgCardDto[]>([]);
  const [isLoadingCards, setIsLoadingCards] = useState(false);
  const isHandlingPopState = useRef(false);
  const sidebarGifRef = useRef<HTMLImageElement>(null);
  const [removalModalOpen, setRemovalModalOpen] = useState(false);
  const [removalModalFinishType, setRemovalModalFinishType] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (!selectedSet) {
      setCards([]);
      return;
    }
    setIsLoadingCards(true);
    cardsApi
      .getAllForSet(+selectedSeries!.id, +selectedSet.id)
      .then((queriedCards) => {
        const sortedCards = queriedCards.sort((a: any, b: any) =>
          a.collectorNumber.localeCompare(b.collectorNumber, undefined, {
            numeric: true,
          })
        );
        setCards(sortedCards);
        setIsLoadingCards(false);
      });
  }, [selectedSeries, selectedSet]);

  // Handle browser back button
  useEffect(() => {
    const handlePopState = () => {
      isHandlingPopState.current = true;
      // If we have a selected set, reset it (go back to set list)
      if (selectedSet) {
        setSelectedSet(undefined);
      }
      // If we have a selected series but no set, reset series (go back to series list)
      else if (selectedSeries) {
        setSelectedSeries(undefined);
      }
      // Reset flag after state updates
      setTimeout(() => {
        isHandlingPopState.current = false;
      }, 0);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [selectedSeries, selectedSet]);

  // Push history states when navigating forward (but not when handling popstate)
  useEffect(() => {
    if (isHandlingPopState.current) {
      return;
    }

    if (selectedSet && selectedSeries) {
      // Push state when set is selected
      window.history.pushState(
        { type: 'set', seriesId: selectedSeries.id, setId: selectedSet.id },
        '',
        window.location.href
      );
    } else if (selectedSeries) {
      // Push state when series is selected
      window.history.pushState(
        { type: 'series', seriesId: selectedSeries.id },
        '',
        window.location.href
      );
    }
  }, [selectedSeries, selectedSet]);

  const rebuildTextDataForFinishType = useCallback(
    (finishType: string, cards: TcgCardDto[]) => {
      const lines: string[] = [];
      for (const card of cards) {
        const printing = card.printings?.find(
          (p) => p.finishType === finishType
        );
        if (!printing) continue;

        const source = (card as any)?.sources?.find(
          (s: any) => s.id === printing.source
        );
        const sourceName = source?.sourceName;
        const sourceSetCode = source?.sourceSetCode;
        if (sourceName) {
          const tcgString = createLine(sourceName, sourceSetCode);
          if (tcgString) {
            lines.push(tcgString);
          }
        }
      }
      return lines.join('\n') + (lines.length > 0 ? '\n' : '');
    },
    []
  );

  const onAddCard = (
    card: TcgCardDto,
    printing: TcgCardDto['printings'][number]
  ) => {
    const existingCards = selectedCards[printing.finishType] ?? [];
    const cardData = {
      ...selectedCards,
      [printing.finishType]: [...existingCards, card],
    };
    setSelectedCards(cardData);

    let tcgString = '';
    const source = (card as any)?.sources.find(
      (s: any) => s.id === printing.source
    );
    const sourceName = source?.sourceName;
    const sourceSetCode = source?.sourceSetCode;
    if (sourceName) {
      tcgString = createLine(sourceName, sourceSetCode);
    }

    if (!tcgString) {
      console.log(`Error creating TCG string: "${tcgString}"`);
      return;
    }
    if (!textData[printing.finishType]) {
      textData[printing.finishType] = '';
    }

    const newTextData = {
      ...textData,
      [printing.finishType]: textData[printing.finishType] + `${tcgString}\n`,
    };
    setTextData(newTextData);
  };

  const onRemoveCard = useCallback(
    (finishType: string, cardToRemove: TcgCardDto, index: number) => {
      const existingCards = selectedCards[finishType] ?? [];
      const updatedCards = existingCards.filter((_, i) => i !== index);

      const updatedSelectedCards = {
        ...selectedCards,
        [finishType]: updatedCards,
      };
      setSelectedCards(updatedSelectedCards);

      // Rebuild textData for this finishType
      const newTextDataForFinishType = rebuildTextDataForFinishType(
        finishType,
        updatedCards
      );
      const newTextData = {
        ...textData,
        [finishType]: newTextDataForFinishType,
      };
      setTextData(newTextData);
    },
    [selectedCards, textData, rebuildTextDataForFinishType]
  );

  const copyOptions = useMemo(() => [{ label: 'Copy' }], []);

  const handleCopy = useCallback(
    async (label: string, variant: string) => {
      try {
        await navigator.clipboard.writeText(textData[variant]!);
        setCopiedLabel(label);
        setTimeout(() => setCopiedLabel('Copied'), 1500);
      } catch (error) {
        console.error('Unable to copy list', error);
      }
    },
    [setCopiedLabel]
  );

  const handleModalAcknowledge = useCallback(() => {
    // Restart the sidebar GIF by forcing a reload
    if (sidebarGifRef.current) {
      const img = sidebarGifRef.current;
      const src = img.src;
      // Clear and reset the src to force reload
      img.src = '';
      // Use setTimeout to ensure the browser processes the change
      setTimeout(() => {
        img.src = src;
      }, 10);
    }
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 dark:bg-black dark:text-zinc-50">
      <AcknowledgmentModal onAcknowledge={handleModalAcknowledge} />
      {removalModalFinishType && (
        <CardRemovalModal
          isOpen={removalModalOpen}
          onClose={() => {
            setRemovalModalOpen(false);
            setRemovalModalFinishType(null);
          }}
          cards={selectedCards[removalModalFinishType] ?? []}
          finishType={removalModalFinishType}
          onRemoveCard={(card, index) => {
            onRemoveCard(removalModalFinishType, card, index);
          }}
        />
      )}
      <main className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col justify-center px-8 py-16 lg:flex-row lg:items-stretch lg:gap-12">
        <section className="flex flex-1 flex-col justify-start gap-6 rounded-3xl border border-zinc-200 bg-white p-8 shadow-lg shadow-zinc-200/60 dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-none">
          <h1 className="text-4xl font-semibold leading-tight tracking-tight">
            Build your master set in seconds.
          </h1>
          {selectedSeries === undefined ? (
            <SeriesList
              onSelect={(v) => {
                setSelectedSeries(v);
              }}
            />
          ) : selectedSet === undefined ? (
            <SetList
              selectedSeries={selectedSeries}
              onSelect={(v) => setSelectedSet(v)}
              resetSeries={() => setSelectedSeries(undefined)}
            />
          ) : (
            <CardList
              selectedSeries={selectedSeries}
              selectedSet={selectedSet}
              onAddVariant={onAddCard as any}
              resetSet={() => setSelectedSet(undefined)}
              cards={cards}
              isLoading={isLoadingCards}
              selectedCards={selectedCards}
            />
          )}
        </section>

        <div className="flex flex-1 flex-col gap-6">
          <section className="sticky top-20 z-30 flex max-h-[calc(100vh-5rem)] flex-col overflow-y-auto rounded-3xl border border-zinc-200 bg-white pt-4 p-8 shadow-xl shadow-emerald-100/70 dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-none">
            {Object.entries(textData).filter(
              ([variant]) => textData[variant]!.length > 0
            ).length === 0 ? (
              <div className="pt-4">
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-8 dark:border-zinc-800 dark:bg-zinc-900">
                  <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                    How to Use
                  </h2>
                  <div className="mb-6">
                    <p className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Demo of using the app:
                    </p>
                    <img
                      ref={sidebarGifRef}
                      src="/demo/tcg-mass-add-2.gif"
                      alt="Demo of TCGplayer Mass Add app"
                      className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800"
                    />
                  </div>
                  <ol className="space-y-4 text-zinc-600 dark:text-zinc-400">
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-100">
                        1
                      </span>
                      <span>
                        Select a{' '}
                        <strong className="font-semibold text-zinc-900 dark:text-zinc-50">
                          Series
                        </strong>{' '}
                        from the list on the left
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-100">
                        2
                      </span>
                      <span>
                        Choose a{' '}
                        <strong className="font-semibold text-zinc-900 dark:text-zinc-50">
                          Set
                        </strong>{' '}
                        from that series
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-100">
                        3
                      </span>
                      <span>
                        Click on the{' '}
                        <strong className="font-semibold text-zinc-900 dark:text-zinc-50">
                          card variants
                        </strong>{' '}
                        you want to add (Normal, Reverse Holo, Holo, etc.)
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-100">
                        4
                      </span>
                      <span>
                        Once you've added cards, you can{' '}
                        <strong className="font-semibold text-zinc-900 dark:text-zinc-50">
                          copy
                        </strong>{' '}
                        the list or{' '}
                        <strong className="font-semibold text-zinc-900 dark:text-zinc-50">
                          Open TCGPlayer
                        </strong>{' '}
                        to automatically fill in the Mass Entry form
                      </span>
                    </li>
                  </ol>
                  <div className="mt-6 rounded-xl border border-zinc-300 bg-zinc-100 p-4 dark:border-zinc-700 dark:bg-zinc-800">
                    <p className="text-sm text-zinc-700 dark:text-zinc-300">
                      <strong className="font-semibold text-zinc-900 dark:text-zinc-50">
                        Note:
                      </strong>{' '}
                      Due to the way TCGPlayer's Mass Entry works, the
                      finish/printing of the card cannot be automatically
                      populated. You will need to manually select the finish
                      (Holo, Reverse Holo, 1st Edition, etc.) based on the cards
                      you are adding. Unforunately, until TCGPlayer updates
                      their API this is an unavoidable limitation.
                    </p>
                    <p className="pt-2 text-sm text-zinc-700 dark:text-zinc-300">
                      Ultimately this means you will have to manually un-select
                      the printings from the popup on the Mass Entry form.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              Object.entries(selectedCards).map(([finishType, cards]) => {
                return (
                  <div
                    className="pt-4 pb-4 border-b border-zinc-800"
                    key={finishType}
                  >
                    <div className="mb-4 flex flex-wrap items-center gap-3">
                      {copyOptions.map(({ label }) => (
                        <button
                          key={label}
                          type="button"
                          onClick={() => handleCopy(label, finishType)}
                          className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-900 transition hover:border-emerald-300 hover:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-100"
                        >
                          {label}
                        </button>
                      ))}
                      <a
                        key="tcg-player"
                        href={`https://www.tcgplayer.com/massentry?c=${textData[
                          finishType
                        ]!.split('\n').join('||')}&productline=Pokemon`}
                        className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-900 transition hover:border-emerald-300 hover:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-100"
                        target="_blank"
                      >
                        Open TCGPlayer
                      </a>
                    </div>
                    <SelectedCardList
                      key={finishType}
                      finishType={finishType}
                      cards={cards}
                      onRemoveCard={(card, index) =>
                        onRemoveCard(finishType, card, index)
                      }
                      onShowAll={() => {
                        setRemovalModalFinishType(finishType);
                        setRemovalModalOpen(true);
                      }}
                    />
                  </div>
                );
              })
            )}
            {/* {Object.entries(selectedCards).map(([finishType, cards]) => {
              return (
                <SelectedCardList
                  key={finishType}
                  finishType={finishType}
                  cards={cards}
                />
              );
            })} */}
            {copiedLabel && (
              <p className="mt-3 text-sm font-medium text-emerald-600 dark:text-emerald-300">
                {copiedLabel} copied to clipboard!
              </p>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
