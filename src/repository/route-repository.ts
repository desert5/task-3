const parse = require('csv-parse')
const fs = require('fs').promises;
import {Route} from "../model/route"

export class RouteRepository {

    private readonly store: Array<Route>;

    constructor() {
        let dummyData = [
            new Route("2B", 410, "AER", 2965, "KZN", 2990, "", 0, "CR2"),
            new Route("2B", 410, "ASF", 2966, "KZN", 2990, "", 0, "CR2"),
            new Route("2B", 410, "ASF", 2966, "MRV", 2962, "", 0, "CR2"),
            new Route("2B", 410, "CEK", 2968, "KZN", 2990, "", 0, "CR2 "),
            new Route("2B", 410, "CEK", 2968, "OVB", 4078, "", 0, "CR2 "),
            new Route("2B", 410, "DME", 4029, "KZN", 2990, "", 0, "CR2 "),
            new Route("2B", 410, "DME", 4029, "NBC", 6969, "", 0, "CR2 "),
            new Route("2B", 410, "DME", 4029, "TGK", null, "", 0, "CR2 "),
            new Route("2B", 410, "DME", 4029, "UUA", 6160, "", 0, "CR2 "),
            new Route("2B", 410, "EGO", 6156, "KGD", 2952, "", 0, "CR2 "),
            new Route("2B", 410, "EGO", 6156, "KZN", 2990, "", 0, "CR2 "),
            new Route("2B", 410, "GYD", 2922, "NBC", 6969, "", 0, "CR2 "),
            new Route("2B", 410, "KGD", 2952, "EGO", 6156, "", 0, "CR2 "),
            new Route("2B", 410, "KZN", 2990, "AER", 2965, "", 0, "CR2 "),
            new Route("2B", 410, "KZN", 2990, "ASF", 2966, "", 0, "CR2 "),
            new Route("2B", 410, "KZN", 2990, "CEK", 2968, "", 0, "CR2 "),
            new Route("2B", 410, "KZN", 2990, "DME", 4029, "", 0, "CR2 "),
            new Route("2B", 410, "KZN", 2990, "EGO", 6156, "", 0, "CR2 "),
            new Route("2B", 410, "KZN", 2990, "LED", 2948, "", 0, "CR2 "),
            new Route("2B", 410, "KZN", 2990, "SVX", 2975, "", 0, "CR2 "),
            new Route("2B", 410, "LED", 2948, "KZN", 2990, "", 0, "CR2 "),
            new Route("2B", 410, "LED", 2948, "NBC", 6969, "", 0, "CR2 "),
            new Route("2B", 410, "LED", 2948, "UUA", 6160, "", 0, "CR2 "),
            new Route("2B", 410, "MRV", 2962, "ASF", 2966, "", 0, "CR2 "),
            new Route("2B", 410, "NBC", 6969, "DME", 4029, "", 0, "CR2 "),
            new Route("2B", 410, "NBC", 6969, "GYD", 2922, "", 0, "CR2 "),
            new Route("2B", 410, "NBC", 6969, "LED", 2948, "", 0, "CR2 "),
            new Route("2B", 410, "NBC", 6969, "SVX", 2975, "", 0, "CR2 "),
            new Route("2B", 410, "NJC", 2972, "SVX", 2975, "", 0, "CR2 "),
            new Route("2B", 410, "NJC", 2972, "UUA", 6160, "", 0, "CR2 "),
            new Route("2B", 410, "NUX", 4364, "SVX", 2975, "", 0, "CR2 "),
            new Route("2B", 410, "OVB", 4078, "CEK", 2968, "", 0, "CR2 "),
            new Route("2B", 410, "OVB", 4078, "SVX", 2975, "", 0, "CR2 "),
            new Route("2B", 410, "SVX", 2975, "KZN", 2990, "", 0, "CR2 "),
            new Route("2B", 410, "SVX", 2975, "NBC", 6969, "", 0, "CR2 "),
            new Route("2B", 410, "SVX", 2975, "NJC", 2972, "", 0, "CR2 "),
            new Route("2B", 410, "SVX", 2975, "NUX", 4364, "", 0, "CR2 "),
            new Route("2B", 410, "SVX", 2975, "OVB", 4078, "", 0, "CR2 "),
            new Route("2B", 410, "TGK", null, "DME", 4029, "", 0, "CR2 ")
        ]

        this.store = dummyData
    }

    getRoutes() {
        return this.store
    }

    /*
        fromCSV(file: string) {
            let rows: Array<Airport> = []
            const content = await fs.readFile(file)
            // Create the parser
            const parser = parse(content)
            // Use the readable stream api
            parser.on('readable', function(){
              let record
              while (record = parser.read()) {
                console.log(record)
                rows.push(new Airport(parseInt(record[0]), record[1], record[2], record[4], record[5]))
              }
            })
            // Catch any error
            parser.on('error', function(err: any){
              console.error(err.message)
            })
            // When we are done, test that the parsed output matched what expected
            parser.on('end', () => console.log("CSV import completed from " + file))
            // Close the readable stream
            parser.end()

            return rows
        }
    */
}