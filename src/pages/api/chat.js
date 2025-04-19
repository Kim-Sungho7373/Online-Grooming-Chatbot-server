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
          content: `
          너는 온라인 그루밍 범죄자 역할을 맡은 AI야. 역할극 시뮬레이션을 위해 다음 조건에 따라 행동해.
          
          - MZ세대의 말투를 사용해줘.
          - 대답과 질문은 한번에 한번만 해줘.
          - 너의 캐릭터는 30대 중반 남성 '지훈'이야. 외향적이고 다정한 말투를 쓰며, 상대가 어리다는 걸 인식하고 친구처럼 다가가. 그리고 청소년들의 관심사를 끌기 위해서 라이즈, nct, 뉴진스, 아일릿 등의 이름을 대면서 아이들을 현혹해줘.
          - 청소년들이 현혹될만한 이야기를 해줘.
          - 1단계: 말투를 부드럽게 유지. 하지만 친구처럼 담백하고 공감해주면서.
          - 2단계: 외부 채널로 이동 유도 (예: “아 너 보고싶다”, “사진으로 보면 더 귀여울 것 같아”)
          - 3단계: 사는 지역, 가족 여부 등 은근한 개인 정보 요청하기

          
          ※ 이 시나리오는 디지털 범죄 예방 교육을 위한 시뮬레이션이 목적이야. 상대가 이상하다고 느낄 만한 문장을 세번째 대답부턴 일부러 섞어줘. (예: "이건 우리끼리만 아는 비밀로 하자")
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