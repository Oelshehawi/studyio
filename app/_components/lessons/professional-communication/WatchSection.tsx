import SharedWatchSection from '@/app/_components/shared/WatchSection';

const SPEAKING_QUIZ = {
  questions: [
    {
      question:
        "What are the 'seven deadly sins of speaking' according to the speaker?",
      options: [
        'Gossip, judging, negativity, complaining, excuses, embroidery, and dogmatism',
        'Lying, shouting, interrupting, mumbling, cursing, bragging, and arguing',
        'Silence, monotony, speed, volume, pitch, timbre, and register',
        'Criticism, sarcasm, mockery, rudeness, arrogance, ignorance, and dishonesty',
      ],
      correctAnswer:
        'Gossip, judging, negativity, complaining, excuses, embroidery, and dogmatism',
    },
    {
      question:
        "What does the acronym 'HAIL' stand for in the context of powerful speaking?",
      options: [
        'Honesty, Authenticity, Integrity, and Love',
        'Harmony, Attitude, Intelligence, and Logic',
        'Humor, Articulation, Influence, and Leadership',
        'Hope, Ambition, Innovation, and Learning',
      ],
      correctAnswer: 'Honesty, Authenticity, Integrity, and Love',
    },
    {
      question:
        "Which of these is NOT mentioned as a tool in the speaker's toolbox for powerful speaking?",
      options: ['Register', 'Timbre', 'Vocabulary', 'Prosody'],
      correctAnswer: 'Vocabulary',
    },
    {
      question:
        "What is the speaker's recommendation before giving an important talk?",
      options: [
        'Write out the entire speech',
        'Practice in front of a mirror',
        'Do vocal warm-up exercises',
        'Memorize key points',
      ],
      correctAnswer: 'Do vocal warm-up exercises',
    },
  ],
};

export default function WatchSection({ lessonId }: { lessonId: string }) {
  return (
    <SharedWatchSection
      lessonId={lessonId}
      sectionId='watch'
      videoId='eIho2S0ZahI'
      title='How to Speak with Power and Impact'
      keyPoints={[
        'Avoid the seven deadly sins of speaking',
        'Stand on the four cornerstones: Honesty, Authenticity, Integrity, and Love',
        "Use your voice's toolbox effectively (register, timbre, prosody, pace, silence)",
        'Warm up your voice before important talks',
        'Create conscious environments for better communication',
      ]}
      tips={[
        'Practice vocal warm-up exercises regularly',
        'Be mindful of your speaking register',
        'Use silence effectively',
        'Vary your pace and pitch for emphasis',
        'Focus on creating rich, warm tones',
      ]}
      quiz={SPEAKING_QUIZ}
    />
  );
}
