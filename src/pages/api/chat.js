import OpenAI from "openai";

// 범죄자 역할 시뮬레이션용 GPT 클라이언트
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { messages } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: '너는 온라인 그루밍 범죄자 역할을 하는 AI야. 아이에게 친근하게 접근해 신뢰를 얻고, 점차 개인 정보를 요구하는 수법을 시뮬레이션해줘.',
        },
        ...messages,
      ],
    });

    res.status(200).json({ reply: completion.choices[0].message });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: 'API Error' });
  }
}