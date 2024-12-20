// lib/vectorStore.ts
import { PineconeRecord, RecordMetadata } from '@pinecone-database/pinecone';
import { pinecone } from './pineconeClient';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export const storeTextInPinecone = async (text: string, documentId: string) => {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });

  const vectors: PineconeRecord<RecordMetadata>[] = response.data.map((embedding, index) => ({
    id: `${documentId}-${index}`,
    values: embedding.embedding,
    metadata: { text: text.split('\n')[index] }
  }));

  await pinecone.index('upwork-pitching').namespace('upwork-pitching_ns').upsert(vectors);
};
