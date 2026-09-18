import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  slug: { type: String },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  size: { type: String, default: 'Standard' },
  image: { type: String, default: '/images/01.jpeg' },
  category: { type: String }
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    customer: {
      fullName: { type: String, required: true },
      email: { type: String, default: '' },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, default: 'Colombo' },
    },
    items: [orderItemSchema],
    subtotal: {
      type: Number,
      required: true,
    },
    shipping: {
      type: Number,
      default: 0,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    couponCode: {
      type: String,
      default: '',
    },
    total: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['cod', 'kokoPay', 'mintPay', 'card'],
      default: 'cod',
    },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Processing',
    },
    trackingNumber: {
      type: String,
      default: function () {
        return 'DOM-' + Math.floor(100000 + Math.random() * 900000) + '-LK';
      },
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        return ret;
      }
    }
  }
);

export const Order = mongoose.model('Order', orderSchema);
