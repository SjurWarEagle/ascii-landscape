import { Controller, Get } from '@nestjs/common';
import { LandscapeGenerateService } from '../service/landscape-generate.service';
import { MeadowGenerateService } from '../service/meadow-generate.service';

@Controller('/api/generate')
export class GenerationController {
  constructor(
    private readonly landscapeGenerateService: LandscapeGenerateService,
    private readonly maedowGenerateService: MeadowGenerateService,
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
}
