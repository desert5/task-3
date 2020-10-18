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
        console.log("Started graph computation")

        let data = this.prepareData();

        console.log("Prepared " + Object.keys(data).length + " nodes")

        this.graph = new Graph(data)

        console.log("Graph computed, node count " + this.graph.graph.size)
    }

    computePath(from: string, to: string) {
        console.log("We are flying from " + from + " to " + to)

        let source = this.getAirportByCode(from);
        let dest = this.getAirportByCode(to);
        let result = this.graph.path(source.id.toString(), dest.id.toString(), {cost: true});

        let legs = this.calculateFlightsNumber(result.path);


        if (!result.path) {
            throw new UnableToComputeException("No path between requested airports")
        } else {
            if (legs > 4) {
                throw new UnableToComputeException("Too many flights to destination, max 4, calculated " + legs)
            } else {
                return new FlightPath(result.path, result.cost);
            }
        }
    }

    private prepareData() {
        let result: any = {}

        this.routeRepository.getRoutes().reduce((map, route, index, array) => {
            let source = route.sourceAirportId
            if (!source) {
                let airport = this.getAirportByCode(route.sourceAirport);
                if (!airport) {
                    console.log("[WARN] Found route from non-existing airport:" + JSON.stringify(route))
                    return map
                }
                source = airport.id
            }

            let dest = route.destinationAirportId
            if (!dest) {
                let airport = this.getAirportByCode(route.destinationAirport);
                if (!airport) {
                    console.log("[WARN] Found route to non-existing airport:" + JSON.stringify(route))
                    return map
                }
                dest = airport.id
            }

            map.has(source) ? map.get(source).add(dest) : map.set(source, new Set([dest]))
            return map

        }, new Map<number, Set<number>>())
            .forEach((value, key, map) => {
                let connections: any = {}
                let source = this.airportRepository.getById(key)

                if (!source) {
                    console.log("[WARN] Found reference to non-existing airport: " + key)
                    return
                }

                value.forEach((neighbourId) => {
                    let destination = this.airportRepository.getById(neighbourId);
                    if (destination) {
                        let distance = this.calculateDistance(source, destination);
                        if (distance > 1) {
                            connections[neighbourId.toString()] = distance
                        } else {
                            console.log("[WARN] Found route with 0 length: " + source.id + "=>" + destination.id)
                            return
                        }
                    } else {
                        console.log("[WARN] Found reference to non-existing airport: " + neighbourId)
                        return
                    }
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
        let lat1 = source.latitude
        let lat2 = destination.latitude
        let lon1 = source.longtitude
        let lon2 = destination.longtitude

        const R = 6371e3; // metres
        const φ1 = lat1 * Math.PI/180; // φ, λ in radians
        const φ2 = lat2 * Math.PI/180;
        const Δφ = (lat2-lat1) * Math.PI/180;
        const Δλ = (lon2-lon1) * Math.PI/180;

        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        return R * c; // in metres
    }

    private calculateFlightsNumber(path: []) {
        return path.length - 1
    }
}