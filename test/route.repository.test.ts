import {expect} from 'chai';
import {AirportRepository} from "../src/repository/airport-repository";
import {RouteRepository} from "../src/repository/route-repository";

describe('Route repository tests', () => {
    it('Should load CSV', (done) => {
        let routeRepository = new RouteRepository()
        routeRepository.loadCSV("resources/routes.dat").then(() => {
            expect(routeRepository.getAll().length).to.be.greaterThan(0)
            done()
        })
    });
});