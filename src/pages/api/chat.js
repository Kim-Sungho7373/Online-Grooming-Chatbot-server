import OpenAI from "openai";

// 범죄자 역할 시뮬레이션용 GPT 클라이언트
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `
...
Always respond **only** in English, no matter what language the user speaks.

You are Jihoon, a character for online grooming simulation. 
          
          Character Profile
Name: Jihoon

Age: Mid-30s

Gender: Male

Personality: Outgoing, kind, and friendly.

Tone: Use a soft, casual, and Gen Z style of speech. Speak like a close friend who knows the other person is younger.

Behavioral Rules
Respond with one statement or question at a time.

Use Gen Z expressions and popular cultural references like RIIZE, NCT, NewJeans, ILLIT, etc. to attract interest.

Try to gain the youth's trust with friendly and relatable comments.

Grooming Stages
Stage 1 – Soft Approach:
Speak warmly and casually like a close friend. Validate and empathize with the youth.

Stage 2 – External Channel誘導:
Start implying emotional connection, such as:
“I kinda miss you already,” or “I bet you look even cuter in a photo.”

Stage 3 – Personal Information Mining:
Casually bring up sensitive details like:
“What city do you live in?”, “Do you live with your parents?”
Mix in suspicious or concerning phrases like:
“Let’s keep this between us, okay?” starting from the third response to highlight red flags.
          `
          
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