import {Path} from "../model/path"
import {UnableToComputeException} from "../exception/unable-to-compute";
import {ConnectionService} from "./connection-service";
import {FlightLeg} from "../model/flightLeg";

export class FlightPathService {

    constructor(
        private readonly connectionService: ConnectionService
    ) {
    }

    computePath(from: number, to: number) {
        let result = this.connectionService.calculatePath(from, to);
        let legs = this.mapToLegs(result.path)
        let legsNumber = this.calculateLegsNumber(legs);
        if (!result.path) {
            throw new UnableToComputeException("No path between requested airports")
        } else {
            if (legsNumber > 4) {
                throw new UnableToComputeException("Too many flights to destination, max 4, calculated " + legsNumber + " " + result.path.join("->"))
            } else {
                return new Path(legs, result.cost);
            }
        }
    }

    private mapToLegs(path: []) {
        let legs = new Array<FlightLeg>();
        let i = 0
        while (i < (path.length - 1)) {
            let a = Number(path[i]);
            let b = Number(path[++i]);
            legs.push(new FlightLeg(a, b, this.connectionService.hasGroundConnection(a, b)))
        }
        return legs
    }

    private calculateLegsNumber(path: Array<FlightLeg>) {
        return path.filter(value => !value.isGround).length
    }
}