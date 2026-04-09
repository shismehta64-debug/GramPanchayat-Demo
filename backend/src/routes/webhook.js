const express = require('express');
const router  = express.Router();
const { validateSignature } = require('../config/twilio');
const { handleMessage }     = require('../controllers/conversationController');

/**
 * POST /webhook/whatsapp
 * Twilio sends incoming WhatsApp messages here.
 */
router.post('/', async (req, res) => {
  console.log('[Webhook] Received POST request from Twilio');
  console.log('[Webhook] Headers:', JSON.stringify(req.headers, null, 2));
  console.log('[Webhook] Body:', JSON.stringify(req.body, null, 2));

  // Validate Twilio signature (skip in development)
  if (!validateSignature(req)) {
    console.warn('[Webhook] Invalid Twilio signature');
    return res.status(403).send('Forbidden');
  }

  const from = req.body.From;   // e.g. "whatsapp:+919876543210"
  const body = req.body.Body;   // Message text
  const sid  = req.body.MessageSid;

  console.log(`[Webhook] Incoming from ${from}: "${body}" (SID: ${sid})`);

  // Respond immediately to Twilio (200 OK) — process async
  res.status(200).send('<Response></Response>');

  // Handle message asynchronously
  handleMessage(from, body, sid).catch(err =>
    console.error('[Webhook] Handler error:', err.message)
  );
});

/**
 * GET /webhook/whatsapp/health
 * Health check endpoint.
 */
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;
