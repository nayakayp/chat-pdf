import axios from "axios";

type ResponseAnswer = {
  data: {
    output: string
  }
}

export async function POST(req: Request) {
  const { input, ns } = await req.json();


  if (!input) {
    return new Response('Question is required', { status: 400 });
  }

  const body = JSON.stringify({
    "action": "sendMessage",
    "sessionId": "57d84251-f3c8-46e9-9345-82bb2a69bcc8",
    "chatInput": input,
    "namespace": ns
  });

  const answer: ResponseAnswer = await axios.post('https://n8n.nayakayoga.com/webhook/cb6784d2-8360-455c-b5f8-041416b45ece/chat',
    body,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  return new Response(answer.data.output, { status: 200 });
};
