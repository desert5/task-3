import app from './controller/rest-controller';

const server = app.listen(app.get("port"), () => {
  console.log(
    "App is running on http://localhost:%d in %s mode",
    app.get("port"), app.get("env")
  );
});

export default server;