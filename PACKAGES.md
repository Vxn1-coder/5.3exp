# Packages and Tools

## Overview
This project is a small Node.js API with Redis-based locking and an Artillery load test. It runs locally with Docker for Redis and uses a feature-based module layout.

## Runtime Dependencies (package.json)

### express
- Purpose: HTTP server and routing.
- Usage in this repo: Handles request routing and JSON parsing for the booking API.
- Notes: Express 5 is used (ESM compatible). Ensure middleware and error handling are compatible with Express 5.

### redis
- Purpose: Redis client used for distributed locking.
- Usage in this repo: Creates a client for acquiring and releasing locks to prevent double-booking.
- Notes: Requires a running Redis instance before the API starts.

### mongoose
- Purpose: MongoDB ODM.
- Usage in this repo: Listed as a dependency but not currently used in the codebase. This suggests the project may have planned persistence beyond the in-memory model.
- Notes: If unused, consider removing to reduce attack surface and install time.

### uuid
- Purpose: Generates unique IDs.
- Usage in this repo: Used for lock token ownership to ensure safe lock release.
- Notes: Safe to use for lock tokens; does not require crypto-grade entropy for this use case.

### nodemon
- Purpose: Development tool for auto-reloading.
- Usage in this repo: Runs the dev server via `npm run dev`.
- Notes: Typically a dev dependency; it is currently listed under dependencies.

## Tools and Infrastructure

### Docker
- Purpose: Runs Redis locally without a native install.
- Usage in this repo: Redis is started with `docker run -d --name redis-server -p 6379:6379 redis`.
- Notes: This uses the default Redis image and exposes the port to localhost.

### Redis
- Purpose: Provides atomic locking via `SET NX EX` to prevent concurrent seat bookings.
- Usage in this repo: The lock key is `lock:seat:<seatId>` with a TTL and token ownership check on release.
- Notes: Locks expire after a TTL to avoid deadlocks if a process crashes.

### Artillery
- Purpose: Load testing tool.
- Usage in this repo: `load-test.yml` config drives concurrent POST requests to `/api/book/1`.
- Notes: Useful for validating lock contention and response behavior under concurrent load.

## Runtime Flow Summary
- Client sends a booking request.
- Express routes the request to the booking module.
- The service acquires a Redis lock, checks the in-memory seat state, and releases the lock.
- Artillery can be used to simulate concurrent requests.

## Suggested Improvements (Optional)
- Move `nodemon` to `devDependencies`.
- Remove `mongoose` if it is not used.
- Add a Docker Compose file for Redis and the API if local setup is repeated often.
