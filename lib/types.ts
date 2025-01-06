export interface FeedbackSections {
  strengths: string[];
  improvements: string[];
  actions: string[];
}

export interface BilingualFeedback {
  en: FeedbackSections;
  ar: FeedbackSections;
}

export interface Feedback {
  grade: string;
  advice: BilingualFeedback;
}

export interface DbResponse {
  _id: string;
  userId: string;
  lessonId: string;
  sectionId: string;
  content: string;
  audioUrl?: string;
  createdAt: string;
  feedback?: Feedback;
}
