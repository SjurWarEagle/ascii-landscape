import {Injectable} from '@nestjs/common';
import {Chance} from 'chance';
import {Weather} from "./types/weather";
import {Culture} from "./types/culture";

@Injectable()
export class GenerateService {
    private readonly chance = new Chance();

    private readonly ROWS = 5;
    private readonly COLUMNS = 5;

    private readonly ICON_EMPTY = ' ';
    private readonly ICON_TREE_1 = '🌳';
    private readonly ICON_TREE_2 = '🌲';
    private readonly ICON_HILL_1 = '🏔';
    private readonly ICON_HILL_2 = '⛰';
    private readonly ICON_HOUSE_1 = '🏠';
    private readonly ICON_HOUSE_2 = '🏡';
    private readonly ICON_HOUSE_3 = '🏭';
    private readonly ICON_HOUSE_4 = '🎪';
    private readonly ICON_HOUSE_ASIAN_1 = '🏯';
    private readonly ICON_HOUSE_CASTLE_1 = '🏰';
    private readonly ICON_SKY_CLOUD = '☁';
    private readonly ICON_SKY_CLOUD_RAIN = '🌧';
    private readonly ICON_SKY_SUN_1 = '☀';
    private readonly ICON_SKY_SUN_RAIN = '🌦';
    private readonly ICON_SKY_SUN_3 = '⛅';

    generateNew(): string {
        let rc = '';
        const weather = this.generateWeather();
        const culture = this.generateCulture();
        rc += this.generateSkyLayerWithSun(this.COLUMNS, weather);
        for (let x = 0; x < 3; x++) {
            rc += this.generateSkyLayer(this.COLUMNS, weather);
        }
        rc += this.generateBuildingLayer(this.COLUMNS, culture);

        return this.mapToJson(rc);
    }

    private generateSkyLayerWithSun(cnt: number, weather: Weather): string {
        let rc = this.generateSkyLayer(cnt - 1, weather).replaceAll('\n', '');
        switch (weather) {
            case Weather.CLEAR:
                rc += this.ICON_EMPTY;
                break;
            case Weather.RAIN:
                rc += this.chance.weighted([this.ICON_SKY_CLOUD_RAIN, this.ICON_SKY_SUN_3, this.ICON_SKY_SUN_RAIN], [2, 1, 7]);
                break;
            case Weather.SUNNY:
                rc += this.chance.weighted([this.ICON_SKY_SUN_3, this.ICON_SKY_SUN_1, this.ICON_EMPTY], [2, 7, 1]);
                break;
            default:
                console.error('Not handled: ' + weather);
        }

        rc += '\n';
        return rc;
    }

    private generateSkyLayer(cnt: number, weather: Weather): string {
        let rc = '';
        for (let i = 0; i < cnt; i++) {
            switch (weather) {
                case Weather.CLEAR:
                    rc += this.chance.weighted([this.ICON_SKY_CLOUD, this.ICON_EMPTY], [2, 7]);
                    break;
                case Weather.SUNNY:
                    rc += this.chance.weighted([this.ICON_SKY_CLOUD, this.ICON_EMPTY], [1, 7]);
                    break;
                case Weather.RAIN:
                    rc += this.chance.weighted([this.ICON_SKY_CLOUD_RAIN, this.ICON_SKY_CLOUD, this.ICON_EMPTY], [3, 1, 7]);
                    break;
                default:
                    console.error('Not handled: ' + weather);
            }
        }

        rc += '\n';
        return rc;
    }

    private generateBuildingLayer(cnt: number, culture: Culture): string {
        let rc = '';
        for (let i = 0; i < cnt; i++) {
            switch (culture) {
                case Culture.MEDIVAL_ASIAN:
                    rc += this.chance.weighted([this.ICON_TREE_1, this.ICON_TREE_2, this.ICON_HOUSE_ASIAN_1, this.ICON_EMPTY], [5, 5, 2, 6]);
                    break;
                case Culture.MEDIVAL_EUROPE:
                    rc += this.chance.weighted([this.ICON_TREE_1, this.ICON_TREE_2, this.ICON_HOUSE_CASTLE_1, this.ICON_HOUSE_4, this.ICON_EMPTY], [5, 5, 2, 1, 2]);
                    break;
                case Culture.MODERN_EUROPE:
                    rc += this.chance.weighted([this.ICON_TREE_1, this.ICON_TREE_2, this.ICON_HOUSE_1, this.ICON_HOUSE_2, this.ICON_HOUSE_3, this.ICON_EMPTY], [5, 5, 2, 2, 1, 6]);
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

        const formattedReturn = String(rc).split('\n')
            .map(y => y.replaceAll('\n', ''))
            .filter(x => x.length > 0)
            .map(y => [...y])

        return {landscape: formattedReturn, rows: rows, asText: rc};

    }

    private generateCulture(): Culture {
        return this.chance.weighted([Culture.MEDIVAL_EUROPE, Culture.MEDIVAL_ASIAN, Culture.MODERN_EUROPE], [1, 1, 5]);
    }

    private generateWeather(): Weather {
        return this.chance.weighted([Weather.CLEAR, Weather.RAIN, Weather.SUNNY], [2, 1, 5]);
    }
}
