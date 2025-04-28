const fastify = require("fastify")({enableCors:true,});
const fastifyCors = require('@fastify/cors');

fastify.register(fastifyCors, {
    origin: 'http://localhost:5173',  // Allow only this origin
    methods: ['GET', 'POST', 'OPTIONS'],
  });
// Register PostgreSQL plugin
fastify.register(require("@fastify/postgres"), {
  connectionString:
    "postgresql://neondb_owner:npg_UIq8ZV2kBGQc@ep-fragrant-surf-a1wuluaa-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
});

// Define a GET route to fetch language data
fastify.get("/lang/:lang_code", async (req, reply) => {
  const client = await fastify.pg.connect();
  try {
    const { rows } = await client.query(
      "SELECT * FROM home WHERE lang_code=$1", [req.params.lang_code]
    );
    return rows;
  } finally {
    client.release();
  }
});

// Start the server
fastify.listen({ port: 3000 }, (err) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  console.log(`Server listening on port ${fastify.server.address().port}`);
});
