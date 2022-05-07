import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GenerateService } from './generate.service';
import { GenerationController } from './generation.controller';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../', 'public'),
      exclude: ['/api*', '/generate*'],
    }),
  ],
  controllers: [AppController, GenerationController],
  providers: [AppService, GenerateService],
})
export class AppModule {}
