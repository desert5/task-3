import {expect} from 'chai';
import {AirportRepository} from "../src/repository/airport-repository";

describe('Airport repository tests', () => {
    it('Should load CSV', (done) => {
        let airportRepository = new AirportRepository()
        airportRepository.loadCSV("resources/airports.dat").then(() => {

            let airport = airportRepository.getById(2985);
            let warsawAirport = airportRepository.getByIATA("WAW");
            let gothenburgAirport = airportRepository.getByICAO("ESGP");

            expect(airportRepository).to.be.not.null
            expect(airport).to.be.not.null
            expect(airport.iata).to.be.eq("SVO")
            expect(warsawAirport.id).to.be.eq(679)
            expect(gothenburgAirport.id).to.be.eq(691)

            done()
        })
    });
});