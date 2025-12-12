import { Module } from '@nestjs/common';
import { SeriesService } from './series.service';
import { SeriesController } from './series.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { TcgSeries } from '@tcgplayer-mass-add/shared-types';

@Module({
  imports: [MikroOrmModule.forFeature([TcgSeries])],
  controllers: [SeriesController],
  providers: [SeriesService],
})
export class SeriesModule {}
