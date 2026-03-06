import { createClient } from 'redis';

// Create a Redis client instance
const redisClient = createClient();

// Handle Redis connection errors
redisClient.on('error', (err) => {
    console.error('Redis Error:', err);
});

// Function to connect to Redis
const connectRedis = async () => {
    await redisClient.connect();
    console.log('✅ Redis Connected');
};

export { redisClient, connectRedis };