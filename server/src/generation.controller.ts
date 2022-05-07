import { Controller, Get } from '@nestjs/common';
import { GenerateService } from './generate.service';

@Controller('/api/generate')
export class GenerationController {
  constructor(private readonly generateService: GenerateService) {}

  @Get('new')
  public generateNewRandom(): string {
    return this.generateService.generateNew();
  }
}
