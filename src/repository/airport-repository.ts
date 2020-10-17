const csv = require('csv-parser');
const fs = require('fs');
import {Airport} from "../model/airport"

export class AirportRepository {

    private store: Map<number, Airport> = new Map<number, Airport>();

    getById(id: number) {
        return this.store.get(id)
    }

    getByIATA(iata: string) {
        return [...this.store.values()].find((x: Airport) => x.iata == iata)
    }

    getByICAO(icao: string) {
        return [...this.store.values()].find((x: Airport) => x.icao == icao)
    }

    getAll() {
        return [...this.store.values()]
    }

    loadCSV(file: string) {
        console.log('Starting to import file ' + file);
        let array = new Map<number, Airport>();
        fs.createReadStream(file)
            .pipe(csv([]))
            .on('data', (row: any) => {
                //console.log(row);
                array.set(Number(row['0']), new Airport(Number(row['0']),
                    row['1'], row['2'], row['3'], row['4'], row['5'],
                    Number(row['6']), Number(row['7']), Number(row['8']), Number(row['9']),
                    row['10'], row['11'], row['12'], row['13']))
            })
            .on('end', () => {
                console.log('CSV file ' + file + ' successfully processed');
            });

        this.store = array
    }
}