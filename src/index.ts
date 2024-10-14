import { Hono } from "hono";
import { swaggerUI } from "@hono/swagger-ui";

//import routes
import { PostRoute, UserRoute } from "./routes";
import { errorHandler, notFound } from "./middlewares/errorMiddlewares";

// Initialize the Hono app
const app = new Hono().basePath("/api");

// Use the middleware to serve Swagger UI at /ui
app.get("/ui", swaggerUI({ url: "/doc" }));

// Posts Routes
app.route("/posts", PostRoute);
app.route("/users", UserRoute);

// Not Found Handler
app.notFound((c) => {
  const error = notFound(c);
  return error;
});

// Error Handler
app.onError((err, c) => {
  const error = errorHandler(c);
  return error;
});

export default app;
