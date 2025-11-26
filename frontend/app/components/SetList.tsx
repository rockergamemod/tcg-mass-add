import { Suspense, useEffect, useState } from "react";
import tcgdex from "../utils/tcgdex";
import SetListCard from "./SetListCard";
import { SerieResume, SetResume } from "@tcgdex/sdk";

type SetListProps = {
  onSelect: (set: SetResume) => void;
  resetSeries: () => void;
  selectedSeries: SerieResume;
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
    tcgdex.fetchSets(selectedSeries.id).then((data) => {
      if (data) {
        console.log(data);
        setSetData(data.reverse());
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
