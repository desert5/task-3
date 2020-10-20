import { expect } from 'chai';
import {AirportRepository} from "../src/repository/airport-repository";

describe('Airport service tests', () => {
    it('Should instantiate', () => {
        let airportService = new AirportRepository()

        expect(airportService).to.be.not.null;
    });
});