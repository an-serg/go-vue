export const THROTTLE = {
  default:      { limit: 30, ttl: 15 * 60 * 1000 },
  auth:         { limit: 10,   ttl: 5 * 60 * 1000 },
  availability: { limit: 10,  ttl: 15 * 60 * 1000 },
};