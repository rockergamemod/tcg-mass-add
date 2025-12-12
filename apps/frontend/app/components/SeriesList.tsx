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
  useEffect(() => {
    seriesApi.getAll().then((data) => {
      if (data) {
        setSetData(data);
      }
    });
  }, [true]);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {setData.map((set) => (
        <SeriesListCard key={set.id} set={set} onSelect={onSelect} />
      ))}
    </Suspense>
  );
}
