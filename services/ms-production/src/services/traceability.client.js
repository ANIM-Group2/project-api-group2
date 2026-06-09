/**
 * Traceability Client — Inter-service HTTP communication
 * ms-production calls ms-traceability to log critical events
 * This implements the "asynchronism and message-oriented processing" requirement
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
    // Fire-and-forget — don't fail the main operation if traceability is down
    console.warn(`[TraceabilityClient] Failed to log event ${type}:`, err.message);
  }
}

module.exports = { logEvent };