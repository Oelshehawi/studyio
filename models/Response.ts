import mongoose from 'mongoose';

const responseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lessonId: {
      type: String,
      required: true,
    },
    sectionId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    audioUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Response =
  mongoose.models.Response || mongoose.model('Response', responseSchema);
