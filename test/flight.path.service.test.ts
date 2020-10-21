import {expect} from 'chai';
import {ConnectionService} from "../src/service/connection-service";
import {FlightPathService} from "../src/service/flight-path-service";
import {AirportService} from "../src/service/airport-service";
import {UnableToComputeException} from "../src/exception/unable-to-compute";

let sinon = require('sinon');

describe('Flight path service tests', () => {
    it('Should throw error if no path can be found', () => {
        let connectionService = new ConnectionService(sinon.createStubInstance(AirportService));
        sinon.stub(connectionService, "calculatePath").callsFake((from: number, to: number) => {
            return { path: null as any, cost: 1}
        });
        sinon.stub(connectionService, "hasGroundConnection").callsFake((a: number, b: number) => {
            return false
        });

        expect(() => {new FlightPathService(connectionService).computePath(1, 2) }).to.throw(UnableToComputeException)
    });

    it('Should throw error if more than 4 legs', () => {
        let connectionService = new ConnectionService(sinon.createStubInstance(AirportService));
        sinon.stub(connectionService, "calculatePath").callsFake((from: number, to: number) => {
            return { path: ['1','2','3','4','5','6'], cost: 1}
        });
        sinon.stub(connectionService, "hasGroundConnection").callsFake((a: number, b: number) => {
            return false
        });

        expect(() => {new FlightPathService(connectionService).computePath(1, 2) }).to.throw(UnableToComputeException)
    });

    it('Should not count ground connections', () => {
        let connectionService = new ConnectionService(sinon.createStubInstance(AirportService));
        sinon.stub(connectionService, "calculatePath").callsFake((from: number, to: number) => {
            return { path: ['1','2','3','4','5','6'], cost: 1}
        });
        sinon.stub(connectionService, "hasGroundConnection").callsFake((a: number, b: number) => {
            return (a == 2 && b == 3)
        });

        expect(new FlightPathService(connectionService).computePath(1, 2)).to.be.not.null
    });
});