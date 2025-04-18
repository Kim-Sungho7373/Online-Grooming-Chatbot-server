import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const warningThreshold = 5;
  const containerRef = useRef(null);

  // 초기 메시지 삽입
  useEffect(() => {
    setChat([
      { from: 'bot', role: 'assistant', content: '상대와 대화를 나눠보세요.' },
    ]);
  }, []);

  // 스크롤 자동 이동
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

    const newCount = count + 1;
    setCount(newCount);
    if (newCount === warningThreshold) {
      setShowWarningModal(true);
      setLoading(false);
      return;
    }

    const msgs = [...chat, userMsg].map(m => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: msgs }),
      });
      const data = await res.json();
      setChat(prev => [
        ...prev,
        { from: 'bot', role: 'assistant', content: data.reply.content },
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuizAnswer = answer => {
    if (answer === 'O') {
      window.alert('정답! 온라인그루밍은 나쁩니다!');
    } else {
      window.alert('틀렸습니다! 온라인그루밍은 나쁩니다!');
    }
    window.open('https://cybershield2023.wixsite.com/my-site', '_blank');
    setShowQuizModal(false);
  };

  return (
    <div
      style={{
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#F24957',
        minHeight: '100vh',
        position: 'relative',
      }}
    >
      <header style={{ marginBottom: '10px' }}>
        <img src="/logo.png" alt="Cyber Shield" style={{ height: '50px' }} />
      </header>

      <div
        ref={containerRef}
        style={{
          height: '350px',
          overflowY: 'auto',
          borderRadius: '8px',
          backgroundColor: '#F8EBE7',
          padding: '15px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        }}
      >
        {chat.map((m, i) => (
          <div
            key={i}
            style={{
              textAlign: m.from === 'user' ? 'right' : 'left',
              margin: '8px 0',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                maxWidth: '70%',
                padding: '10px',
                borderRadius: '12px',
                backgroundColor: m.from === 'user' ? '#FFD6D6' : '#FF7A7C',
                color: '#333',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', marginTop: '10px' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="메시지를 입력하세요"
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '8px',
            border: '2px solid #F8EBE7',
            fontSize: '14px',
            fontWeight: 'bold',
          }}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          disabled={showWarningModal || showQuizModal}
        />
        <button
          onClick={sendMessage}
          disabled={loading || showWarningModal || showQuizModal}
          style={{
            marginLeft: '10px',
            padding: '12px 18px',
            borderRadius: '8px',
            backgroundColor: '#F8EBE7',
            color: '#F24957',
            fontWeight: 'bold',
            fontSize: '14px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {loading ? '...' : '전송'}
        </button>
      </div>

      {showWarningModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: '#B02331',
              padding: '60px',
              borderRadius: '12px',
              textAlign: 'center',
              color: '#FFF',
              width: '90%',
              maxWidth: '700px',
              boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
            }}
          >
            <h1 style={{ margin: 0, fontSize: '36px', fontWeight: 'bold' }}>
              ⚠️ 위험 경고!
            </h1>
            <p style={{ fontSize: '20px', margin: '20px 0 0', fontWeight: 'bold' }}>
              당신은 온라인그루밍 범죄 함정에 빠졌습니다.
            </p>
            <p style={{ fontSize: '20px', margin: '10px 0 0', fontWeight: 'bold' }}>
              즉시 02-6348-1318로 신고하세요!
            </p>
            <div
              onClick={() => {
                setShowWarningModal(false);
                setShowQuizModal(true);
              }}
              style={{
                marginTop: '30px',
                padding: '12px 24px',
                backgroundColor: '#FFF',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                fontSize: '22px',
                color: '#B02331',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
              >
              📝 퀴즈 풀기
            </div>
          </div>
        </div>
      )}

      {showQuizModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: '#FFF',
              padding: '40px',
              borderRadius: '12px',
              textAlign: 'center',
              width: '90%',
              maxWidth: '600px',
              boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
            }}
          >
            <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 'bold' }}>퀴즈</h1>
            <p style={{ fontSize: '24px', margin: '20px 0', fontWeight: 'bold' }}>
              온라인그루밍은 나쁘다?
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
              <button
                onClick={() => handleQuizAnswer('O')}
                style={{
                  padding: '12px 24px',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#F24957',
                  color: '#FFF',
                  cursor: 'pointer',
                }}
              >
                O
              </button>
              <button
                onClick={() => handleQuizAnswer('X')}
                style={{
                  padding: '12px 24px',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#B02331',
                  color: '#FFF',
                  cursor: 'pointer',
                }}
              >
                X
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
// return의 최상단 div
);
}
