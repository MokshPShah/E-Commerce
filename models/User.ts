import mongoose, { Document, Schema } from 'mongoose'

export interface IUser extends Document {
  name?: string
  email?: string
  password?: string
  role: 'user' | 'admin'
  image?: string
  cart: {
    productId: mongoose.Types.ObjectId
    quantity: number
    flavor?: string
  }[]
  favorites: mongoose.Types.ObjectId[]
  createdAt: Date
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'super admin'],
    default: 'user'
  },
  image: {
    type: String
  },
  cart: [
    {
      productId: { type: Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, default: 1 },
      flavor: { type: String }
    }
  ],
  favorites: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
