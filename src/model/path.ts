import {FlightLeg} from "./flightLeg";

export class Path {
    constructor(
        public readonly legs: Array<FlightLeg>,
        public readonly cost: number
    ) {
    }

}