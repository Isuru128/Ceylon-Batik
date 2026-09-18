import express from 'express';
import { Testimonial, CraftStep, StoreLocation, FAQ } from '../models/Content.js';

const router = express.Router();

// @route   GET /api/content/testimonials
router.get('/testimonials', async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching testimonials', error: error.message });
  }
});

// @route   GET /api/content/craft-steps
router.get('/craft-steps', async (req, res) => {
  try {
    const steps = await CraftStep.find().sort({ step: 1 });
    res.json(steps);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching craft steps', error: error.message });
  }
});

// @route   GET /api/content/locations
router.get('/locations', async (req, res) => {
  try {
    const locations = await StoreLocation.find();
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching store locations', error: error.message });
  }
});

// @route   GET /api/content/faqs
router.get('/faqs', async (req, res) => {
  try {
    const faqs = await FAQ.find();
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching FAQs', error: error.message });
  }
});

export default router;
