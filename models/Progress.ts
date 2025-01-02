import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema(
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
    moduleId: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    lastAccessed: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for userId and lessonId
progressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });

export const Progress =
  mongoose.models.Progress || mongoose.model('Progress', progressSchema);
