import { v4 as uuidv4 } from 'uuid';
import { redisClient } from '../config/redis.js';

// Simple Redis-based lock implementation
// Mechanism - 1. Try to set a key with NX (only if not exists) and EX (expiry time).
// 2. If successful, we have the lock. Store a unique value to identify the lock owner.
// 3. To release, check if the stored value matches the lock owner before deleting.
const acquireLock = async (key, ttl = 10) => {
    // Generate a unique value for this lock instance
    const lockValue = uuidv4();

    // Try to acquire the lock
    const result = await redisClient.set(key, lockValue, {
        NX: true,
        EX: ttl
    });

    // If result is null, it means the lock was not acquired (key already exists)
    if (!result) return null;

    // Lock acquired successfully, return the unique lock value
    return lockValue;
};

// Release the lock only if the stored value matches the lock owner
// Mechanism - 1. Get the current value of the lock key.
// 2. If it matches the lockValue (the unique value we set when acquiring), delete the key to release the lock.
// This ensures that we only release locks that we own, preventing accidental releases by other processes.
const releaseLock = async (key, lockValue) => {
    // Get the current value of the lock key
    const storedValue = await redisClient.get(key);

    // Only release the lock if the stored value matches the lockValue (the unique value we set when acquiring)
    if (storedValue === lockValue) {
        await redisClient.del(key);
    }
};

// Export the acquireLock and releaseLock functions for use in other parts of the application
export { acquireLock, releaseLock };