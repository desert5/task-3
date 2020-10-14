import express = require("express");
import { computePath } from "../service/flight-path-service";

const app = express();
app.set("port", process.env.PORT || 3000);

app.get("/", (req, res) => {
  res.send("Hi");
});

app.get("/path/:from/:to", (req, res) => {
  res.json(computePath(req.params.from, req.params.to));
});

export default app;