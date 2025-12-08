import { Module } from '@nestjs/common';
import { SeriesService } from './series.service';
import { SeriesController } from './series.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { TcgSeries } from 'src/infra/database/tcg-series.entity';

@Module({
  imports: [MikroOrmModule.forFeature([TcgSeries])],
  controllers: [SeriesController],
  providers: [SeriesService],
})
export class SeriesModule {}
