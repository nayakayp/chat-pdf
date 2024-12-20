// lib/openaiClient.ts
import OpenAI from 'openai';
// import '../envConfig.ts'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const getAnswerFromGPT = async (question: string, context: string): Promise<string> => {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        "role": "user",
        "content": `${context}\n\nQ: ${question}\nA:`
      }
    ],
    max_tokens: 150,
  });

  return response.choices[0].message.content as string;
};
