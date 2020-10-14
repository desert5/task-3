import express = require("express");

const app = express();
app.set("port", process.env.PORT || 3000);

app.get("/", (req, res) => {
  res.send("Hi");
});

app.get("/path/:from/:to", (req, res) => {
  res.send("We are flying from " + req.params.from + " to " + req.params.to);
});

export default app;