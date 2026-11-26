/**
 * @hapi/hapi + MongoDB driver 6.x example.
 * Reads MONGODB_URI / PORT from the environment.
 *
 * Smoke endpoints:
 *   GET  /api/tours?tourPackage=Backpack%20Cal
 *   GET  /api/tours/Big%20Sur%20Retreat
 *   POST /api/tours
 *   PUT  /api/tours/:name
 *   DELETE /api/tours/:name
 */
const Hapi = require("@hapi/hapi");
const { MongoClient } = require("mongodb");

const URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = process.env.MONGODB_DB || "learning_mongo";
const PORT = Number(process.env.PORT || 8081);

async function main() {
  const client = new MongoClient(URI);
  await client.connect();
  console.log("Connected correctly to server");

  const collection = client.db(DB_NAME).collection("tours");

  const server = Hapi.server({
    port: PORT,
    host: "0.0.0.0",
  });

  server.route([
    {
      method: "GET",
      path: "/api/tours",
      handler: async (request) => {
        const findObject = { ...request.query };
        return collection.find(findObject).toArray();
      },
    },
    {
      method: "GET",
      path: "/api/tours/{name}",
      handler: async (request) => {
        return collection.findOne({ tourName: request.params.name });
      },
    },
    {
      method: "POST",
      path: "/api/tours",
      handler: async (request, h) => {
        const result = await collection.insertOne(request.payload);
        return h.response({ insertedId: result.insertedId, ...request.payload }).code(201);
      },
    },
    {
      method: "PUT",
      path: "/api/tours/{name}",
      handler: async (request) => {
        await collection.updateOne(
          { tourName: request.params.name },
          { $set: request.payload }
        );
        return collection.findOne({ tourName: request.params.name });
      },
    },
    {
      method: "DELETE",
      path: "/api/tours/{name}",
      handler: async (request, h) => {
        await collection.deleteOne({ tourName: request.params.name });
        return h.response().code(204);
      },
    },
    {
      method: "GET",
      path: "/",
      handler: () => "Hello world from Hapi/Mongo example.",
    },
  ]);

  // CI / scripted smoke: run one request cycle then exit when SMOKE=1
  if (process.env.SMOKE === "1") {
    await server.start();
    const res = await server.inject({ method: "GET", url: "/api/tours?tourPackage=Backpack%20Cal" });
    if (res.statusCode !== 200) {
      throw new Error(`Smoke failed: ${res.statusCode}`);
    }
    console.log(`Smoke OK: ${JSON.parse(res.payload).length} tours`);
    await server.stop();
    await client.close();
    return;
  }

  await server.start();
  console.log(`Hapi is listening on ${server.info.uri}`);

  const shutdown = async () => {
    await server.stop({ timeout: 5000 });
    await client.close();
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
