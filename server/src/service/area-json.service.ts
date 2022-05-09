import {Injectable} from '@nestjs/common';

@Injectable()
export class AreaJsonService {

    public mapToJson(rc: string, rows:number): any {

        const areaAsLongArray = String(rc)
            .split('\n')
            .map((y) => y.replaceAll('\n', ''))
            .filter((x) => x.length > 0)
            .map((y) => [...y]);

        let text = '';

        areaAsLongArray.forEach(line => {
            text += line.join('');
            text += '\n';
        })

        // for (const entry of areaAsLongArray) {
        //     text += entry;
        //     cntProcessed++;
        //     if (cntProcessed >= this.COLUMNS) {
        //         cntProcessed = 0;
        //         text += '\n';
        //     }
        // }
        return {area: areaAsLongArray, rows: rows, asText: text};
    }

}
