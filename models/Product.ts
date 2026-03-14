import mongoose, { Document, Schema } from 'mongoose'

export interface IProduct extends Document {
  name: String
  slug: String
  desc: String
  price: number
  category: 'protein' | 'pre-workout' | 'creatine' | 'apparel' | 'accessories'
  flavors: string[]
  images: string[]
  inStock: boolean
  inTrending: boolean
  createdAt: Date
}

const ProductSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  desc: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['protein', 'pre-workout', 'creatine', 'apparel', 'accessories']
  },
  flavors: [
    {
      type: String
    }
  ],
  images: [
    {
      type: String
    }
  ],
  inStock: {
    type: Boolean,
    default: true
  },
  inTrending: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.models.Product ||
  mongoose.model<IProduct>('Product', ProductSchema)
