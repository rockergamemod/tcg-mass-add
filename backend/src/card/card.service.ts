import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, Populate } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { TcgCard } from 'src/infra/database';
import { CardSourceType, GameKey } from 'src/infra/database/types';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(TcgCard) private cardRepo: EntityRepository<TcgCard>,
  ) {}

  async findAll(
    gameKey: GameKey,
    seriesId: number,
    setId: number,
    options: { page: number; limit: number } = {
      page: 0,
      limit: 1000,
    },
  ) {
    const queryOptions = {
      limit: options.limit,
      offset: options.limit * options.page,
    };

    const cards = await this.cardRepo.find(
      { set: { id: setId, game: { key: gameKey }, series: { id: seriesId } } },
      {
        fields: [
          '*',
          'printings.*',
          'printings.source.id',
          'set.*',
          'sources.sourceName',
          'sources.sourceSetCode',
        ],
        populate: ['printings', 'set', 'sources'],
        populateWhere: {
          sources: {
            source: CardSourceType.Tcgplayer,
          },
        },
        orderBy: {
          collectorNumber: 'ASC',
        },
        ...queryOptions,
      },
    );
    return cards;
  }

  findOne(gameKey: GameKey, seriesId: number, setId: number, cardId: number) {
    return this.cardRepo.findOne(cardId, {
      populate: ['printings', 'set'],
    });
  }
}
