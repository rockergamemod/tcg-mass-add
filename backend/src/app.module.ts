import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PokemonCardModule } from './pokemon-card/pokemon-card.module';
import { PokemonSetModule } from './pokemon-set/pokemon-set.module';
import { PokemonSeriesModule } from './pokemon-series/pokemon-series.module';
// import { DatabaseModule } from './database/database.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import config from './mikro-orm.config';

@Module({
  imports: [
    MikroOrmModule.forRoot(config),
    PokemonCardModule,
    PokemonSetModule,
    PokemonSeriesModule,
    // DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
