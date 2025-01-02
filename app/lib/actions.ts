'use server';

interface MyMemoryMatch {
  id: string;
  segment: string;
  translation: string;
  quality: number;
  reference: string;
  usage_count: number;
  subject: string;
  created_by: string;
  last_updated_by: string;
  create_date: string;
  last_update_date: string;
  match: number;
}

interface MyMemoryResponse {
  responseData: {
    translatedText: string;
    match: number;
  };
  responseStatus: number;
  responseMessage?: string;
  matches: MyMemoryMatch[];
}

export async function translate({
  text,
  sourceLang,
  targetLang,
}: {
  text: string;
  sourceLang: string;
  targetLang: string;
}) {
  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        text
      )}&langpair=${sourceLang}|${targetLang}`
    );

    const data = (await response.json()) as MyMemoryResponse;

    if (!response.ok || data.responseStatus !== 200) {
      console.error('Translation error:', data);
      return { error: data.responseMessage || 'Translation failed' };
    }

    // MyMemory provides matches array with alternative translations
    const alternatives =
      data.matches
        ?.filter(
          (match) => match.translation !== data.responseData.translatedText
        )
        .map((match) => match.translation)
        .slice(0, 3) || [];

    return {
      success: true,
      translation: data.responseData.translatedText,
      alternatives,
    };
  } catch (error) {
    console.error('Translation error:', error);
    return { error: 'Translation failed' };
  }
}
