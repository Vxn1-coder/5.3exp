import redis from "./src/redis.js";
import express from "express";
import mongoose from "mongoose";
import { createClient } from "redis";
import { v4 as uuidv4 } from "uuid";

const app = express();
app.use(express.json());

/* ---------------- MongoDB ---------------- */

mongoose.connect("mongodb://127.0.0.1:27017/redislockdemo")
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log("MongoDB not connected"));

/* ---------------- Redis ---------------- */

let redisClient;

async function connectRedis(){
  try{
    redisClient = createClient();

    redisClient.on("error",(err)=>{
      console.log("Redis error:",err.message);
    });

    await redisClient.connect();
    console.log("Redis connected");

  }catch(error){
    console.log("Redis not available");
  }
}

connectRedis();

/* ---------------- Routes ---------------- */

app.get("/",(req,res)=>{
  res.send("Server running successfully 🚀");
});

app.get("/lock", async(req,res)=>{

  if(!redisClient){
    return res.send("Redis not connected");
  }

  const lockId = uuidv4();

  const result = await redisClient.set(
    "resource_lock",
    lockId,
    {NX:true, EX:10}
  );

  if(result){
    res.send("Lock acquired: "+lockId);
  }else{
    res.send("Resource already locked");
  }

});

app.get("/unlock", async(req,res)=>{

  if(!redisClient){
    return res.send("Redis not connected");
  }

  await redisClient.del("resource_lock");

  res.send("Lock released");

});

/* ---------------- PORT ---------------- */

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
  console.log(`Server running on port ${PORT}`);
});