import {Module} from '@nestjs/common';
import {join} from 'path';
import {ServeStaticModule} from '@nestjs/serve-static';
import {MeadowGenerateService} from "./service/meadow-generate.service";
import {GenerationController} from "./controller/generation.controller";
import {LandscapeGenerateService} from "./service/landscape-generate.service";
import {AreaJsonService} from "./service/area-json.service";

@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '../', 'public'),
            exclude: [
                '/api*',
                '/generate*',
            ],
        }),
    ],
    controllers: [
        GenerationController,
    ],
    providers: [
        LandscapeGenerateService,
        MeadowGenerateService,
        AreaJsonService,
    ],
})
export class AppModule {
}
