"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import tcgdex from "./utils/tcgdex";
import SetList from "./components/SetList";
import SeriesList from "./components/SeriesList";
import CardList from "./components/CardList";
import { CardResume, Query, SerieResume, SetResume } from "@tcgdex/sdk";
import { createLine, setNameToPrintedTotal } from "./utils/tcgplayer";

export default function Home() {
  const [copiedLabel, setCopiedLabel] = useState("");
  const [textData, setTextData] = useState<Record<string, string>>({
    holo: "",
    reverse: "",
    normal: "",
  });
  const [selectedSeries, setSelectedSeries] = useState<
    SerieResume | undefined
  >();
  const [selectedSet, setSelectedSet] = useState<SetResume | undefined>();
  const [selectedCards, setSelectedCards] = useState<
    Record<string, CardResume[]>
  >({
    holo: [],
    reverse: [],
    normal: [],
  });

  const [cards, setCards] = useState<CardResume[]>([]);
  useEffect(() => {
    if (!selectedSet) return;
    tcgdex.card
      .list(Query.create().equal("set", selectedSet.id))
      .then((queriedCards) => {
        Promise.all(queriedCards.map((c) => c.getCard())).then(
          (mappedCards) => {
            const rarities = mappedCards.reduce<string[]>((acc, c) => {
              if (acc.includes(c.rarity)) {
                return acc;
              }
              acc.push(c.rarity);
              return acc;
            }, []);
            console.log("rarities", rarities);
            setCards(mappedCards);
          }
        );
      });
  }, [selectedSeries, selectedSet]);

  console.log("selectedCards", selectedCards);
  const onAddCard = (card: CardResume, variant: string) => {
    const cardData = {
      ...selectedCards,
      [variant]: [...selectedCards[variant], card],
    };
    setSelectedCards(cardData);

    let cardName = card.name;
    const cardsWithName = cards.filter((c) =>
      c.name.toLowerCase().includes(card.name.toLowerCase())
    );
    const numCardsWithName = cardsWithName.length;
    if (numCardsWithName !== 1) {
      console.log("card has multiple listed", card);
      const printedTotal = setNameToPrintedTotal[selectedSet!.name];
      cardName = `${card.name} - ${card.localId}/${printedTotal}`;
    }

    const tcgString = createLine(cardName, selectedSet!.name);
    console.log(tcgString);
    const newTextData = {
      ...textData,
      [variant]: textData[variant] + `${tcgString}\n`,
    };
    setTextData(newTextData);
  };

  const copyOptions = useMemo(() => [{ label: "Copy" }], []);

  const handleCopy = useCallback(
    async (label: string, variant: string) => {
      try {
        console.log("adding to clipboard...", textData[variant]);
        await navigator.clipboard.writeText(textData[variant]);
        setCopiedLabel(label);
        setTimeout(() => setCopiedLabel(""), 1500);
      } catch (error) {
        console.error("Unable to copy list", error);
      }
    },
    [setCopiedLabel]
  );

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 dark:bg-black dark:text-zinc-50">
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-16 lg:flex-row lg:items-stretch lg:gap-12">
        <section className="flex flex-1 flex-col justify-center gap-6 rounded-3xl border border-zinc-200 bg-white p-8 shadow-lg shadow-zinc-200/60 dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-none">
          <p className="inline-flex items-center rounded-full bg-zinc-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
            TCGplayer Mass Add
          </p>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight">
            Build and paste a cardlist in seconds.
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
              onAddVariant={onAddCard}
              resetSet={() => setSelectedSet(undefined)}
              cards={cards}
            />
          )}
        </section>

        <div className="flex flex-1 flex-col gap-6">
          <section className="flex flex-col rounded-3xl border border-zinc-200 bg-white pt-4 p-8 shadow-xl shadow-emerald-100/70 dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-none">
            {Object.entries(textData).filter(
              ([variant]) => textData[variant].length > 0
            ).length === 0 ? (
              <div className="pt-4">
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  {copyOptions.map(({ label }) => (
                    <button
                      key={label}
                      type="button"
                      className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-900 transition hover:border-emerald-300 hover:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-100"
                    >
                      {label}
                    </button>
                  ))}
                  <a
                    key="tcg-player"
                    aria-disabled
                    href=""
                    className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-900 transition hover:border-emerald-300 hover:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-100"
                  >
                    Open TCGPlayer
                  </a>
                </div>
                <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
                  <label
                    htmlFor="decklist-output"
                    className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500"
                  >
                    Generated Output
                  </label>
                  <textarea
                    id="decklist-output"
                    value={""}
                    readOnly
                    className="h-64 w-full resize-none rounded-xl bg-white p-4 font-mono text-sm leading-snug text-zinc-900 outline-none ring-0 focus-visible:ring-2 focus-visible:ring-emerald-300 dark:bg-black dark:text-zinc-50"
                  />
                </div>
              </div>
            ) : (
              Object.entries(textData)
                .filter(([variant]) => textData[variant].length > 0)
                .map(([variant, text]) => {
                  return (
                    <div className="pt-4" key={variant}>
                      <div className="mb-4 flex flex-wrap items-center gap-3">
                        {copyOptions.map(({ label }) => (
                          <button
                            key={label}
                            type="button"
                            onClick={() => handleCopy(label, variant)}
                            className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-900 transition hover:border-emerald-300 hover:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-100"
                          >
                            {label}
                          </button>
                        ))}
                        <a
                          key="tcg-player"
                          href={`https://www.tcgplayer.com/massentry?c=${textData[
                            variant
                          ]
                            .split("\n")
                            .join("||")}&productline=Pokemon`}
                          className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-900 transition hover:border-emerald-300 hover:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-100"
                        >
                          Open TCGPlayer
                        </a>
                      </div>
                      <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
                        <label
                          htmlFor="decklist-output"
                          className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500"
                        >
                          Generated Output [{variant}]
                        </label>
                        <textarea
                          id="decklist-output"
                          value={textData[variant]}
                          readOnly
                          className="h-64 w-full resize-none rounded-xl bg-white p-4 font-mono text-sm leading-snug text-zinc-900 outline-none ring-0 focus-visible:ring-2 focus-visible:ring-emerald-300 dark:bg-black dark:text-zinc-50"
                        />
                      </div>
                    </div>
                  );
                })
            )}
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
