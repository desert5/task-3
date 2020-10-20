import {IllegalArgumentException} from "../exception/illegal-argument-exception";
import {AirportRepository} from "../repository/airport-repository";

export class AirportService {

    constructor(
        private readonly airportRepository: AirportRepository
    ) {

    }

    getById(id: number) {
        return this.airportRepository.getById(id)
    }

    getAirportByCode(code: string) {
        if (!code) {
            throw new IllegalArgumentException("airport-code", code);
        } else if (code.length == 3) {
            return this.airportRepository.getByIATA(code)
        } else if (code.length == 4) {
            return this.airportRepository.getByICAO(code);
        } else {
            throw new IllegalArgumentException("airport-code", code);
        }
    }

    mapToIATAorICAO(id: number) {
        let airport = this.getById(id);
        return airport.iata != '\\N' ? airport.iata : airport.icao
    }
}