import {Airport} from "../model/airport";
import {Route} from "../model/route";
import {AirportService} from "./airport-service";

const Graph = require('node-dijkstra')
const sphereKnn = require("sphere-knn")

export class ConnectionService {

    private groundConnections: Map<number, Set<number>> = new Map<number, Set<number>>()
    private airportService: AirportService
    private graph: any = {};

    constructor(airportService: AirportService) {
        this.airportService = airportService
    }

    public initialize(routes: Route[], airports: Airport[], proximityKm: number) {
        console.log("Started graph computation")

        let routeConnections = this.mapRouteConnections(routes);

        console.log("Mapped " + routeConnections.size + " route connections")

        this.groundConnections = this.mapGroundConnections(airports, proximityKm);

        console.log("Mapped " + this.groundConnections.size + " ground connections within " + proximityKm + " kilometers")

        let connections = this.merge(routeConnections, this.groundConnections);

        console.log("Total connections " + connections.size)

        let libraryInput = this.mapToLibraryInput(this.calculateConnectionDistances(connections));

        console.log("Passing " + Object.keys(libraryInput).length + " nodes to the library")

        this.graph = new Graph(libraryInput)

        console.log("Graph computed, node count " + this.graph.graph.size)
    }

    public calculatePath(from: number, to: number) {
        return this.graph.path(from.toString(), to.toString(), {cost: true})
    }

    public hasGroundConnection(a: number, b: number) {
        return this.groundConnections.has(a) || this.groundConnections.get(a).has(b)
    }

    private mapGroundConnections(airports: Airport[], proximityKm: number) {
        console.log("Started proximity graph computation")
        let graph = sphereKnn(airports)
        let map = new Map<number, Set<number>>();
        airports.forEach((source) => {
            let points = graph(source.latitude, source.longitude, 10, proximityKm * 1000);
            points.forEach((dest: Airport) => {
                if (source.id != dest.id) {
                    console.log("Found ground connection: "
                        + (source.iata != '\\N' ? source.iata : source.icao)
                        + " => " + (dest.iata != '\\N' ? dest.iata : dest.icao))

                    map.has(source.id) ? map.get(source.id).add(dest.id) : map.set(source.id, new Set([dest.id]))
                }
            })
        })
        return map
    }

    private mapRouteConnections(routes: Route[]) {
        let map = new Map<number, Set<number>>();
        routes.forEach((route) => {
            let source = route.sourceAirportId
            if (!source) {
                let airport = this.airportService.getAirportByCode(route.sourceAirport);
                if (!airport) {
                    console.log("[WARN] Found route from non-existing airport:" + JSON.stringify(route))
                    return
                }
                source = airport.id
            }

            let dest = route.destinationAirportId
            if (!dest) {
                let airport = this.airportService.getAirportByCode(route.destinationAirport);
                if (!airport) {
                    console.log("[WARN] Found route to non-existing airport:" + JSON.stringify(route))
                    return
                }
                dest = airport.id
            }

            map.has(source) ? map.get(source).add(dest) : map.set(source, new Set([dest]))
        })
        return map
    }

    private calculateConnectionDistances(map: Map<number, Set<number>>) {
        let output = new Map<number, ConnectionInfo[]>();
        map.forEach((value, key) => {
            let source = this.airportService.getById(key)

            if (!source) {
                console.log("[WARN] Found reference to non-existing airport: " + key)
                return
            }

            value.forEach((neighbourId) => {
                let destination = this.airportService.getById(neighbourId);
                if (destination) {
                    let distance = this.calculateDistance(source, destination);
                    if (distance > 1) {
                        output.has(key)
                            ? output.get(key).push(new ConnectionInfo(neighbourId, distance))
                            : output.set(key, new Array(new ConnectionInfo(neighbourId, distance)))

                    } else {
                        console.log("[WARN] Found route with 0 length: " + source.id + "=>" + destination.id)
                        return
                    }
                } else {
                    console.log("[WARN] Found reference to non-existing airport: " + neighbourId)
                    return
                }
            })
        })
        return output
    }

    private merge(one: Map<number, Set<number>>, two: Map<number, Set<number>>) {
        let map = new Map<number, Set<number>>();
        one.forEach((value, key) => map.set(key, new Set(value)))
        two.forEach((value, key) => map.has(key) ? map.set(key, new Set([...map.get(key), ...value])) : map.set(key, new Set(value)))
        return map;
    }

    private mapToLibraryInput(input: Map<number, ConnectionInfo[]>) {
        let output: any = {}
        input.forEach(((value, key) => {
            let connections: any = {}
            value.forEach(element => connections[element.node.toString()] = element.distance)
            output[key.toString()] = connections
        }))
        return output;
    }

    private calculateDistance(source: Airport, destination: Airport) {
        let lat1 = source.latitude
        let lat2 = destination.latitude
        let lon1 = source.longitude
        let lon2 = destination.longitude

        const R = 6371e3; // metres
        const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // in metres
    }
}

class ConnectionInfo {
    constructor(
        public readonly node: number,
        public readonly distance: number
    ) {
    }
}