import {FlightPath} from "../model/flight-path"
import {AirportRepository} from "../repository/airport-repository";
import {RouteRepository} from "../repository/route-repository";
import {Airport} from "../model/airport";

const Graph = require('node-dijkstra')

export class FlightPathService {

    constructor(
        private readonly airportRepository: AirportRepository,
        private readonly routeRepository: RouteRepository
    ) {
    }

    computeRouteGraph() {
        let data = this.prepareData();
        const route = new Graph(data)
        console.log("node count is " + route.graph.size)
    }

    computePath(from: string, to: string) {
        return new FlightPath("We are flying from " + from + " to " + to);
    }

    private prepareData() {
        type Map = { [index: number]: Set<number> }

        let neighbours:Map = this.routeRepository.getRoutes().reduce((map, current, index, array): Map => {
            map.hasOwnProperty(current.sourceAirportId)
                ? map[current.sourceAirportId] = new Set([current.destinationAirportId])
                : map[current.sourceAirportId].add(current.destinationAirportId)
            return map
        }, {} as Map);

        let result: any = {}
        for (let key in neighbours) {
            let connections: any = {}
            let source = this.airportRepository.getById(Number(key))
            neighbours[key].forEach((value) => {
                connections[value.toString()] = this.calculateDistance(source, this.airportRepository.getById(value))
            })
            result[source.id.toString()] = connections
        }

        return result;
    }

    private calculateDistance(source: Airport, destination: Airport) {
        return 1;
    }
}