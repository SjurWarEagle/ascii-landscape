import {WfcGenerator} from "./wfc-generator";
import {CellStructure} from "./cell-structure";
import {MappingDataStructure} from "../../types/mapping-data-structure";
import {CellUtils} from "./cell-utils";
import {ContentTileFillingData} from "../content-tile-filling-data";

function getTestMapping(): MappingDataStructure[] {
    return [
        {
            source: '_',
            candidates: [
                {tile: 'A', weight: 1},
                {tile: '_', weight: 1},
            ],
        },
        {
            source: 'A',
            candidates: [
                {tile: '#', weight: 1},
                {tile: 'A', weight: 1},
                {tile: '_', weight: 1},
            ],
        },
        {
            source: '#',
            candidates: [
                {tile: '#', weight: 1},
                {tile: 'A', weight: 1},
            ],
        },

    ];
}

describe("Wave Function Collapse Generator", () => {
    test("Check initialization big map", async () => {
        const wfcGenerator = new WfcGenerator();
        await wfcGenerator.initialize(1000, 1000, getTestMapping());
        expect(wfcGenerator).toBeDefined();

        const cells = (wfcGenerator as any).cells;
        const size = cells.length
        expect(size).toBe(1000000);
    });

    test("Check initialization", async () => {
        const wfcGenerator = new WfcGenerator();
        await wfcGenerator.initialize(3, 3, getTestMapping());
        expect(wfcGenerator).toBeDefined();

        const cells = (wfcGenerator as any).cells;
        const size = cells.length
        expect(size).toBe(9);
        expect(cells[1].position.x).toBe(1);
        expect(cells[1].position.y).toBe(0);
    });

    test("Find first candidate", async () => {
        const wfcGenerator = new WfcGenerator();
        await wfcGenerator.initialize(3, 3, getTestMapping());
        expect(wfcGenerator).toBeDefined();

        const cell = await (wfcGenerator as any).getNextCell();

        expect(cell).toBeDefined();
        expect(cell.possibleContents.length).toBe(3);

    });

    test("Ensure reference is used", async () => {
        const wfcGenerator = new WfcGenerator();
        await wfcGenerator.initialize(3, 3, getTestMapping());
        expect(wfcGenerator).toBeDefined();

        const cell = await (wfcGenerator as any).getNextCell();
        const cells = (wfcGenerator as any).cells;

        let found = cells.filter(c => c.content === "GOTCHA");
        expect(found).toBeDefined();
        expect(found.length).toBe(0);

        expect(cell).toBeDefined();
        cell.content = "GOTCHA";
        found = cells.filter(c => c.content === "GOTCHA");
        expect(found).toBeDefined();
        expect(found.length).toBe(1);
        expect(found[0].position.x).toBe(cell.position.x);
        expect(found[0].position.y).toBe(cell.position.y);

    });

    test("Simple singe collapse", async () => {
        const wfcGenerator = new WfcGenerator();
        await wfcGenerator.initialize(3, 3, getTestMapping());
        expect(wfcGenerator).toBeDefined();

        const cellSource = new CellStructure({x: 0, y: 0}, ['_']);
        cellSource.content = '_';
        const cellTarget = new CellStructure({x: 1, y: 0}, ['#', 'A', '_']);
        await wfcGenerator.collapseSingeCell(cellSource, 'E', cellTarget);

        expect(cellSource.possibleContents.length).toBe(1);
        expect(cellTarget.possibleContents.length).toBe(2);
        expect(cellTarget.possibleContents.indexOf('A')).not.toBe(-1);
        expect(cellTarget.possibleContents.indexOf('_')).not.toBe(-1);
    });

    test("Simple singe collapse - all possible", async () => {
        const wfcGenerator = new WfcGenerator();
        await wfcGenerator.initialize(3, 3, getTestMapping());
        expect(wfcGenerator).toBeDefined();

        const cellSource = new CellStructure({x: 0, y: 0}, ['A']);
        cellSource.content = 'A';
        const cellTarget = new CellStructure({x: 1, y: 0}, ['#', 'A', '_']);
        await wfcGenerator.collapseSingeCell(cellSource, 'E', cellTarget);

        expect(cellSource.possibleContents.length).toBe(1);
        expect(cellTarget.possibleContents.length).toBe(3);
        expect(cellTarget.possibleContents.indexOf('#')).not.toBe(-1);
        expect(cellTarget.possibleContents.indexOf('A')).not.toBe(-1);
        expect(cellTarget.possibleContents.indexOf('_')).not.toBe(-1);
    });

    test("Simple singe collapse - check marker", async () => {
        const wfcGenerator = new WfcGenerator();
        await wfcGenerator.initialize(3, 3, getTestMapping());
        expect(wfcGenerator).toBeDefined();

        const cellSource = new CellStructure({x: 0, y: 0}, ['_']);
        cellSource.content = 'A';
        const cellTarget = new CellStructure({x: 1, y: 0}, ['#', 'A', '_']);
        const firstCollapse = await wfcGenerator.collapseSingeCell(cellSource, 'E', cellTarget);
        const secondCollapse = await wfcGenerator.collapseSingeCell(cellSource, 'E', cellTarget);

        expect(firstCollapse).toBeTruthy();
        expect(secondCollapse).toBeFalsy();
    });

    test("collapse recursive - simple", async () => {
        const wfcGenerator = new WfcGenerator();
        await wfcGenerator.initialize(3, 3, getTestMapping());
        expect(wfcGenerator).toBeDefined();

        const cellSource = wfcGenerator.cells.find(cell => cell.position.x === 0 && cell.position.y === 0);
        cellSource.possibleContents = ['_'];
        cellSource.content = '_';
        await wfcGenerator.collapseRecursive(cellSource);

        //first check cell we started with
        const cell1 = wfcGenerator.cells.find(cell => cell.position.x === 0 && cell.position.y === 0);
        expect(cell1).toBeDefined();
        expect(cell1.content).toBe('_');
        expect(cell1.possibleContents.length).toBe(1);
        expect(cell1.possibleContents).toStrictEqual(['_']);
        //East
        const cellE = wfcGenerator.cells.find(cell => cell.position.x === 1 && cell.position.y === 0);
        expect(cellE).toBeDefined();
        expect(cellE.content).toBeUndefined();
        expect(cellE.possibleContents.length).toBe(2);
        expect(cellE.possibleContents).toStrictEqual(['A', '_']);
        //South
        const cellS = wfcGenerator.cells.find(cell => cell.position.x === 0 && cell.position.y === 1);
        expect(cellS).toBeDefined();
        expect(cellS.content).toBeUndefined();
        expect(cellS.possibleContents.length).toBe(2);
        expect(cellS.possibleContents).toStrictEqual(['A', '_']);
    });

    test("complete collapse - 10x10 without initial cell - real world data", async () => {
        const cellUtils = new CellUtils();

        const wfcGenerator = new WfcGenerator();
        await wfcGenerator.initialize(30, 30, new ContentTileFillingData().mapping.data);
        await wfcGenerator.completeCollapse();

        const map = await cellUtils.convertToString(wfcGenerator.cells, wfcGenerator.height, wfcGenerator.width);
        console.log('\n' + map);
    });

    test("complete collapse - 10x10 without initial cell", async () => {
        const cellUtils = new CellUtils();

        const wfcGenerator = new WfcGenerator();
        await wfcGenerator.initialize(10, 10, getTestMapping());
        await wfcGenerator.completeCollapse();

        const map = await cellUtils.convertToString(wfcGenerator.cells, wfcGenerator.height, wfcGenerator.width);
        console.log('\n' + map);
    });

    test("complete collapse - small 3x3", async () => {
        const cellUtils = new CellUtils();

        const wfcGenerator = new WfcGenerator();
        await wfcGenerator.initialize(3, 3, getTestMapping());

        const cellSource = wfcGenerator.cells.find(cell => cell.position.x === 1 && cell.position.y === 1);
        cellSource.possibleContents = ['_'];
        cellSource.content = '_';
        await wfcGenerator.completeCollapse();
        // await wfcGenerator.collapseRecursive(cellSource);

        // console.log(wfcGenerator.cells);
        const map = await cellUtils.convertToString(wfcGenerator.cells, wfcGenerator.height, wfcGenerator.width);
        console.log('\n' + map);
    });

    test("complete collapse - bigger 10x10", async () => {
        //this test is not really testing something, it's more about "does it crash?"
        const cellUtils = new CellUtils();

        const wfcGenerator = new WfcGenerator();
        await wfcGenerator.initialize(10, 10, getTestMapping());

        const cellSource = wfcGenerator.cells.find(cell => cell.position.x === 1 && cell.position.y === 1);
        cellSource.possibleContents = ['_'];
        cellSource.content = '_';
        await wfcGenerator.completeCollapse();
        // await wfcGenerator.collapseRecursive(cellSource);

        // console.log(wfcGenerator.cells);
        const map = await cellUtils.convertToString(wfcGenerator.cells, wfcGenerator.height, wfcGenerator.width);
        console.log('\n' + map);
    });
    test("complete collapse - bigger nonsquare 2x20(20x2", async () => {
        //this test is not really testing something, it's more about "does it crash?"
        const cellUtils = new CellUtils();

        const wfcGenerator = new WfcGenerator();
        await wfcGenerator.initialize(2, 2, getTestMapping());
        await wfcGenerator.initialize(20, 20, getTestMapping());

        const cellSource = wfcGenerator.cells.find(cell => cell.position.x === 1 && cell.position.y === 1);
        cellSource.possibleContents = ['_'];
        cellSource.content = '_';
        await wfcGenerator.completeCollapse();
        // await wfcGenerator.collapseRecursive(cellSource);

        // console.log(wfcGenerator.cells);
        const map = await cellUtils.convertToString(wfcGenerator.cells, wfcGenerator.height, wfcGenerator.width);
        console.log('\n' + map);
    });

    test("complete collapse - huge 100x100", async () => {
        //this test is not really testing something, it's more about "does it crash?"
        const cellUtils = new CellUtils();

        const wfcGenerator = new WfcGenerator();
        await wfcGenerator.initialize(100, 100, getTestMapping());

        const cellSource = wfcGenerator.cells.find(cell => cell.position.x === 1 && cell.position.y === 1);
        cellSource.possibleContents = ['_'];
        cellSource.content = '_';
        await wfcGenerator.completeCollapse();
        // await wfcGenerator.collapseRecursive(cellSource);

        // console.log(wfcGenerator.cells);
        const map = await cellUtils.convertToString(wfcGenerator.cells, wfcGenerator.height, wfcGenerator.width);
        console.log('\n' + map);
    });

    test("initialize - data filling", async () => {
        const wfcGenerator = new WfcGenerator();
        await wfcGenerator.initialize(3, 3, getTestMapping());
        expect(wfcGenerator).toBeDefined();
        expect((wfcGenerator as any).maxPossibilities).toBeDefined();
        expect((wfcGenerator as any).maxPossibilities.length).toBe(3);
        expect((wfcGenerator as any).maxPossibilities.indexOf('_')).not.toBe(-1);
        expect((wfcGenerator as any).maxPossibilities.indexOf('A')).not.toBe(-1);
        expect((wfcGenerator as any).maxPossibilities.indexOf('#')).not.toBe(-1);

    });

});
