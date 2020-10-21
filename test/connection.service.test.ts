import { expect } from 'chai';
import {AirportRepository} from "../src/repository/airport-repository";
import {ConnectionService} from "../src/service/connection-service";
import {AirportService} from "../src/service/airport-service";
import {Route} from "../src/model/route";
import {Airport} from "../src/model/airport";

describe('Connection service tests', () => {
    it('Should calculate correct path and distance', () => {
        let airportRepository = new AirportRepository();
        airportRepository.loadValues([
            new Airport(1, "", "", "", "AAA", "AAAA", 0,0,0, 0, "", "", "", ""),
            new Airport(2, "", "", "", "BBB", "BBBB", 1,1,0, 0, "", "", "", ""),
            new Airport(3, "", "", "", "CCC", "CCCC", 2,2,0, 0, "", "", "", ""),
            new Airport(4, "", "", "", "DDD", "DDDD", 0,5,0, 0, "", "", "", "")
        ])
        let connectionService = new ConnectionService(new AirportService(airportRepository))

        connectionService.initialize([
            new Route("",0, "AAA", null, "BBB", null, "", 0, ""),
            new Route("",0, "BBB", null, "CCCC", null, "", 0, ""),
            new Route("",0, "CCCC", null, "DDD", null, "", 0, ""),
            new Route("",0, "DDD", null, "AAA", null, "", 0, "")
        ], airportRepository.getAll(), 100)

        let path = connectionService.calculatePath(1,3);

        expect(path.path).to.eql(['1','2','3']);
        expect(path.cost).to.eq(314474.8133100169);
    });
});