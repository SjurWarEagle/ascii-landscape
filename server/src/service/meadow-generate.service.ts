import {Injectable} from '@nestjs/common';
import {Chance} from 'chance';
import {AreaJsonService} from "./area-json.service";

@Injectable()
export class MeadowGenerateService {
    private readonly chance = new Chance();

    private readonly ROWS = 40;
    private readonly COLUMNS = 40;

    private readonly ICON_EMPTY = '\u2003';
    private readonly ICON_FLOWER_1 = '🌷';
    private readonly ICON_FLOWER_2 = '🌸';
    private readonly ICON_FLOWER_3 = '🌹';
    private readonly ICON_FLOWER_4 = '🌺';
    private readonly ICON_FLOWER_5 = '🌻';
    private readonly ICON_FLOWER_6 = '🌼';
    private readonly ICON_FLOWER_7 = '🥀';
    private readonly ICON_FLOWER_8 = '🌱';
    private readonly ICON_FLOWER_9 = '🌿';
    private readonly ICON_FLOWER_GLOWER_4 = '🍀';
    private readonly ICON_FLOWER_GLOWER_3 = '☘';

    constructor(private areaJsonService: AreaJsonService) {
    }

    private generateEmptyMeadow(): string[][] {
        let area = [];
        for (let i = 0; i < this.ROWS; i++) {
            let row = [];
            for (let c = 0; c < this.COLUMNS; c++) {
                row.push(this.ICON_EMPTY);
            }
            area.push(row);
        }
        return area;
    }

    public generateNewNatural(): string {
        let area = this.generateEmptyMeadow();
        this.fillNatural(area);
        return this.areaJsonService.mapToJson(area.map(x => x.join('')).join(''), this.ROWS);
    }

    public generateNewRandom(): string {
        let rc = '';
        for (let i = 0; i < this.COLUMNS; i++) {
            rc += this.generateRandomMeadowLayer();
        }
        return this.areaJsonService.mapToJson(rc, this.ROWS);
    }

    private generateRandomMeadowLayer(): string {
        let rc = '';
        for (let i = 0; i < this.COLUMNS; i++) {
            rc += this.chance.weighted(
                [
                    this.ICON_FLOWER_1,
                    this.ICON_FLOWER_2,
                    this.ICON_FLOWER_3,
                    this.ICON_FLOWER_4,
                    this.ICON_FLOWER_5,
                    this.ICON_FLOWER_6,
                    this.ICON_FLOWER_7,
                    this.ICON_FLOWER_7,
                    this.ICON_FLOWER_8,
                    this.ICON_FLOWER_GLOWER_3,
                    this.ICON_FLOWER_GLOWER_4,
                    // this.ICON_EMPTY,
                ],
                [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
            );
        }
        rc += '\n';

        return rc;
    }

    private fillNatural(area: string[][]): void {
        const rc = this.pickRandomSpot();
        area[rc.x][rc.y] = this.getInitialFlower();
        while (this.hasEmptySpots(area)) {
            const pos = this.pickRandomSpot();
            if (area[pos.x][pos.y] !== this.ICON_EMPTY) {
                const sourceFlower = area[pos.x][pos.y];
                this.fillNaturallyIfEmpty(area, sourceFlower, pos.x + 1, pos.y);
                this.fillNaturallyIfEmpty(area, sourceFlower, pos.x, pos.y + 1);
                this.fillNaturallyIfEmpty(area, sourceFlower, pos.x - 1, pos.y);
                this.fillNaturallyIfEmpty(area, sourceFlower, pos.x, pos.y - 1);
                // area[pos.x][pos.y] = this.getInitialFlower();
            }
        }
    }

    private getAdjacentFlower(sourceFlower: string): string {
        let rc = this.ICON_FLOWER_1;

        switch (sourceFlower) {
            case this.ICON_FLOWER_1:
                rc = this.chance.weighted([this.ICON_FLOWER_1, this.ICON_FLOWER_3, this.ICON_FLOWER_5], [3, 2, 1])
                break;
            case this.ICON_FLOWER_2:
                break;
            case this.ICON_FLOWER_3:
                rc = this.chance.weighted([this.ICON_FLOWER_3, this.ICON_FLOWER_1, this.ICON_FLOWER_5, this.ICON_FLOWER_7], [3, 2,1, 2])
                break;
            case this.ICON_FLOWER_4:
                break;
            case this.ICON_FLOWER_5:
                rc = this.chance.weighted([this.ICON_FLOWER_5, this.ICON_FLOWER_3, this.ICON_FLOWER_1], [3, 2, 2])
                break;
            case this.ICON_FLOWER_6:
                break;
            case this.ICON_FLOWER_7:
                rc = this.chance.weighted([this.ICON_FLOWER_7, this.ICON_FLOWER_3, this.ICON_FLOWER_GLOWER_3], [3, 2, 1])
                break;
            case this.ICON_FLOWER_8:
                rc = this.chance.weighted([this.ICON_FLOWER_8, this.ICON_FLOWER_9], [3, 2])
                break;
            case this.ICON_FLOWER_9:
                rc = this.chance.weighted([this.ICON_FLOWER_9, this.ICON_FLOWER_8], [3,2])
                break;
            case this.ICON_FLOWER_GLOWER_3:
                rc = this.chance.weighted([this.ICON_FLOWER_GLOWER_3, this.ICON_FLOWER_GLOWER_4, this.ICON_FLOWER_7], [3, 1, 1])
                break;
            case this.ICON_FLOWER_GLOWER_4:
                rc = this.chance.weighted([this.ICON_FLOWER_GLOWER_3, this.ICON_FLOWER_GLOWER_4], [5, 1])
                break;
            default:
                console.error('Unknown source flower:' + sourceFlower);
        }
        return rc;
    }

    private getInitialFlower(): string {
        return this.ICON_FLOWER_1;
    }

    private hasEmptySpots(area: string[][]): boolean {
        return area.map(x => x.join('')).join('').indexOf(this.ICON_EMPTY) !== -1;
    }

    private pickRandomSpot(): { x: number, y: number } {
        const x = this.chance.integer({min: 0, max: this.COLUMNS - 1});
        const y = this.chance.integer({min: 0, max: this.ROWS - 1});
        return {x: x, y: y};
    }

    private fillNaturallyIfEmpty(area: string[][], sourceFlower: string, x: number, y: number) {
        if ((x > this.COLUMNS - 1) || x < 0) {
            return;
        }
        if ((y > this.COLUMNS - 1) || y < 0) {
            return;
        }
        if (area[x][y] !== this.ICON_EMPTY) {
            return;
        }
        area[x][y] = this.getAdjacentFlower(sourceFlower);
    }
}
