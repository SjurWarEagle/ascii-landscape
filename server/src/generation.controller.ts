import { Controller, Get } from '@nestjs/common';
import { GenerateService } from './generate.service';

@Controller('/generate')
export class GenerationController {
  constructor(private readonly generateService: GenerateService) {}

  @Get('new')
  generateNewRandom(): string {
    return this.generateService.generateNew();
  }
}
