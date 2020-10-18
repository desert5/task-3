const csv = require('csv-parser');
const fs = require('fs');
import {Route} from "../model/route"

export class RouteRepository {

    private store: Array<Route> = new Array<Route>();

    getRoutes() {
        return this.store
    }

    loadCSV(file: string) {
        return new Promise((resolve, reject) => {
            console.log('Starting to import file ' + file)

            let array = new Array<Route>()
            fs.createReadStream(file)
                .pipe(csv([]))
                .on('data', (row: any) => {
                    //console.log(row);
                    array.push(new Route(
                        row['0'], Number(row['1']),
                        row['2'], Number(row['3']),
                        row['4'], Number(row['5']),
                        row['6'], Number(row['7']),
                        row['8']))
                })
                .on('end', () => {
                    this.store = array
                    resolve(true)

                    console.log('CSV file ' + file + ' successfully processed');
                })
        })
    }
}