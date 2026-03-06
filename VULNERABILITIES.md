# Vulnerabilities and Risk Notes

This document outlines potential security and reliability risks observed in the current architecture and tooling. It is tailored to this repository and focuses on practical risks rather than a full formal threat model.

## High-Impact Risks

### No authentication or authorization
- Risk: Any client can book any seat.
- Impact: Unauthorized usage, spoofed bookings, or abuse.
- Mitigation: Add authentication (e.g., API keys or JWT) and authorize actions per user.

### Redis exposed without authentication
- Risk: Default Redis runs without a password or TLS; if exposed beyond localhost, it can be accessed or modified by anyone on the network.
- Impact: Lock manipulation, denial of service, or data tampering.
- Mitigation: Bind Redis to localhost or a private network, enable ACLs, use TLS where supported, and avoid exposing port 6379 publicly.

## Medium-Impact Risks

### In-memory seat state
- Risk: Seat state resets on restart and is not shared across instances.
- Impact: Lost bookings and inconsistent behavior in multi-instance deployments.
- Mitigation: Persist state in a database and read/write within the lock scope.

### Lock TTL and retry policy
- Risk: TTL expiration can release a lock while a request is still processing, and lock acquisition failures are returned immediately.
- Impact: Potential double-booking or increased 423 responses under load.
- Mitigation: Keep critical sections short, increase TTL if needed, and consider a bounded retry with jitter.

### Dependency lifecycle
- Risk: Dependencies may contain known CVEs if not kept updated.
- Impact: Exposure to known vulnerabilities in upstream packages.
- Mitigation: Run `npm audit` regularly and pin or update packages with security fixes.

## Low-Impact or Operational Risks

### Docker default configuration
- Risk: Running Redis with default config may allow unauthenticated access if port exposure changes.
- Impact: Local environment compromise or data tampering during tests.
- Mitigation: Use a Docker Compose file with explicit network settings and Redis config.

### Load testing safety
- Risk: Running Artillery against a non-local environment can cause unintended load or service instability.
- Impact: Service degradation or rate-limit triggers in shared environments.
- Mitigation: Keep targets local or explicitly authorized; use rate limits when testing shared services.

## Suggested Hardening Checklist
- Add authentication and basic rate limiting.
- Restrict Redis access to trusted networks and enable auth.
- Move to persistent storage if multi-instance or restart-safe behavior is required.
- Run `npm audit` and keep dependencies updated.
- Document environment variables and production-safe defaults.
