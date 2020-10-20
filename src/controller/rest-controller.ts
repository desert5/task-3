import express = require("express");
import {FlightPathService} from "../service/flight-path-service";
import {AirportRepository} from "../repository/airport-repository";
import {RouteRepository} from "../repository/route-repository";
import exceptionHandler from "../exception/exception-handler";
import {AirportService} from "../service/airport-service";
import {ConnectionService} from "../service/connection-service";

let airportRepository = new AirportRepository();
let routeRepository = new RouteRepository();
let airportService = new AirportService(airportRepository);
let connectionService = new ConnectionService(airportService);
let service = new FlightPathService(connectionService);
let airportsLoaded = airportRepository.loadCSV("resources/airports.dat");
let routesLoaded = routeRepository.loadCSV("resources/routes.dat");

Promise.all([airportsLoaded, routesLoaded]).then(() => {
    connectionService.initialize(routeRepository.getAll(), airportRepository.getAll(), 100)
}).catch((reason => console.log(reason)))

const app = express();
app.set("port", process.env.PORT || 3000);

app.get("/", (req, res) => {
    res.send("Hi");
});

app.get("/path/:from/:to", (req, res) => {
    console.log("We are flying from " + req.params.from + " to " + req.params.to)

    let path = service.computePath(
        airportService.getAirportByCode(req.params.from).id,
        airportService.getAirportByCode(req.params.to).id
    );
    let pathRepresentation = airportService.mapToIATAorICAO(path.legs[0].start) +
        path.legs.map((leg) => (leg.isGround ? "=>" : "->") + airportService.mapToIATAorICAO(leg.finish)).join("")
    res.json({
            info: "Calculated path is " + pathRepresentation + ", overall distance " + Math.floor(path.cost / 1000) + " kilometers",
            legs: path.legs,
            cost: path.cost
        }
    );
});

app.get("/airports", (req, res) => {
    res.json(airportRepository.getAll().slice(0, 50));
});

app.get("/routes", (req, res) => {
    res.json(routeRepository.getAll().slice(0, 50));
});

app.use(exceptionHandler);

export default app;