import mongoose, { Schema, Document } from 'mongoose'

export interface ISubscriber extends Document {
  email: string
  isSubscribed: boolean
  joinedAt: Date
  unsubscribedAt?: Date
}

const SubscriberSchema = new Schema<ISubscriber>({
  email: {
    type: String,
    required: [true, 'Email is required.'],
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please Enter a valid email address']
  },
  isSubscribed: {
    type: Boolean,
    default: true
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  unsubscribedAt: {
    type: Date
  }
})

export default mongoose.models.Subscriber ||
  mongoose.model<ISubscriber>('Subscriber', SubscriberSchema)
