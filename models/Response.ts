import mongoose from 'mongoose';

const feedbackSectionsSchema = new mongoose.Schema(
  {
    strengths: [String],
    improvements: [String],
    actions: [String],
  },
  { _id: false }
);

const bilingualFeedbackSchema = new mongoose.Schema(
  {
    en: feedbackSectionsSchema,
    ar: feedbackSectionsSchema,
  },
  { _id: false }
);

const feedbackSchema = new mongoose.Schema(
  {
    grade: String,
    advice: bilingualFeedbackSchema,
  },
  { _id: false }
);

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
    audioUrl: String,
    feedback: feedbackSchema,
  },
  {
    timestamps: true,
  }
);

export const Response =
  mongoose.models.Response || mongoose.model('Response', responseSchema);
