import {Injectable} from '@nestjs/common';
import {Chance} from 'chance';

@Injectable()
export class GenerateService {
    private readonly chance = new Chance();

    private readonly ICON_EMPTY = '  ';
    private readonly ICON_TREE_1 = '🌳';
    private readonly ICON_TREE_2 = '🌲';
    private readonly ICON_HOUSE_1 = '🏠';
    private readonly ICON_HOUSE_2 = '🏡';
    private readonly ICON_HOUSE_3 = '🏭';
    private readonly ICON_SKY_CLOUD = '☁';
    private readonly ICON_SKY_SUN_1 = '☀';
    private readonly ICON_SKY_SUN_2 = '🌥';
    private readonly ICON_SKY_SUN_3 = '🌥';

    generateNew(): string {
        let rc = '';
        rc += this.generateSkyLayerWithSun(5);
        for (let x = 0; x < 3; x++) {
            rc += this.generateSkyLayer(5);
        }
        rc += this.generateBuildingLayer(5);

        return this.wrapInHtml(rc);
    }

    private wrapInHtml(rc: string) {
        rc = rc.replaceAll('_', '&nbsp;');
        return (
            `<html lang="en">` +
            `<head>` +
            `<title>Landscape</title>` +
            `<style>body {  font-family: 'Courier New', monospace;} pre {  background-color: cornflowerblue;}</style>` +
            `</head>` +
            `<div style='display: inline-block'><pre>` +
            `${rc}` +
            `</pre></div>` +
            `</title>`
        );
    }

    private generateSkyLayerWithSun(cnt: number): string {
        let rc = this.generateSkyLayer(cnt - 1).replaceAll('\n', '');
        rc += this.chance.weighted([this.ICON_SKY_SUN_1, this.ICON_SKY_SUN_2, this.ICON_SKY_SUN_3, this.ICON_EMPTY], [2, 1, 1, 4]);
        rc += '\n';
        return rc;
    }

    private generateSkyLayer(cnt: number): string {
        let rc = '';
        for (let i = 0; i < cnt; i++) {
            rc += this.chance.weighted([this.ICON_SKY_CLOUD, this.ICON_EMPTY], [2, 7]);
        }

        rc += '\n';
        return rc;
    }

    private generateBuildingLayer(cnt: number): string {
        let rc = '';
        for (let i = 0; i < cnt; i++) {
            rc += this.chance.weighted([this.ICON_TREE_1, this.ICON_TREE_2, this.ICON_HOUSE_1, this.ICON_HOUSE_2, this.ICON_HOUSE_3, this.ICON_EMPTY], [3, 3, 1, 1, 1, 2]);
        }

        rc += '\n';
        return rc;
    }
}
