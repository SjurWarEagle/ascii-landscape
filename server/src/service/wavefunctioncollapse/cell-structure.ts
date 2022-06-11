export class CellStructure {
    public content: string = undefined;

    constructor(public position: { x: number, y: number }, public possibleContents: string[]) {

    }
}
