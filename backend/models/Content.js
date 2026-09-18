import mongoose from 'mongoose';

const transformOptions = {
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret.id || (ret._id ? ret._id.toString() : '');
      return ret;
    }
  }
};

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, default: 'Colombo' },
  comment: { type: String, required: true },
  rating: { type: Number, default: 5 },
  date: { type: String, default: 'Recent' }
}, transformOptions);

const craftStepSchema = new mongoose.Schema({
  step: { type: String, required: true },
  title: { type: String, required: true },
  sinhala: { type: String, default: '' },
  desc: { type: String, required: true }
}, transformOptions);

const storeLocationSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  sinhala: { type: String, default: '' },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  hours: { type: String, required: true },
  email: { type: String, required: true },
  mapQuery: { type: String, default: '' }
}, transformOptions);

const faqSchema = new mongoose.Schema({
  q: { type: String, required: true },
  a: { type: String, required: true }
}, transformOptions);

export const Testimonial = mongoose.model('Testimonial', testimonialSchema);
export const CraftStep = mongoose.model('CraftStep', craftStepSchema);
export const StoreLocation = mongoose.model('StoreLocation', storeLocationSchema);
export const FAQ = mongoose.model('FAQ', faqSchema);
