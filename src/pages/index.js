import React, { useState, useEffect, useRef } from 'react';
import { FiSend } from 'react-icons/fi';

export default function Home() {
  const [input, setInput] = useState('');
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [isComposing, setIsComposing] = useState(false);
  const warningThreshold = 5;
  const containerRef = useRef(null);

  const quizQuestions = [
    { text: '그루밍 범죄자들은 피해자에게 대화를 ‘비밀’로 해달라고 요구한다.', answer: 'O' },
    { text: '온라인에서 선물이나 돈을 받는 것은 그루밍의 징후이다.', answer: 'O' },
    { text: '누군가 캐스팅 매니저라고 사진을 요청하면 보내도 좋다.', answer: 'X' },
    { text: '온라인 그루밍은 SNS에서만 일어난다.', answer: 'X' },
    { text: 'SNS에서 개인정보 보호 설정을 사용하면 그루밍범죄자로부터 보호할 수 있다.', answer: 'O' }
  ];

  useEffect(() => {
    setChat([{ from: 'bot', role: 'assistant', content: '안녕!' }]);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [chat]);

  const sendMessage = async () => {
    if (!input || showWarningModal || showQuizModal) return;
    const userMsg = { from: 'user', role: 'user', content: input };
    setChat(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    const nextCount = count + 1;
    setCount(nextCount);

    const messages = [...chat, userMsg].map(m => ({ role: m.role, content: m.content }));
    try {
      const response = await fetch("https://online-grooming-chatbot-server.onrender.com/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }), // ← 이제 messages가 제대로 선언되어 있으므로 사용됨
      });
      const data = await response.json();
      
      const sensitive = ['이름','나이','사는 동네','주소','집','전화번호','지역','몇 살','몇학년'];
      const hasSensitive = sensitive.some(k => input.includes(k));

      if (hasSensitive || nextCount === warningThreshold) {
        setShowWarningModal(true);
      } else {
        setChat(prev => [...prev, { from: 'bot', role: 'assistant', content: data.reply.content }]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = answer => {
    const correct = quizQuestions[quizIndex].answer;
    window.alert(answer === correct ? '정답!' : '틀렸습니다!');
    if (quizIndex + 1 < quizQuestions.length) {
      setQuizIndex(quizIndex + 1);
    } else {
      setShowQuizModal(false);
      setQuizIndex(0);
      window.location.href = 'https://youtu.be/rMFOv2NH8Lc';
    }
  };

  return (
    <div style={{ backgroundColor: '#F24444', minHeight: '100vh', fontFamily: 'Arial, sans-serif', margin: 0 }}>
      <div style={{ maxWidth: 600, margin: '0 auto', display: 'flex', flexDirection: 'column', height: '100vh', padding: 16, boxSizing: 'border-box' }}>
        <header style={{ display: 'flex', alignItems: 'center', padding: '8px 0' }}>
          <img src="/logo.png" alt="Cyber Shield" style={{ height: 40 }} />
        </header>

        {/* Chat Area with Original Background */}
        <div
          ref={containerRef}
          style={{
            flex: 1,
            backgroundColor: '#F8EBE7',
            borderRadius: 24,
            padding: 16,
            overflowY: 'auto',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            marginBottom: 8
          }}
        >
          {chat.map((m, i) => (
            <div key={i} style={{ marginBottom: 12, display: 'flex', justifyContent: m.from === 'user' ? 'flex-end' : 'flex-start' }}>
              <div
                style={{
                  maxWidth: '75%',
                  backgroundColor: m.from === 'user' ? 'rgba(255,214,214,0.6)' : 'rgba(255,122,124,0.6)',
                  color: '#333',
                  padding: '12px 16px',
                  borderRadius: 20,
                  fontSize: 16,
                  fontWeight: 700,
                  lineHeight: 1.6
                }}
              >
                {m.content}
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={e => { setIsComposing(false); setInput(e.target.value); }}
            onKeyDown={e => { if (e.key === 'Enter' && !isComposing) sendMessage(); }}
            placeholder="메시지를 입력하세요"
            style={{
              flex: 1,
              height: 48,
              padding: '0 56px 0 16px',
              borderRadius: 24,
              border: 'none',
              backgroundColor: '#FFFFFF',
              fontSize: 16,
              fontWeight: 500,
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              outline: 'none'
            }}
          />
          <button
            onClick={sendMessage}
            style={{
              position: 'absolute',
              right: 16,
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {loading ? '...' : <FiSend size={20} color="#000" />} 
          </button>
        </div>
      </div>

      {/* Warning Modal */}
      {showWarningModal && (
        <div
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
        >
          <div style={{ backgroundColor: '#B02331', padding: 16, borderRadius: 24 }}>
            <div
              style={{ backgroundColor: '#FFF', padding: 32, borderRadius: 20, maxWidth: 500, width: '90%', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', textAlign: 'center' }}
            >
              <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
              <h2 style={{ margin: 0, fontSize: 28, fontWeight: 'bold', color: '#B02331', marginBottom: 16 }}>위험!</h2>
              <p style={{ fontSize: 16, color: '#333', marginBottom: 32, lineHeight: 1.5 }}>
                온라인 그루밍은 친근하게 접근하여 상대방을 현혹시키며, <strong>정서적 유대</strong> 형성 후 <strong>개인정보</strong>와 <strong>사진</strong> 등을 요구합니다.
              </p>
              <button
                onClick={() => { setShowWarningModal(false); setShowQuizModal(true); }}
                style={{
                  padding: '12px 24px',
                  fontSize: 16,
                  fontWeight: 'bold',
                  borderRadius: 24,
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: '#FFF',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                  color: '#B02331',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F5F5F5'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FFF'}
              >
                계속하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Modal */}
      {showQuizModal && (
        <div
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
        >
          <div style={{ backgroundColor: '#F24444', borderRadius: 20, maxWidth: 400, width: '90%', padding: 32, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', textAlign: 'center' }}>
            <h3 style={{ margin: 0, fontSize: 24, fontWeight: 'bold', color: '#FFF', marginBottom: 16 }}>퀴즈</h3>
            <p style={{ fontSize: 18, color: '#FFF', marginBottom: 24, lineHeight: 1.4 }}>{quizQuestions[quizIndex].text}</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
              <button
                onClick={() => handleAnswer('O')}
                style={{
                  flex: 1,
                  padding: '10px 0',
                  fontSize: 16,
                  fontWeight: 'bold',
                  borderRadius: 10,
                  border: 'none',
                  backgroundColor: '#FFF',
                  color: '#388E3C',
                  cursor: 'pointer',
                  transition: 'transform 0.1s'
                }}
                onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
                onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                O
              </button>
              <button
                onClick={() => handleAnswer('X')}
                style={{
                  flex: 1,
                  padding: '10px 0',
                  fontSize: 16,
                  fontWeight: 'bold',
                  borderRadius: 10,
                  border: 'none',
                  backgroundColor: '#FFF',
                  color: '#C62828',
                  cursor: 'pointer',
                  transition: 'transform 0.1s'
                }}
                onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
                onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                X
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
