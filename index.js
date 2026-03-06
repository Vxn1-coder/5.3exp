// Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine. 
// It allows developers to run JavaScript code on the server side, enabling the creation of scalable 
// and high-performance web applications. Node.js uses an event-driven, non-blocking I/O model, 
// making it efficient for handling concurrent requests and real-time applications. 
// It has a vast ecosystem of libraries and frameworks, such as Express.js, which simplifies 
// the development of web servers and APIs.

// Node.js entry point for the application. This file is responsible for starting the server and 
// connecting to necessary services like Redis.

// Importing mechanism - ES6 Modules (import/export) is a standardized module system in JavaScript that allows 
// developers to organize and reuse code across different files and modules. It provides a clean and intuitive 
// syntax for importing and exporting functions, objects, or values between modules. In this file, we use the
// import statement to bring in the Express application instance from the app.js file and the connectRedis function
// from the Redis configuration file. This allows us to set up our server and establish a connection to Redis
// before starting to listen for incoming requests.
import app from './src/app.js';
import { connectRedis } from './src/config/redis.js';

const PORT = 3000;

const startServer = async () => {
    await connectRedis();

    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
};

startServer();