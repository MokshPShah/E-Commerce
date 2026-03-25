import mongoose, { Schema, models } from 'mongoose'

const OrderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product'
        },
        name: {
          type: String,
          required: true
        },
        price: {
          type: Number,
          required: true
        },
        quantity: {
          type: Number,
          required: true
        },
        flavor: {
          type: String
        }
      }
    ],
    totalAmount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      default: 'Processing',
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
    },
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String
    }
  },
  { timestamps: true }
)

const Order = models.Order || mongoose.model('Order', OrderSchema)
export default Order
