import { acquireLock, releaseLock } from '../../utils/lock.util.js';
import { getSeatStatus, bookSeat } from './booking.model.js';

// Service function to handle the booking of a seat. It uses a Redis-based lock to ensure that only 
// one booking process can access the seat information at a time, preventing race conditions and 
// ensuring data consistency. The function checks the status of the seat, simulates a delay to mimic real-world processing 
// time, and then updates the seat status to "booked" if it is available. Finally, it releases the lock to allow 
// other booking processes to access the seat information.
const bookSeatService = async (seatId) => {

    // Define a unique lock key for the seat being booked. This key will be used to acquire and release the lock in Redis. 
    // The key is constructed using a prefix (e.g., "lock:seat:") followed by the seat ID to ensure that locks are specific
    // to each seat.
    const lockKey = `lock:seat:${seatId}`;

    // Attempt to acquire the lock for the specified seat. The acquireLock function will try to set a key in Redis 
    // with NX (only if it does not exist) and EX (expiry time) options.
    // If the lock is successfully acquired, it returns a unique lock value (a UUID) that identifies the lock owner. 
    // If the lock cannot be acquired (e.g., another process has already locked the seat), it returns null.
    const lockValue = await acquireLock(lockKey, 10);

    // If the lock was not acquired, it means that another process is currently booking the same seat. 
    // In this case, we return a response indicating that the seat is locked and the user should try again later.
    if (!lockValue) {
        return { status: 423, message: "Seat is currently locked. Try again." };
    }

    // Use a try-finally block to ensure that the lock is released regardless of whether the booking process succeeds or fails.
    try {
        // Check the current status of the seat using the getSeatStatus function. This function retrieves 
        // the status of the seat (e.g., "available" or "booked") from the in-memory data structure.
        const seatStatus = getSeatStatus(seatId);

        // If the seat status is null or undefined, it means that the seat ID does not exist in our data structure.
        // In this case, we return a response indicating that the seat was not found.
        if (!seatStatus) {
            return { status: 404, message: "Seat not found." };
        }

        // If the seat is not available (i.e., it is already booked), we return a response indicating that the seat is already booked.
        if (seatStatus !== "available") {
            return { status: 400, message: "Seat already booked." };
        }

        // Simulate a delay to mimic real-world processing time (e.g., payment processing, database updates, etc.).
        // This is done using a Promise that resolves after a specified timeout (e.g., 2 seconds). 
        // This delay helps to demonstrate the effectiveness of the locking mechanism
        bookSeat(seatId);

        // If the booking process is successful, we return a response indicating that the seat has been booked successfully.
        return { status: 200, message: `Seat ${seatId} booked successfully.` };

    } finally {
        // Release the lock after the booking process is complete. The releaseLock function checks if the stored value of the lock key 
        // matches the unique lock value (the UUID) that we set when acquiring the lock.
        await releaseLock(lockKey, lockValue);
    }
};

export { bookSeatService };