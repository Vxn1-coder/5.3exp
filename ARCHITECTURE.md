## Architecture Overview

This project is a small Node.js API that demonstrates a Redis-based locking pattern to prevent double-booking of seats under concurrent load. The service is organized by feature (booking) and uses a simple in-memory model to simulate persistence.

## System Context

- Client sends HTTP requests to the API.
- Express handles routing and JSON parsing.
- Booking logic acquires a Redis lock before reading/updating seat state.
- Seat state is stored in an in-memory object (no database).
- A load test (Artillery) targets the booking endpoint.

## Runtime Components

- Entry point: index.js
  - Connects to Redis.
  - Starts the HTTP server on port 3000.
- Web app: src/app.js
  - Sets up Express middleware.
  - Mounts booking routes under /api.
- Booking module: src/modules/booking/
  - booking.route.js: defines POST /api/book/:seatId.
  - booking.controller.js: translates HTTP to service call.
  - booking.service.js: business logic and locking.
  - booking.model.js: in-memory seat state.
- Redis config: src/config/redis.js
  - Creates Redis client and connection helper.
- Lock utility: src/utils/lock.util.js
  - acquireLock: SET key with NX and EX.
  - releaseLock: verifies lock ownership before delete.

## Request Flow

1. Client calls POST /api/book/:seatId.
2. Controller calls bookSeatService(seatId).
3. Service acquires a Redis lock for the seat (lock:seat:<id>).
4. Service checks current seat status.
5. If available, seat is marked booked in memory.
6. Lock is released in a finally block.
7. Response is returned with status and message.

## Concurrency and Locking

- Lock key: lock:seat:<seatId>
- Lock TTL: 10 seconds (default in acquireLock)
- Ownership: release only if stored value matches lock token
- Failure mode: if lock not acquired, API returns HTTP 423

## Data Model

- In-memory object in booking.model.js:
  - keys: seat IDs (string)
  - values: "available" or "booked"
- This is intentionally ephemeral and resets on server restart.

## Public API

- POST /api/book/:seatId
  - Success: 200, Seat <id> booked successfully.
  - Seat already booked: 400
  - Seat not found: 404
  - Seat locked: 423

## Load Testing

- load-test.yml defines an Artillery scenario:
  - Target: http://localhost:3000
  - Phase: 20s at 15 rps
  - Endpoint: POST /api/book/1

## Operational Notes

- Redis must be running before the server starts.
- Start the app with: npm run dev
- The project uses ES modules ("type": "module").

## Tech Stack

- Node.js + Express
- Redis
- Artillery (load testing)

## Key Files

- index.js
- src/app.js
- src/config/redis.js
- src/modules/booking/*
- src/utils/lock.util.js
- load-test.yml
- package.json
