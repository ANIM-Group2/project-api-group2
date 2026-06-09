/**
 * Traceability Client — Inter-service HTTP communication
 * ms-inventory calls ms-traceability to log stock movements
 */
const TRACEABILITY_URL = process.env.MS_TRACEABILITY_URL || 'http://localhost:4004';

async function logEvent(type, data, token) {
  try {
    await fetch(`${TRACEABILITY_URL}/traceability/event`, {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ type, data }),
    });
  } catch (err) {
    console.warn(`[TraceabilityClient] Failed to log event ${type}:`, err.message);
  }
}

module.exports = { logEvent };