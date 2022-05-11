import {Injectable} from '@nestjs/common';
import {Chance} from 'chance';
import {AreaJsonService} from './area-json.service';
import {ContentTileFillingData} from "./content-tile-filling-data";

@Injectable()
export class NaturalGenerateService {
    private readonly chance = new Chance();

    private readonly ROWS = 30;
    private readonly COLUMNS = 30;

    private readonly ICON_EMPTY = ' ';

    constructor(protected areaJsonService: AreaJsonService) {
    }

    private generateEmptyArea(): string[][] {
        const area = [];
        for (let i = 0; i < this.ROWS; i++) {
            const row = [];
            for (let c = 0; c < this.COLUMNS; c++) {
                row.push(this.ICON_EMPTY);
            }
            area.push(row);
        }
        return area;
    }

    public generateNewNaturalRandomTileSelection(mappings: ContentTileFillingData): string {
        const area = this.generateEmptyArea();
        this.fillNaturalRandomTileSelection(mappings, area);
        return this.areaJsonService.mapToJson(
            area.map((x) => x.join('')).join(''),
            this.ROWS,
        );
    }

    public generateNewNaturalColumnsTileSelection(mappings: ContentTileFillingData): string {
        const area = this.generateEmptyArea();
        this.fillNaturalColumnsTileSelection(mappings, area);
        return this.areaJsonService.mapToJson(
            area.map((x) => x.join('')).join(''),
            this.ROWS,
        );
    }

    private fillNaturalColumnsTileSelection(mappings: ContentTileFillingData, area: string[][]): void {
        area[0][0] = this.getInitialTile(mappings);
        let sourceTile = area[0][0];
        for (let x = 0; x < this.COLUMNS; x++) {
            for (let y = 0; y < this.ROWS; y++) {
                this.fillNaturallyIfEmpty(mappings, area, sourceTile, x, y);
                sourceTile = area[x][y];
            }
        }
    }

    private fillNaturalRandomTileSelection(mappings: ContentTileFillingData, area: string[][]): void {
        const rc = this.pickRandomSpot();
        area[rc.x][rc.y] = this.getInitialTile(mappings);
        while (this.hasEmptySpots(area)) {
            const pos = this.pickRandomSpot();
            if (area[pos.x][pos.y] !== this.ICON_EMPTY) {
                const sourceTile = area[pos.x][pos.y];
                this.fillNaturallyIfEmpty(mappings, area, sourceTile, pos.x + 1, pos.y);
                this.fillNaturallyIfEmpty(mappings, area, sourceTile, pos.x, pos.y + 1);
                this.fillNaturallyIfEmpty(mappings, area, sourceTile, pos.x - 1, pos.y);
                this.fillNaturallyIfEmpty(mappings, area, sourceTile, pos.x, pos.y - 1);
            }
        }
    }

    private getCandidateToFillAdjacentTile(sourceTile: string, mappings: ContentTileFillingData): string {
        let rc = '';
        const candidate = mappings.mapping.data.find(mapping => mapping.source === sourceTile);
        if (!candidate) {
            console.error('No mapping found "' + sourceTile + '"');
            return this.ICON_EMPTY;
        }
        const tiles: string[] = [];
        const weights: number[] = [];
        candidate.candidates.forEach(c => {
            tiles.push(c.tile);
            weights.push(c.weight);
        });

        rc = this.chance.weighted(tiles, weights);
        return rc;
    }

    private getInitialTile(mappings: ContentTileFillingData): string {
        const tmp = [];
        mappings.mapping.data.forEach(c => {
            tmp.push(c.source);
        })
        // console.log(tmp);
        const rnd = this.chance.integer({min: 0, max: tmp.length - 1});
        return tmp[rnd];
    }

    private hasEmptySpots(area: string[][]): boolean {
        return (
            area
                .map((x) => x.join(''))
                .join('')
                .indexOf(this.ICON_EMPTY) !== -1
        );
    }

    private pickRandomSpot(): { x: number; y: number } {
        const x = this.chance.integer({min: 0, max: this.COLUMNS - 1});
        const y = this.chance.integer({min: 0, max: this.ROWS - 1});
        return {x: x, y: y};
    }

    private fillNaturallyIfEmpty(
        mappings: ContentTileFillingData,
        area: string[][],
        sourceTile: string,
        x: number,
        y: number,
    ) {
        if (x > this.COLUMNS - 1 || x < 0) {
            return;
        }
        if (y > this.COLUMNS - 1 || y < 0) {
            return;
        }
        if (area[x][y] !== this.ICON_EMPTY) {
            return;
        }
        area[x][y] = this.getCandidateToFillAdjacentTile(sourceTile, mappings);
    }
}
