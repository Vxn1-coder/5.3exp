import { bookSeatService } from './booking.service.js';

// Controller function to handle the booking of a seat. 
// It receives the seat ID from the request parameters, 
// calls the bookSeatService function to perform the booking logic, 
// and then sends an appropriate response back to the client based on the result 
// of the booking process. The controller is responsible for handling HTTP requests 
// and responses, while the service contains the business logic for booking a seat.
const bookSeatController = async (req, res) => {
    const seatId = req.params.seatId;

    // The bookSeatService function is asynchronous because it involves operations that may 
    // take time to complete, such as acquiring a lock from Redis, checking the seat status, 
    // simulating a delay for processing, and releasing the lock. By using await, we ensure 
    // that the controller waits for the bookSeatService function to complete its execution 
    // and return a result before proceeding to send a response back to the client. 
    // This allows us to handle the booking process in a synchronous manner from the perspective 
    // of the controller, ensuring that we have the necessary information about the booking 
    // outcome before responding to the client.
    const result = await bookSeatService(seatId);

    // Based on the status returned by the bookSeatService, we send an appropriate HTTP response 
    // back to the client.
    return res.status(result.status).json({
        message: result.message
    });
};

// Export the bookSeatController function for use in other parts of the application, 
// such as routing.
export { bookSeatController };