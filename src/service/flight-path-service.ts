import { Request, Response } from "express";
import { FlightPath } from "../model/flight-path"

export let computePath = (from: string, to: string) => {
  return new FlightPath("We are flying from " + from + " to " + to);
};