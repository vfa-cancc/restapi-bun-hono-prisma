import { Hono } from "hono";

//import routes
import { PostRoute, UserRoute } from "./routes";
import { errorHandler, notFound } from "./middlewares/errorMiddlewares";

// Initialize the Hono app
const app = new Hono().basePath("/api");

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
