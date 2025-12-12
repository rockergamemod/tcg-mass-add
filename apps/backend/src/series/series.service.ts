import { Injectable } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/postgresql';
import { TcgSeries, GameKey } from '@repo/shared-types';
import { InjectRepository } from '@mikro-orm/nestjs';

@Injectable()
export class SeriesService {
  constructor(
    @InjectRepository(TcgSeries)
    private readonly pokemonSeriesRepo: EntityRepository<TcgSeries>,
  ) {}

  findAll(gameKey: GameKey) {
    return this.pokemonSeriesRepo.find(
      { game: { key: gameKey }, isHidden: false },
      { orderBy: { releaseDate: 'DESC' }, populate: ['game', 'sets'] },
    );
  }

  findOne(id: number) {
    return `This action returns a #${id} pokemonSery`;
  }
}
