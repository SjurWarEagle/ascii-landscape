import {CellStructure} from "./cell-structure";

export class CellUtils {
    public async convertToArray(cells: CellStructure[], height, width): Promise<string[][]> {
        let map = [];
        let row = [];

        for (let y = 0; y < height; y++) {
            row=[]
            for (let x = 0; x < width; x++) {
                const idx = x + y * width;
                //console.log(x,y,idx);
                if (!cells[idx].content) {
                    row.push('?')
                } else {
                    row.push(cells[idx].content);
                }
            }
            map.push(row);
        }

        return map;
    }

    public async convertToString(cells: CellStructure[], height, width): Promise<string> {
        let map = '';

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                const idx = x + y * width;
                //console.log(x,y,idx);
                if (!cells[idx].content) {
                    map += '?'
                } else {
                    map += cells[idx].content;
                }
            }
            map += '\n';
        }

        return map;
    }

    public async getNeighbours(sourceCell: CellStructure, cells: CellStructure[]): Promise<Set<CellStructure>> {
        const potentialNeighbours = new Set<CellStructure>();

        cells
            .filter(cell => {
                return (
                    (cell.position.x - 1 == sourceCell.position.x && cell.position.y == sourceCell.position.y)//left
                    || (cell.position.x + 1 == sourceCell.position.x && cell.position.y == sourceCell.position.y)//right
                    || (cell.position.x == sourceCell.position.x && cell.position.y - 1 == sourceCell.position.y)//top
                    || (cell.position.x == sourceCell.position.x && cell.position.y + 1 == sourceCell.position.y)//bottom
                )
            })
            .forEach(cell => potentialNeighbours.add(cell));
        return potentialNeighbours;
    }

    public async determineDirection(sourceCell: CellStructure, cell: CellStructure): Promise<string> {
        if ((cell.position.x < sourceCell.position.x) && (cell.position.y === sourceCell.position.y)) {
            return 'W';
        } else if ((cell.position.x > sourceCell.position.x) && (cell.position.y === sourceCell.position.y)) {
            return 'E';
        } else if ((cell.position.x === sourceCell.position.x) && (cell.position.y < sourceCell.position.y)) {
            return 'N';
        } else if ((cell.position.x === sourceCell.position.x) && (cell.position.y > sourceCell.position.y)) {
            return 'S';
        } else {
            return undefined;
        }
    }
}
