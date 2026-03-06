import express from 'express';
import { bookSeatController } from './booking.controller.js';

// Create a new Express router instance to define routes related to booking operations.
const router = express.Router();

// Define a POST route for booking a seat. The route includes a dynamic parameter ":seatId" which represents 
// the ID of the seat to be booked.
router.post('/book/:seatId', bookSeatController);

// Export the router instance as the default export of this module, allowing it to be imported and used 
// in other parts of the application,
export default router;