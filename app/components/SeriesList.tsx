import { Suspense, useEffect, useState } from "react";
import tcgdex from "../utils/tcgdex";
import SetListCard from "./SetListCard";

type SeriesListProps = {
  onSelect: (id: string) => void;
};
type FetchSetsFunctionType = typeof tcgdex.fetchSeries;
type FetchSetReturnType = NonNullable<
  Awaited<ReturnType<FetchSetsFunctionType>>
>;

export default function SeriesList({ onSelect }: SeriesListProps) {
  const [setData, setSetData] = useState<FetchSetReturnType>([]);
  useEffect(() => {
    tcgdex.fetch("series").then((data) => {
      if (data) {
        console.log(data);
        const filteredData = data.filter(
          (series) => !series.name.toLowerCase().includes("pocket")
        );
        setSetData(filteredData.reverse());
      }
    });
  }, [true]);
  return (
    <Suspense fallback={null}>
      {setData.map((set) => (
        <SetListCard key={set.id} set={set} onSelect={onSelect} />
      ))}
    </Suspense>
  );
}
