import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { PokemonModule } from 'src/pokemon/pokemon.module';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { CommonModule } from 'src/common/common.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [SeedController],
  providers: [SeedService, PokemonService],
  imports: [PokemonModule, CommonModule, ConfigModule],
})
export class SeedModule {}
