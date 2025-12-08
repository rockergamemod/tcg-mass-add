import { Suspense, useEffect, useState } from "react";
import tcgdex from "../utils/tcgdex";
import SetListCard from "./SetListCard";
import { SerieResume, SetResume } from "@tcgdex/sdk";
import React from "react";
import { setApi } from "../utils/api";

type SetListProps = {
  onSelect: (set: SetResume) => void;
  resetSeries: () => void;
  selectedSeries: SerieResume & { gameKey: string };
};
type FetchSetsFunctionType = typeof tcgdex.fetchSets;
type FetchSetReturnType = NonNullable<
  Awaited<ReturnType<FetchSetsFunctionType>>
>;

export default function SetList({
  onSelect,
  selectedSeries,
  resetSeries,
}: SetListProps) {
  const [setData, setSetData] = useState<FetchSetReturnType>([]);
  useEffect(() => {
    console.log(selectedSeries);
    setApi.getAll(+selectedSeries.id).then((data) => {
      // tcgdex.fetchSets(selectedSeries.id).then((data) => {
      if (data) {
        console.log(data);
        setSetData(data);
      }
    });
  }, [selectedSeries]);
  return (
    <Suspense fallback={null}>
      <div className="flex ">
        <button onClick={resetSeries}>&#8592; Back</button>
      </div>
      {setData.map((set) => (
        <SetListCard key={set.id} set={set} onSelect={onSelect} />
      ))}
    </Suspense>
  );
}
