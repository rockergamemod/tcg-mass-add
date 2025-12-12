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
  useEffect(() => {
    setApi.getAll(+selectedSeries.id).then((data) => {
      if (data) {
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
