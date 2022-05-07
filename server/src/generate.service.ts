import {Injectable} from '@nestjs/common';
import {Chance} from 'chance';
import {Weather} from './types/weather';
import {Culture} from './types/culture';

@Injectable()
export class GenerateService {
    private readonly chance = new Chance();

    private readonly ROWS = 5;
    private readonly COLUMNS = 5;

    private readonly ICON_EMPTY = ' ';
    private readonly ICON_TREE_1 = '🌳';
    private readonly ICON_TREE_2 = '🌲';
    private readonly ICON_TREE_PALM = '🌴';
    private readonly ICON_TREE_CACTUS = '🌵';
    private readonly ICON_HILL_1 = '🏔';
    private readonly ICON_HILL_2 = '⛰';
    private readonly ICON_HOUSE_1 = '🏠';
    private readonly ICON_HOUSE_2 = '🏡';
    private readonly ICON_HOUSE_3 = '🏭';
    private readonly ICON_HOUSE_4 = '🎪';
    private readonly ICON_HOUSE_TENT = '🏕';
    private readonly ICON_HOUSE_ASIAN_1 = '🏯';
    private readonly ICON_HOUSE_CASTLE_1 = '🏰';
    private readonly ICON_SKY_CLOUD = '☁';
    private readonly ICON_SKY_CLOUD_RAIN = '🌧';
    private readonly ICON_SKY_SUN_1 = '☀';
    private readonly ICON_SKY_SUN_RAIN = '🌦';
    private readonly ICON_SKY_SUN_3 = '⛅';

    generateNew(): string {
        let rc = '';
        const culture = this.generateCulture();
        const weather = this.generateWeather(culture);

        rc += this.generateSkyLayerWithSun(weather);

        if (culture === Culture.DESERT) {
            rc += this.addSky(2, weather);
            for (let x = 0; x < this.COLUMNS - 2 - 2; x++) {
                rc += this.generateEmptyLayer();
            }
        } else {
            rc += this.addSky(3, weather);
        }
        rc += this.generateBuildingLayer(culture);

        return this.mapToJson(rc);
    }

    private addSky(depth: number, weather: Weather): string {
        let rc = '';
        for (let x = 0; x < depth; x++) {
            rc += this.generateSkyLayer(this.COLUMNS, weather);
        }
        return rc;
    }

    private generateSkyLayerWithSun(weather: Weather): string {
        let rc = this.generateSkyLayer(this.COLUMNS - 1, weather).replaceAll('\n', '');
        switch (weather) {
            case Weather.CLEAR:
                rc += this.ICON_EMPTY;
                break;
            case Weather.RAIN:
                rc += this.chance.weighted(
                    [
                        this.ICON_SKY_CLOUD_RAIN,
                        this.ICON_SKY_SUN_3,
                        this.ICON_SKY_SUN_RAIN,
                    ],
                    [2, 1, 7],
                );
                break;
            case Weather.SUNNY:
                rc += this.chance.weighted(
                    [this.ICON_SKY_SUN_3, this.ICON_SKY_SUN_1, this.ICON_EMPTY],
                    [2, 7, 1],
                );
                break;
            default:
                console.error('Not handled: ' + weather);
        }

        rc += '\n';
        return rc;
    }

    private generateEmptyLayer(): string {
        let rc = '';
        for (let i = 0; i < this.COLUMNS; i++) {
            rc += this.ICON_EMPTY;
        }
        rc += '\n';
        return rc;
    }

    private generateSkyLayer(cnt: number, weather: Weather): string {
        let rc = '';
        for (let i = 0; i < cnt; i++) {
            switch (weather) {
                case Weather.CLEAR:
                    rc += this.chance.weighted(
                        [this.ICON_SKY_CLOUD, this.ICON_EMPTY],
                        [2, 7],
                    );
                    break;
                case Weather.SUNNY:
                    rc += this.chance.weighted(
                        [this.ICON_SKY_CLOUD, this.ICON_EMPTY],
                        [1, 7],
                    );
                    break;
                case Weather.RAIN:
                    rc += this.chance.weighted(
                        [this.ICON_SKY_CLOUD_RAIN, this.ICON_SKY_CLOUD, this.ICON_EMPTY],
                        [3, 1, 7],
                    );
                    break;
                default:
                    console.error('Not handled: ' + weather);
            }
        }

        rc += '\n';
        return rc;
    }

    private generateBuildingLayer(culture: Culture): string {
        let rc = '';
        for (let i = 0; i < this.COLUMNS; i++) {
            switch (culture) {
                case Culture.DESERT:
                    rc += this.chance.weighted(
                        [
                            this.ICON_TREE_PALM,
                            this.ICON_TREE_CACTUS,
                            this.ICON_HOUSE_TENT,
                            this.ICON_EMPTY,
                        ],
                        [2, 2, 2, 4],
                    );
                    break;
                case Culture.MEDIVAL_ASIAN:
                    rc += this.chance.weighted(
                        [
                            this.ICON_TREE_1,
                            this.ICON_TREE_2,
                            this.ICON_HOUSE_ASIAN_1,
                            this.ICON_EMPTY,
                        ],
                        [5, 5, 2, 6],
                    );
                    break;
                case Culture.MEDIVAL_EUROPE:
                    rc += this.chance.weighted(
                        [
                            this.ICON_TREE_1,
                            this.ICON_TREE_2,
                            this.ICON_HOUSE_CASTLE_1,
                            this.ICON_HOUSE_4,
                            this.ICON_EMPTY,
                        ],
                        [5, 5, 2, 1, 2],
                    );
                    break;
                case Culture.MODERN_EUROPE:
                    rc += this.chance.weighted(
                        [
                            this.ICON_TREE_1,
                            this.ICON_TREE_2,
                            this.ICON_HOUSE_1,
                            this.ICON_HOUSE_2,
                            this.ICON_HOUSE_3,
                            this.ICON_EMPTY,
                        ],
                        [5, 5, 2, 2, 1, 6],
                    );
                    break;
                default:
                    console.error('Unknown culture:', culture);
            }
        }
        rc += '\n';

        return rc;
    }

    private mapToJson(rc: string): any {
        const rows = this.ROWS;

        const formattedReturn = String(rc)
            .split('\n')
            .map((y) => y.replaceAll('\n', ''))
            .filter((x) => x.length > 0)
            .map((y) => [...y]);

        return {landscape: formattedReturn, rows: rows, asText: rc};
    }

    private generateCulture(): Culture {
        return this.chance.weighted(
            [Culture.DESERT, Culture.MEDIVAL_EUROPE, Culture.MEDIVAL_ASIAN, Culture.MODERN_EUROPE],
            [1, 1, 1, 5],
        );
    }

    private generateWeather(culture: Culture): Weather {
        if (culture === Culture.DESERT) {
            return this.chance.weighted([Weather.CLEAR, Weather.SUNNY], [1, 5]);
        } else {
            return this.chance.weighted([Weather.CLEAR, Weather.RAIN, Weather.SUNNY], [2, 1, 5]);
        }
    }
}
