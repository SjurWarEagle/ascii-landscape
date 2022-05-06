import {Injectable} from '@nestjs/common';

@Injectable()
export class GenerateService {
    private readonly ICON_EMPTY = '  ';
    private readonly ICON_TREE_1 = '🌳';
    private readonly ICON_TREE_2 = '🌲';
    private readonly ICON_HOUSE_1 = '🏠';
    private readonly ICON_HOUSE_2 = '🏡';
    private readonly ICON_HOUSE_3 = '🏭';
    private readonly ICON_SKY_CLOUD = '☁';

    generateNew(): string {
        let rc = '';
        for (let x = 0; x < 4; x++) {
            rc += this.generateSkyLayer(5);
            rc += '\n';
        }
        rc += this.generateBuildingLayer(5);
        rc += '\n';

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

    private generateSkyLayer(cnt: number): string {
        let rc = '';
        for (let i = 0; i < cnt; i++) {
            const rnd = Math.random();
            if (rnd > 0.8) {
                rc += this.ICON_SKY_CLOUD;
            } else {
                rc += this.ICON_EMPTY;
            }
        }
        return rc;
    }

    private generateBuildingLayer(cnt: number): string {
        let rc = '';
        for (let i = 0; i < cnt; i++) {
            const rnd = Math.random();
            if (rnd > 0.8) {
                rc += this.ICON_TREE_1;
            } else if (rnd > 0.6) {
                rc += this.ICON_TREE_2;
            } else if (rnd > 0.3) {
                rc += this.ICON_HOUSE_1;
            } else if (rnd > 0.2) {
                rc += this.ICON_HOUSE_2;
            } else if (rnd > 0.1) {
                rc += this.ICON_HOUSE_3;
            } else {
                rc += this.ICON_EMPTY;
            }
        }
        return rc;
    }
}
