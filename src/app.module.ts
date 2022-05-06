import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {GenerateService} from "./generate.service";
import {GenerationController} from "./generation.controller";

@Module({
    imports: [],
    controllers: [
        AppController,
        GenerationController,
    ],
    providers: [
        AppService,
        GenerateService,
    ],
})
export class AppModule {
}
