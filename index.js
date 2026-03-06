import express from "express";
import mongoose from "mongoose";
import { createClient } from "redis";
import { v4 as uuidv4 } from "uuid";

const app = express();
app.use(express.json());

/* ---------------- MongoDB Connection ---------------- */

mongoose.connect("mongodb://127.0.0.1:27017/redislockdemo")
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

/* ---------------- Redis Connection ---------------- */

const redisClient = createClient();

redisClient.on("error", (err) => console.log("Redis Error", err));

await redisClient.connect();

/* ---------------- Routes ---------------- */

app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

/* Acquire Lock */

app.get("/lock", async (req, res) => {

  const lockId = uuidv4();

  const result = await redisClient.set("resource_lock", lockId, {
    NX: true,
    EX: 10
  });

  if (result) {
    res.send(`Lock acquired with id: ${lockId}`);
  } else {
    res.send("Resource is already locked");
  }

});

/* Release Lock */

app.get("/unlock", async (req, res) => {

  await redisClient.del("resource_lock");

  res.send("Lock released");

});

/* ---------------- Server Port ---------------- */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});