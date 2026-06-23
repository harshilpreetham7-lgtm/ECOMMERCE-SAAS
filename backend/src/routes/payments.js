import express from 'express';
import config from '../config/index.js';
import Stripe from 'stripe';

const router = express.Router();
const stripe = new Stripe(config.stripeSecretKey || '', { apiVersion: '2022-11-15' });

// Create a PaymentIntent
router.post('/create-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd' } = req.body;

    if (!config.stripeSecretKey) {
      return res.status(500).json({ success: false, message: 'Stripe not configured on server' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency,
    });

    res.json({ success: true, clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('Stripe error', err);
    res.status(500).json({ success: false, message: err.message || 'Payment creation failed' });
  }
});

export default router;
