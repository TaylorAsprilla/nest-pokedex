import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,

    private readonly httpAdapter: AxiosAdapter,
  ) {}

  async executeSeed() {
    await this.pokemonModel.deleteMany({});

    const data: PokeResponse = await this.httpAdapter.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=650',
    );

    const pokemonToInsert: { name: string; no: number }[] = [];

    data.results.forEach(async ({ name, url }) => {
      const segments = url.split('/');
      const numberPokemon = +segments[segments.length - 2];

      pokemonToInsert.push({ name: name, no: numberPokemon });
    });

    this.pokemonModel.insertMany(pokemonToInsert);

    return 'Seed Executed';
  }

  async executeSeedPromise() {
    await this.pokemonModel.deleteMany({});

    const data: PokeResponse = await this.httpAdapter.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=650',
    );

    const insertPromiserArray = [];

    data.results.forEach(async ({ name, url }) => {
      const segments = url.split('/');
      const numberPokemon = segments[segments.length - 2];
      // await this.pokemonModel.create({
      //   no: numberPokemon,
      //   name: name,
      // });

      insertPromiserArray.push(
        this.pokemonModel.create({ no: numberPokemon, name: name }),
      );
    });

    await Promise.all(insertPromiserArray);

    return 'Seed Executed';
  }
}
