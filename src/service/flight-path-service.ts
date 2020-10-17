import {FlightPath} from "../model/flight-path"
import {AirportRepository} from "../repository/airport-repository";
import {RouteRepository} from "../repository/route-repository";
import {Airport} from "../model/airport";
import {IllegalArgumentException} from "../exception/illegal-argument-exception";
import {UnableToComputeException} from "../exception/unable-to-compute";

const Graph = require('node-dijkstra')

export class FlightPathService {

    private graph: any = {};

    constructor(
        private readonly airportRepository: AirportRepository,
        private readonly routeRepository: RouteRepository
    ) {
    }

    computeRouteGraph() {
        let data = this.prepareData();
        this.graph = new Graph(data)
        console.log("Graph computed, node count " + this.graph.graph.size)
    }

    computePath(from: string, to: string) {
        console.log("We are flying from " + from + " to " + to)

        let source = this.getAirportByCode(from);
        let dest = this.getAirportByCode(to);
        let result = this.graph.path(source.id.toString(), dest.id.toString(), {cost: true});
        if (!result.path) {
            throw new UnableToComputeException("No path between requested airports")
        } else if (this.calculateFlightsNumber(result.path) > 4) {
            throw new UnableToComputeException("Too many flights to destination, max 4, calculated " + this.calculateFlightsNumber(result.path))
        } else {
            return new FlightPath(result.path, result.cost);
        }
    }

    private prepareData() {
        let result: any = {}

        this.routeRepository.getRoutes().reduce((map, current, index, array) => {
            let source = current.sourceAirportId;
            let dest = current.destinationAirportId;
            map.has(source) ? map.get(source).add(dest) : map.set(source, new Set([dest]))
            return map

        }, new Map<number, Set<number>>())
            .forEach((value, key, map) => {
                let connections: any = {}
                let source = this.airportRepository.getById(key)
                value.forEach((neighbourId) => {
                    connections[neighbourId.toString()] = this.calculateDistance(source, this.airportRepository.getById(neighbourId))
                })
                result[source.id.toString()] = connections
            })
        return result;
    }

    private getAirportByCode(code: string) {
        if (!code) {
            throw new IllegalArgumentException("airport-code", code);
        } else if (code.length == 3) {
            return this.airportRepository.getByIATA(code);
        } else if (code.length == 4) {
            return this.airportRepository.getByICAO(code);
        } else {
            throw new IllegalArgumentException("airport-code", code);
        }
    }

    private calculateDistance(source: Airport, destination: Airport) {
        return 1
    }

    private calculateFlightsNumber(path: []) {
        return 1
    }
}