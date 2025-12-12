import { Suspense, useEffect, useState } from "react";
import tcgdex from "../utils/tcgdex";
import SetListCard from "./SetListCard";
import { SerieResume } from "@tcgdex/sdk";
import SeriesListCard from "./SeriesListCard";
import { seriesApi } from "../utils/api";
import React from "react";

type SeriesListProps = {
  onSelect: (series: SerieResume) => void;
};
type FetchSetsFunctionType = typeof tcgdex.fetchSeries;
type FetchSetReturnType = NonNullable<
  Awaited<ReturnType<FetchSetsFunctionType>>
>;

export default function SeriesList({ onSelect }: SeriesListProps) {
  const [setData, setSetData] = useState<FetchSetReturnType>([]);
  useEffect(() => {
    seriesApi.getAll().then((data) => {
      if (data) {
        setSetData(data);
      }
    });
    // tcgdex.fetch("series").then((data) => {
    //   if (data) {
    //     console.log(data);
    //     const filteredData = data.filter(
    //       (series) => !series.name.toLowerCase().includes("pocket")
    //     );
    //     setSetData(filteredData.reverse());
    //   }
    // });
  }, [true]);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {setData.map((set) => (
        <SeriesListCard key={set.id} set={set} onSelect={onSelect} />
      ))}
    </Suspense>
  );
}
