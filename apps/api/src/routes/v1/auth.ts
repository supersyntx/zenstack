import { Hono } from "hono";
import { checkAuth } from "../../middleware/auth.js";
import { auth, type AuthType } from "../../lib/auth.js";

const app = new Hono<{ Variables: AuthType }>({
  strict: false,
});
app.on(["POST", "GET"], "/auth/**", (c) => auth.handler(c.req.raw));

app.use("*", (c, next) => checkAuth(c, next));

app.basePath("/auth").get("/session", (c) => {
  const user = c.get("user");
  const session = c.get("session");
  return c.json({ user, session });
});

export default app;
