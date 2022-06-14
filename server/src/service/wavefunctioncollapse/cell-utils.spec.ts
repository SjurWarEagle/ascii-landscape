import {WfcGenerator} from "./wfc-generator";
import {CellStructure} from "./cell-structure";
import {MappingDataStructure} from "../../types/mapping-data-structure";
import {CellUtils} from "./cell-utils";

describe("Cell Utils", () => {
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

    test("getNeighbours center", async () => {
        const wfcGenerator = new WfcGenerator();
        await wfcGenerator.initialize(3, 3, getTestMapping());
        expect(wfcGenerator).toBeDefined();

        const cellUtils = new CellUtils();
        const cellSource = new CellStructure({x: 1, y: 1}, ['A']);
        const neighbours = await cellUtils.getNeighbours(cellSource, wfcGenerator.cells);

        expect(neighbours).toBeDefined();
        expect(neighbours.size).toBe(4);
    });

    test("getNeighbours corner", async () => {
        const wfcGenerator = new WfcGenerator();
        await wfcGenerator.initialize(3, 3, getTestMapping());
        expect(wfcGenerator).toBeDefined();

        const cellUtils = new CellUtils();
        const cellSource = new CellStructure({x: 2, y: 2}, ['A']);
        const neighbours = await cellUtils.getNeighbours(cellSource, wfcGenerator.cells);

        expect(neighbours).toBeDefined();
        expect(neighbours.size).toBe(2);
    });

    test("direction W,E,N,S", async () => {

        const cellUtils = new CellUtils();

        const cellSource = new CellStructure({x: 2, y: 2}, ['A']);

        //west
        let cell = new CellStructure({x: 1, y: 2}, ['A']);
        let direction = await cellUtils.determineDirection(cellSource, cell);
        expect(direction).toBeDefined();
        expect(direction).toBe('W');

        //east
        cell = new CellStructure({x: 3, y: 2}, ['A']);
        direction = await cellUtils.determineDirection(cellSource, cell);
        expect(direction).toBeDefined();
        expect(direction).toBe('E');

        //north
        cell = new CellStructure({x: 2, y: 1}, ['A']);
        direction = await cellUtils.determineDirection(cellSource, cell);
        expect(direction).toBeDefined();
        expect(direction).toBe('N');

        //south
        cell = new CellStructure({x: 2, y: 3}, ['A']);
        direction = await cellUtils.determineDirection(cellSource, cell);
        expect(direction).toBeDefined();
        expect(direction).toBe('S');
    });

    test("direction invalid", async () => {

        const cellUtils = new CellUtils();

        const cellSource = new CellStructure({x: 2, y: 2}, ['A']);

        //west
        let cell = new CellStructure({x: 1, y: 1}, ['A']);
        let direction = await cellUtils.determineDirection(cellSource,cell);
        expect(direction).not.toBeDefined();

        //west
        cell = new CellStructure({x: 3, y: 3}, ['A']);
        direction = await cellUtils.determineDirection(cellSource, cell);
        expect(direction).not.toBeDefined();

        //west
        cell = new CellStructure({x: 1, y: 3}, ['A']);
        direction = await cellUtils.determineDirection(cellSource, cell);
        expect(direction).not.toBeDefined();

        //south
        cell = new CellStructure({x: 3, y: 1}, ['A']);
        direction = await cellUtils.determineDirection(cellSource, cell);
        expect(direction).not.toBeDefined();
    });
});
