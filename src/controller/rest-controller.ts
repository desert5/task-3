import express = require("express");
import { FlightPathService } from "../service/flight-path-service";
import { AirportRepository } from "../repository/airport-repository";
import { RouteRepository } from "../repository/route-repository";

const app = express();
let airportRepository = new AirportRepository();
let routeRepository = new RouteRepository();
let service = new FlightPathService(airportRepository, routeRepository);
airportRepository.loadCSV("resources/airports.dat")

app.set("port", process.env.PORT || 3000);

app.get("/", (req, res) => {
  res.send("Hi");
});

app.get("/path/:from/:to", (req, res) => {

  //res.json(service.computePath(req.params.from, req.params.to));
  res.write(service.computeRouteGraph())
});

app.get("/airports", (req, res) => {
  res.json(airportRepository.getAll().slice(0,50));
});

app.get("/routes", (req, res) => {
  res.json(routeRepository.getRoutes().slice(0,10));
});

export default app;