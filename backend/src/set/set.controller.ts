import { Controller, Get, Param } from '@nestjs/common';
import { SetService } from './set.service';
import { GameKey } from 'src/infra/database/types';

@Controller()
export class SetController {
  constructor(private readonly pokemonSetService: SetService) {}

  @Get('/games/:gameKey/series/:seriesId/sets')
  findAll(
    @Param('gameKey') gameKey: GameKey,
    @Param('seriesId') seriesId: number,
  ) {
    return this.pokemonSetService.findAll(gameKey, seriesId);
  }

  @Get('/games/:gameKey/series/:seriesId/sets/:setId')
  findOne(
    @Param('gameKey') gameKey: GameKey,
    @Param('seriesId') seriesId: number,
    @Param('setId') setId: number,
  ) {
    return this.pokemonSetService.findOne(gameKey, seriesId, setId);
  }
}
