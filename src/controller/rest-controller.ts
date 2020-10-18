import express = require("express");
import {FlightPathService} from "../service/flight-path-service";
import {AirportRepository} from "../repository/airport-repository";
import {RouteRepository} from "../repository/route-repository";
import exceptionHandler from "../exception/exception-handler";

let airportRepository = new AirportRepository();
let routeRepository = new RouteRepository();
let service = new FlightPathService(airportRepository, routeRepository);
let airportsLoaded = airportRepository.loadCSV("resources/airports.dat");
let routesLoaded = routeRepository.loadCSV("resources/routes.dat");

Promise.all([airportsLoaded, routesLoaded]).then(() => {
    service.computeRouteGraph()
}).catch((reason => console.log(reason)))

const app = express();
app.set("port", process.env.PORT || 3000);

app.get("/", (req, res) => {
    res.send("Hi");
});

app.get("/path/:from/:to", (req, res) => {
    let flightPath = service.computePath(req.params.from, req.params.to);
    let detailedPath = flightPath.path.map((node: string) => airportRepository.getById(Number(node)));
    res.json({
            info: "Calculated path is " + detailedPath.map((airport) => airport.iata).join("->") + ", overall distance " + Math.floor(flightPath.cost / 1000) + " kilometers",
            details: detailedPath,
            cost: flightPath.cost
        }
    );
});

app.get("/airports", (req, res) => {
    res.json(airportRepository.getAll().slice(0, 50));
});

app.get("/routes", (req, res) => {
    res.json(routeRepository.getRoutes().slice(0, 50));
});

app.use(exceptionHandler);

export default app;