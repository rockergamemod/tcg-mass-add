import { Suspense, useEffect, useState } from 'react';
import SetListCard from './SetListCard';
import React from 'react';
import { setApi } from '../utils/api';
import { type TcgSetDto, type TcgSeriesDto } from '@repo/shared-types';

type SetListProps = {
  onSelect: (set: TcgSetDto) => void;
  resetSeries: () => void;
  selectedSeries: TcgSeriesDto;
};

export default function SetList({
  onSelect,
  selectedSeries,
  resetSeries,
}: SetListProps) {
  const [setData, setSetData] = useState<TcgSetDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(true);
    setApi.getAll(+selectedSeries.id).then((data) => {
      if (data) {
        setSetData(data);
      }
      setIsLoading(false);
    });
  }, [selectedSeries]);
  return (
    <Suspense fallback={null}>
      <div className="flex ">
        <button onClick={resetSeries}>&#8592; Back</button>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-emerald-600 dark:border-zinc-800 dark:border-t-emerald-400"></div>
        </div>
      ) : (
        setData.map((set) => (
          <SetListCard key={set.id} set={set} onSelect={onSelect} />
        ))
      )}
    </Suspense>
  );
}
