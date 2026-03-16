import mongoose, { Document, Schema } from 'mongoose'

export interface IUser extends Document {
  name?: string
  email?: string
  password?: string
  role: 'user' | 'admin'
  emailVerified?: Date
  image?: string
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
    enum: ['user', 'admin'],
    default: 'user'
  },
  emailVerified: {
    type: Date
  },
  image: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
