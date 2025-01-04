import SharedWatchSection from '@/app/_components/shared/WatchSection';

const SMALL_TALK_QUIZ = {
  questions: [
    {
      question:
        'What are the three main contexts for small talk discussed in the video?',
      options: [
        'Work, home, and school',
        "People you don't know, work colleagues, and friends/family",
        'Social events, meetings, and parties',
        'Weather, sports, and entertainment',
      ],
      correctAnswer:
        "People you don't know, work colleagues, and friends/family",
    },
    {
      question: 'What are the two main topics for small talk with strangers?',
      options: [
        'Weather and sports',
        'Weather and current situation',
        'Current situation and news',
        'Weather and entertainment',
      ],
      correctAnswer: 'Weather and current situation',
    },
    {
      question:
        'Which of these is NOT mentioned as a common topic for workplace small talk?',
      options: ['Sports', 'The weekend', 'Family life', 'Entertainment'],
      correctAnswer: 'Family life',
    },
    {
      question:
        "What's unique about small talk with friends and family compared to other contexts?",
      options: [
        'You can only talk about personal topics',
        'The conversations can go deeper and be more personal',
        'You should avoid talking about the weather',
        'You must always talk about family matters',
      ],
      correctAnswer: 'The conversations can go deeper and be more personal',
    },
  ],
};

export default function WatchSection({ lessonId }: { lessonId: string }) {
  return (
    <SharedWatchSection
      lessonId={lessonId}
      sectionId='watch'
      videoId='4zXys7i8Zrc'
      title='Learn English Small Talk and Casual Conversation'
      keyPoints={[
        'Start with common topics like weather, weekend plans, or hobbies',
        'Use follow-up questions to keep the conversation going',
        'Share your own experiences to make the conversation two-way',
        "Pay attention to the other person's interests",
        'Use appropriate expressions to show interest and engagement',
      ]}
      tips={[
        'Remember to smile and maintain eye contact',
        "Don't be afraid to ask for clarification",
        'Use gestures to help express yourself',
        'Practice active listening',
      ]}
      quiz={SMALL_TALK_QUIZ}
    />
  );
}
