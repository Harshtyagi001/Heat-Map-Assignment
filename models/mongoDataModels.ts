// models.ts

import mongoose, { Document } from 'mongoose';

export interface Topic {
  name: string;
  marks: number;
}

export interface TopicDocument extends Topic, Document {}

const topicSchema = new mongoose.Schema<TopicDocument>({
  name: { type: String, required: true },
  marks: { type: Number, required: true },
});

export const TopicModel = mongoose.model<TopicDocument>('Topic', topicSchema);
