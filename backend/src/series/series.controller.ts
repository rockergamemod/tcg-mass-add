import { Controller, Get, Param } from '@nestjs/common';
import { SeriesService } from './series.service';
import { GameKey } from '@tcgplayer-mass-add/shared-types';

@Controller()
export class SeriesController {
  constructor(private readonly pokemonSeriesService: SeriesService) {}

  @Get('/games/:gameKey/series')
  findAll(@Param('gameKey') gameKey: GameKey) {
    return this.pokemonSeriesService.findAll(gameKey);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pokemonSeriesService.findOne(+id);
  }
}
