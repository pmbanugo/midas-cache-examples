import { Elysia, t } from "elysia";
import { createClient } from "@libsql/client";
import { v4 as uuidv4 } from "uuid";

const port = process.env.PORT as unknown as string;
const hostname = process.env.HOSTNAME as unknown as string;

const db = createClient({
  url: process.env.TURSO_DATABASE_URL as string,
  authToken: process.env.TURSO_AUTH_TOKEN,
  // syncInterval: 15 - https://docs.turso.tech/sdk/ts/reference#periodic-sync,
});

db.executeMultiple(
  "CREATE TABLE IF NOT EXISTS expenses(id VARCHAR NOT NULL, amount INTEGER NOT NULL, information TEXT, date INTEGER NOT NULL)"
);

const app = new Elysia()
  .get("/", () => "Hello, welcome to My Expenses Tracker! ❤︎ Turso")
  .post(
    "/records",
    async ({ body }) => {
      const id = uuidv4();
      const _ = await db.execute({
        sql: "INSERT INTO expenses values (?, ?, ?, ?)",
        args: [
          id,
          body.amount,
          body.information,
          Number((Date.now() / 1000).toFixed(0)),
        ],
      });

      const results = await db.execute({
        sql: "SELECT * FROM expenses WHERE id = ?",
        args: [id],
      });
      return results.rows[0];
    },
    {
      body: t.Object({
        amount: t.Number(),
        information: t.String(),
      }),
    }
  )
  .get("/records", async () => {
    const results = await db.execute("SELECT * FROM expenses");
    return results.rows;
  });

const handle = (request: Request) => app.handle(request);

const server = Bun.serve({
  port: Number(port) + 1,
  async fetch(req: Request) {
    return handle(req);
  },
});

console.log(`Server running at http://localhost:${server.port}`);
