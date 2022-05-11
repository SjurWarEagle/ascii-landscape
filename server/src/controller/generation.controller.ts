import { Controller, Get } from '@nestjs/common';
import { LandscapeGenerateService } from '../service/landscape-generate.service';
import { MeadowGenerateService } from '../service/meadow-generate.service';
import { NaturalGenerateService } from '../service/natural-generate.service';
import { ContentTileFillingData } from '../service/content-tile-filling-data';

@Controller('/api/generate')
export class GenerationController {
  constructor(
    private readonly landscapeGenerateService: LandscapeGenerateService,
    private readonly maedowGenerateService: MeadowGenerateService,
    private readonly naturalGenerateService: NaturalGenerateService,
  ) {}

  @Get('meadow/newNatural')
  public generateNewNaturalFlowers(): string {
    return this.maedowGenerateService.generateNewNatural();
  }

  @Get('meadow/newRandom')
  public generateNewRandomFlowers(): string {
    return this.maedowGenerateService.generateNewRandom();
  }

  @Get('landscape/new')
  public generateNewRandomLandscape(): string {
    return this.landscapeGenerateService.generateNew();
  }

  @Get('continent/newRandom')
  public generateNewRandomContinent(): string {
    return this.naturalGenerateService.generateNewNaturalRandomTileSelection(
      new ContentTileFillingData(),
    );
  }
  @Get('continent/newColumns')
  public generateNewColumnsContinent(): string {
    return this.naturalGenerateService.generateNewNaturalColumnsTileSelection(
      new ContentTileFillingData(),
    );
  }
}
