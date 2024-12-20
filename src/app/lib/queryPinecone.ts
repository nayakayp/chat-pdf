// lib/queryPinecone.ts
import {pinecone} from './pineconeClient';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export const queryPinecone = async (question: string) => {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: question,
  });

  const queryVector = response.data[0].embedding;

  const searchResults = await pinecone.index('upwork-pitching').namespace('upwork-pitching_ns').query({
    vector: queryVector,
    topK: 5,
    includeValues: true
  });

  const context = searchResults.matches.map(match => match?.metadata?.text).join('\n');

  const answer = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'user',
        content: `${context}\n\nQ: ${question}\nA:`,
      },
    ],
    max_tokens: 150,
  });

  return answer.choices[0].message.content;
};