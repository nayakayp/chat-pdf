'use client'
import { useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  const handleFileSubmit = async () => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      await axios.post('https://n8n.nayakayoga.com/webhook-test/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
  };

  const handleQuestionSubmit = async () => {
    const response = await axios.post('/api/query', { question });
    setAnswer(response.data.answer);
  };

  return (
    <div>
      <h1>GPT Document Analysis Tool</h1>
      <input type="file" onChange={handleFileUpload} />
      <button onClick={handleFileSubmit}>Upload PDF</button>
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a question about the document"
      />
      <button onClick={handleQuestionSubmit}>Get Answer</button>
      <p>{answer}</p>
    </div>
  );
};

export default Home;
