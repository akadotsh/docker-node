const express = require("express");
const redis = require("redis");
const process = require("process");
const app = express();

const client = redis.createClient({
  url: process.env.REDIS_URL,
});

app.get("/", async (req, res) => {
  try {
    let visits = await client.get("visits");
    if (visits === null) {
      await client.set("visits", 0);
      visits = 0;
    } else {
      visits = parseInt(visits);
    }
    res.send("Number of visits " + visits);
    await client.set("visits", visits + 1);
  } catch (error) {
    console.log("Error", error);
    res.status(500).send("Internal Server Error");
  }
});

async function startServer() {
  try {
    await client.connect();
    app.listen(3000, () => {
      console.log("server started on port 3000");
    });
  } catch (error) {
    console.log(error);
    process.exit(1); // Changed from 0 to 1 to indicate an error
  }
}

startServer();
