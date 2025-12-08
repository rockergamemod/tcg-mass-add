import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { TcgSet } from 'src/infra/database';
import { GameKey } from 'src/infra/database/types';

@Injectable()
export class SetService {
  constructor(
    @InjectRepository(TcgSet)
    private readonly tcgSetRepo: EntityRepository<TcgSet>,
  ) {}

  findAll(gameKey: GameKey, seriesId: number) {
    return this.tcgSetRepo.find(
      { game: { key: gameKey }, series: { id: seriesId } },
      { orderBy: { releaseDate: 'DESC' }, populate: ['game', 'series'] },
    );
  }

  findOne(gameKey: GameKey, seriesId: number, setId: number) {
    return this.tcgSetRepo.findOne(
      {
        game: { key: gameKey },
        series: { id: seriesId },
        id: setId,
      },
      {
        populate: ['cards', 'series'],
      },
    );
  }
}
