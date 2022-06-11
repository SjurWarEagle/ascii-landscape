import {Chance} from "chance";
import {Injectable} from "@nestjs/common";
import {CellStructure} from "./cell-structure";
import {MappingDataStructure} from "../../types/mapping-data-structure";
import {CellUtils} from "./cell-utils";

@Injectable()
export class WfcGenerator {
    private readonly chance = new Chance();
    public width: number = 10;
    public height: number = 10;
    private maxPossibilities = "";
    private mapping: MappingDataStructure[];
    public readonly cells: CellStructure[] = [];
    private readonly cellUtils: CellUtils = new CellUtils();

    constructor() {
    }

    public async initialize(width: number, height: number, maxPossibilities: string, mapping: MappingDataStructure[]): Promise<void> {
        this.mapping = mapping;
        this.width = width;
        this.height = height;
        this.maxPossibilities = maxPossibilities;
        await this.initCells(height, width);
    }


    public async decideCell(sourceCell: CellStructure): Promise<void> {
        sourceCell.content = this.chance.pickone(sourceCell.possibleContents);
        sourceCell.possibleContents = [...sourceCell.content];
    }

    public async completeCollapse(): Promise<void> {
        let iterationCnt = 0;
        let allCellsAreDefined = false;
        do {
            iterationCnt++;
            const sourceCell = await this.getNextCell();
            await this.decideCell(sourceCell);
            await this.collapseRecursive(sourceCell);
            if (iterationCnt > 1_000_000) {
                console.log('completeCollapse.iterationCnt', iterationCnt);
                throw new Error("completeCollapse too many iterations");
            }
            allCellsAreDefined = this.cells.filter(cell => cell.content === undefined).length === 0;
        } while (!allCellsAreDefined);
    }

    public async collapseRecursive(sourceCell: CellStructure): Promise<void> {
        let iterationCnt = 0;
        let changedCells = await this.collapseNeighbours(sourceCell);
        const nextRound = new Set<CellStructure>();

        do {
            iterationCnt++;
            nextRound.clear();
            // console.log('changedCell',changedCells.size);
            for (let cell of changedCells) {
                (await this.collapseNeighbours(cell)).forEach(newCell => {
                    nextRound.add(newCell);
                })
            }
            changedCells.clear();
            // console.log('nextRound', nextRound.size);
            nextRound.forEach(c => {
                changedCells.add(c);
            })
            if (iterationCnt > 10_000_000) {
                console.log('collapseRecursive.iterationCnt', iterationCnt);
                throw new Error("completeCollapse too many iterations");
            }
        } while (changedCells.size != 0);
    }

    public async collapseNeighbours(sourceCell: CellStructure): Promise<Set<CellStructure>> {
        const changedCells = new Set<CellStructure>();

        for (let cell of await this.cellUtils.getNeighbours(sourceCell, this.cells)) {
            if (cell.content!==undefined){
                continue;
            }
            const direction = await this.cellUtils.determineDirection(sourceCell, cell);
            const cellWasChanged = await this.collapseSingeCell(sourceCell, direction, cell);
            if (cellWasChanged) {
                changedCells.add(cell);
            }
        }

        return changedCells;

    }

    public async collapseSingeCell(sourceCell: CellStructure, targetDirection: string, targetCell: CellStructure): Promise<boolean> {
        if (targetCell.content !== undefined) {
            throw new Error('Cell already defined! ' + targetCell);
        }
        const candidates = new Set();
        let changeWasNeeded = false;

        sourceCell.possibleContents.forEach(s => {
            this.mapping.find(m => m.source == s).candidates.map(c => c.tile).forEach((t => {
                candidates.add(t);
            }))
        })

        // console.log("sourceCell.content", sourceCell.content);
        // console.log("candidates", candidates);
        // console.log("targetCell.possibleContents", targetCell.possibleContents);

        const candidatesToRemove = [];
        // now we know what is the maximum possible,
        // let's remove what is not possible from targetCell
        targetCell.possibleContents.forEach(t => {
            if ([...candidates].indexOf(t) !== -1) {
                candidatesToRemove.push(t);
            }
        });

        const updatedPossibleContents = targetCell.possibleContents.filter(pc => candidatesToRemove.indexOf(pc) !== -1);
        if (updatedPossibleContents.length === 0) {
            //FIXME EMERGENCY!
            console.error('sourceCell', sourceCell)
            console.error('targetCell', targetCell)
            updatedPossibleContents.push('#');
        }
        if (targetCell.possibleContents.length !== updatedPossibleContents.length) {
            targetCell.possibleContents = updatedPossibleContents;
            changeWasNeeded = true;
        } else {
            changeWasNeeded = false;
        }

        return changeWasNeeded;
        // console.log("candidatesToRemove", candidatesToRemove);
        // console.log("targetCell.possibleContents", targetCell.possibleContents);
    }

    private async getNextCell(): Promise<CellStructure> {
        let lowestCandidatesPossible = 99;
        this.cells
            .filter(cell => cell.content === undefined)
            .forEach(cell => {
                if (lowestCandidatesPossible > cell.possibleContents.length) {
                    lowestCandidatesPossible = cell.possibleContents.length
                }
            })

        const candidates = this.cells.filter(c => c.possibleContents.length === lowestCandidatesPossible);
        const picked = this.chance.integer({min: 0, max: candidates.length - 1});

        return candidates[picked];
    }

    private async initCells(height: number, width: number): Promise<void> {
        this.cells.splice(0);
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                this.cells.push(new CellStructure({x: x, y: y}, [...this.maxPossibilities]))
            }
        }
    }
}
