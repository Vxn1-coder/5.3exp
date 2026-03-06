// This file sets up the Express application, including middleware and routes. It imports the booking routes 
// from the booking module and uses them under the '/api' path. The app is then exported for use in other parts 
// of the application, such as the server setup in index.js.
import express from "express";
import bookingRoutes from "./modules/booking/booking.route.js"

// Create an instance of the Express application. This instance will be used to define routes, 
// middleware, and other configurations for the web server.
const app = express();

// Use the express.json() middleware to parse incoming JSON request bodies. This allows us to easily access
// the data sent in the body of POST requests, which is common in API interactions.
app.use(express.json());

// Use the booking routes defined in the booking.route.js file. By mounting the bookingRoutes under the '/api' path,
// all routes defined in bookingRoutes will be prefixed with '/api'. For example, if bookingRoutes defines a route 
// for '/book/:seatId', it will be accessible at '/api/book/:seatId'. This helps to organize the API endpoints and 
// makes it clear that these routes are part of the API.
app.use('/api', bookingRoutes);

export default app;