import mongoose, { Document, Schema } from 'mongoose'

export interface IActivityLog extends Document {
  userEmail: string
  action: string
  details?: string
  createdAt: Date
}

const ActivityLogSchema = new Schema<IActivityLog>({
  userEmail: { type: String, required: true },
  action: { type: String, required: true },
  details: { type: String},
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.models.ActivityLog || mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema)