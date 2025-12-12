import { Controller, Get, Param, Query } from '@nestjs/common';
import { CardService } from './card.service';
import { GameKey } from '@repo/shared-types';

@Controller()
export class CardController {
  constructor(private readonly pokemonCardService: CardService) {}

  @Get('/games/:gameKey/series/:seriesId/sets/:setId/cards')
  findAll(
    @Param('gameKey') gameKey: GameKey,
    @Param('seriesId') seriesId: number,
    @Param('setId') setId: number,
    @Query('limit') limit: number = 1000,
    @Query('page') page: number = 0,
  ) {
    return this.pokemonCardService.findAll(gameKey, seriesId, setId, {
      limit,
      page,
    });
  }

  @Get('/games/:gameKey/series/:seriesId/sets/:setId/cards/:cardId')
  findOne(
    @Param('gameKey') gameKey: GameKey,
    @Param('seriesId') seriesId: number,
    @Param('setId') setId: number,
    @Param('cardId') cardId: number,
  ) {
    return this.pokemonCardService.findOne(gameKey, seriesId, setId, cardId);
  }
}
