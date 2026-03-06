// Simulated DB (In-memory)
// In a real application, this would be replaced with actual database calls to fetch and update seat information.
// For simplicity, we're using an in-memory object to represent the seat status. Each seat has an ID and a status (available or booked).
let seats = {
    "1": "available",
    "2": "available",
    "3": "available",
    "4": "available",
    "5": "available"
};

// Function to get the status of a seat by its ID. It returns the current status of the seat (available or booked).
const getSeatStatus = (seatId) => {
    return seats[seatId];
};

// Function to book a seat by its ID. It updates the seat status to "booked".
const bookSeat = (seatId) => {
    seats[seatId] = "booked";
};

// Export the getSeatStatus and bookSeat functions for use in other parts of the application
export { getSeatStatus, bookSeat };