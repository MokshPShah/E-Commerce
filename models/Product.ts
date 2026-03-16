import mongoose, { Document, Schema } from 'mongoose'

export interface IProduct extends Document {
  name: String
  slug: String
  desc: String
  longDesc: {
    paragraphs: string[]
    bullets: string[]
  }
  price: number
  category: 'protein' | 'pre-workout' | 'creatine' | 'apparel' | 'accessories'
  flavors: string[]
  images: string[]
  inStock: boolean
  isTrending: boolean
  rating: number
  reviewCount: number
  supplementFacts: {
    servingSize: string
    servingsPerContainer: number
    ingredients: {
      name: string
      amount: string
      dailyValue: string
    }[]
  }
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
  longDesc: {
    paragraphs: [
      {
        type: String
      }
    ],
    bullets: [
      {
        type: String
      }
    ]
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  flavors: [
    {
      type: String
    }
  ],
  images: [
    {
      type: String,
      required: true
    }
  ],
  inStock: {
    type: Boolean,
    default: true
  },
  isTrending: {
    type: Boolean,
    default: false
  },

  rating: {
    type: Number,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },

  supplementFacts: {
    servingSize: {
      type: String
    },
    servingsPerContainer: {
      type: Number
    },
    ingredients: [
      {
        name: {
          type: String
        },
        amount: {
          type: String
        },
        dailyValue: {
          type: String
        }
      }
    ]
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.models.Product ||
  mongoose.model<IProduct>('Product', ProductSchema)
