import { Suspense, useEffect, useState } from 'react';
import SeriesListCard from './SeriesListCard';
import { seriesApi } from '../utils/api';
import React from 'react';
import { TcgSeriesDto } from '@repo/shared-types';

type SeriesListProps = {
  onSelect: (series: TcgSeriesDto) => void;
};

export default function SeriesList({ onSelect }: SeriesListProps) {
  const [setData, setSetData] = useState<TcgSeriesDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(true);
    seriesApi.getAll().then((data) => {
      if (data) {
        setSetData(data);
      }
      setIsLoading(false);
    });
  }, []);
  return (
    <Suspense fallback={null}>
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-emerald-600 dark:border-zinc-800 dark:border-t-emerald-400"></div>
        </div>
      ) : (
        setData.map((set) => (
          <SeriesListCard key={set.id} set={set} onSelect={onSelect} />
        ))
      )}
    </Suspense>
  );
}
