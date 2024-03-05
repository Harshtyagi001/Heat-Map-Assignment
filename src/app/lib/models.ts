// models.ts
import mongoose, { Document, Schema, Model } from 'mongoose';

export interface Course extends Document {
  name: string;
  marks: number;
}

const courseSchema = new Schema<Course>({
  name: { type: String, required: true },
  marks: { type: Number, required: true }
});

export const CourseModel: Model<Course> = mongoose.models.Course || mongoose.model<Course>('Course', courseSchema);
