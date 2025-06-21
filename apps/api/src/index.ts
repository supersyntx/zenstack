import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import authPage from "./routes/v1/auth.js";
import { auth, type AuthType } from "./lib/auth.js";
import { db } from "@space/db";

const app = new Hono<{ Variables: AuthType }>();

app.use(prettyJSON());
app.use(
  "/api/auth/*",
  cors({
    origin: "http://localhost:3001", // replace with your origin
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);
app.notFound((c) => c.json({ message: "Not Found", ok: false }, 404));
app.onError((err, c) => {
  console.error("Error:", err);
  return c.json({ message: "Internal Server Error", ok: false }, 500);
});

app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));

const routes = [authPage] as const;

// routes.forEach((route) => {
//   app.basePath("/api/v1").route("/", route);
// });

app.get("/", async (c) => {
  const data = await db.query.user.findMany();
  return c.json(data, 200);
});

const server = serve(
  {
    fetch: app.fetch,
    port: 4000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);

// graceful shutdown
process.on("SIGINT", () => {
  server.close();
  process.exit(0);
});
process.on("SIGTERM", () => {
  server.close((err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    process.exit(0);
  });
});
