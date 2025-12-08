import { Module } from '@nestjs/common';
import { SetService } from './set.service';
import { SetController } from './set.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { TcgSet } from 'src/infra/database';

@Module({
  imports: [MikroOrmModule.forFeature([TcgSet])],
  controllers: [SetController],
  providers: [SetService],
})
export class SetModule {}
