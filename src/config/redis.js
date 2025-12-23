const redis = require("redis");

let client = null;

async function getRedisClient() {
  if (!client) {
    client = redis.createClient({
      socket: {
        host: process.env.REDIS_HOST || "127.0.0.1",
        port: process.env.REDIS_PORT || 6379,
      },
    });

    client.on("error", (err) => {
      console.error("Redis error:", err);
    });

    await client.connect();
  }

  return client;
}

module.exports = getRedisClient;
