import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { TcgCard } from '@repo/shared-types';

@Module({
  imports: [MikroOrmModule.forFeature([TcgCard])],
  controllers: [CardController],
  providers: [CardService],
})
export class CardModule {}
