'use client';
import { useState, useRef, useEffect } from 'react';

const SYSTEMS = [
  { id: 'ayurveda', label: '🌿 Ayurveda', color: '#5a7c45' },
  { id: 'chinese', label: '☯️ Chinese', color: '#c0392b' },
  { id: 'western', label: '🔬 Western', color: '#8e44ad' },
  { id: 'homeopathy', label: '💧 Homeopathy', color: '#2980b9' },
];

const SAMPLES = [
  'I have fatigue and joint stiffness every morning',
  'My blood sugar is 118 mg/dL fasting, what does this mean?',
  'I feel anxious and cannot sleep well lately',
  'I have chronic digestive issues and bloating after meals',
];

export default function Home() {
  const [messages, setMessages] = useState<{role:string,content:string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [systems, setSystems] = useState(['ayurveda','western']);
  const [started, setStarted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (query?: string) => {
    const text = query || input;
    if (!text.trim() || loading) return;
    setStarted(true);
    setInput('');
    setLoading(true);
    const userMsg = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, system_ids: systems }),
      });
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let full = '';
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.token) {
                full += data.token;
                setMessages(prev => {
                  const updated = [...prev];
                  updated[updated.length - 1] = { role: 'assistant', content: full };
                  return updated;
                });
              }
            } catch {}
          }
        }
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error: Make sure Ollama is running.' }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(160deg,#faf7f0,#ede8dc)', fontFamily:'Georgia,serif' }}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-6px)}}
        .msg{animation:fadeUp 0.3s ease forwards}
        *{box-sizing:border-box;margin:0;padding:0}
        textarea:focus{outline:none}
        button{cursor:pointer;border:none;background:none;font-family:Georgia,serif}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:#c8a86b;border-radius:10px}
      `}</style>

      <div style={{ position:'sticky',top:0,zIndex:50,background:'rgba(250,247,240,0.95)',backdropFilter:'blur(12px)',borderBottom:'1px solid rgba(139,105,20,0.15)',padding:'0 24px',height:64,display:'flex',alignItems:'center',justifyContent:'space-between' }}>
        <div style={{ display:'flex',alignItems:'center',gap:10 }}>
          <div style={{ width:38,height:38,borderRadius:'50%',background:'linear-gradient(135deg,#5a7c45,#8B6914)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18 }}>🌿</div>
          <div>
            <div style={{ fontWeight:700,fontSize:20,color:'#2d5a1b' }}>Ayurahealth</div>
            <div style={{ fontSize:9,color:'#8B6914',letterSpacing:'0.15em',textTransform:'uppercase' }}>Powered by Local Llama</div>
          </div>
        </div>
        <div style={{ display:'flex',gap:6,flexWrap:'wrap',justifyContent:'flex-end' }}>
          {SYSTEMS.map(s => (
            <button key={s.id} onClick={() => setSystems(prev => prev.includes(s.id)?prev.filter(x=>x!==s.id):[...prev,s.id])}
              style={{ padding:'5px 12px',borderRadius:50,fontSize:11,fontWeight:600,border:`1.5px solid ${systems.includes(s.id)?s.color:'#d4c9b0'}`,background:systems.includes(s.id)?`${s.color}18`:'transparent',color:systems.includes(s.id)?s.color:'#9a8a78',transition:'all 0.2s' }}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth:780,margin:'0 auto',padding:'0 20px 180px' }}>
        {!started && (
          <div style={{ textAlign:'center',padding:'60px 0 40px',animation:'fadeUp 0.5s ease' }}>
            <div style={{ fontSize:52,marginBottom:16 }}>🌿</div>
            <h1 style={{ fontSize:'clamp(32px,5vw,52px)',fontWeight:700,color:'#2d5a1b',lineHeight:1.2,marginBottom:12 }}>
              Your Holistic<br/><em style={{ color:'#8B6914' }}>Health Companion</em>
            </h1>
            <p style={{ fontSize:15,color:'#6b6b4f',maxWidth:480,margin:'0 auto 32px',lineHeight:1.8,fontWeight:300 }}>
              Powered by your local Llama AI. Private, fast, and free. Ask any health question or describe your symptoms.
            </p>
            <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:10,maxWidth:600,margin:'0 auto' }}>
              {SAMPLES.map((q,i) => (
                <button key={i} onClick={() => send(q)}
                  style={{ padding:'12px 16px',borderRadius:12,border:'1px solid rgba(139,105,20,0.18)',background:'rgba(255,255,255,0.75)',textAlign:'left',fontSize:13,color:'#3d3d2e',lineHeight:1.5 }}>
                  💬 {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {started && (
          <div style={{ paddingTop:24,display:'flex',flexDirection:'column',gap:16 }}>
            {messages.map((m,i) => (
              <div key={i} className="msg" style={{ display:'flex',justifyContent:m.role==='user'?'flex-end':'flex-start' }}>
                {m.role==='assistant' && (
                  <div style={{ width:34,height:34,borderRadius:'50%',background:'linear-gradient(135deg,#5a7c45,#8B6914)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,flexShrink:0,marginRight:10,marginTop:4 }}>🌿</div>
                )}
                <div style={{ maxWidth:'78%',padding:m.role==='user'?'12px 18px':'16px 20px',borderRadius:m.role==='user'?'20px 20px 4px 20px':'4px 20px 20px 20px',background:m.role==='user'?'linear-gradient(135deg,#5a7c45,#3d5a2a)':'rgba(255,255,255,0.9)',border:m.role==='assistant'?'1px solid rgba(139,105,20,0.15)':'none',boxShadow:'0 2px 16px rgba(0,0,0,0.07)' }}>
                  <p style={{ color:m.role==='user'?'#fff':'#2d2d1a',fontSize:14,lineHeight:1.7,whiteSpace:'pre-wrap',margin:0 }}>{m.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="msg" style={{ display:'flex',alignItems:'flex-start',gap:10 }}>
                <div style={{ width:34,height:34,borderRadius:'50%',background:'linear-gradient(135deg,#5a7c45,#8B6914)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16 }}>🌿</div>
                <div style={{ padding:'16px 20px',borderRadius:'4px 20px 20px 20px',background:'rgba(255,255,255,0.9)',border:'1px solid rgba(139,105,20,0.15)' }}>
                  <div style={{ display:'flex',gap:4 }}>
                    {[0,1,2].map(i => <span key={i} style={{ width:7,height:7,borderRadius:'50%',background:'#8B6914',display:'inline-block',animation:`bounce 1.2s ${i*0.2}s infinite` }}/>)}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef}/>
          </div>
        )}
      </div>

      <div style={{ position:'fixed',bottom:0,left:'50%',transform:'translateX(-50%)',width:'100%',maxWidth:820,padding:'10px 20px 20px',background:'linear-gradient(to top,rgba(250,247,240,0.99) 70%,transparent)',zIndex:50 }}>
        <div style={{ display:'flex',alignItems:'flex-end',gap:10,background:'rgba(255,255,255,0.95)',border:'1.5px solid rgba(139,105,20,0.22)',borderRadius:20,padding:'10px 14px',boxShadow:'0 8px 32px rgba(139,105,20,0.14)',backdropFilter:'blur(16px)' }}>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();} }}
            placeholder="Describe your symptoms or ask a health question..."
            rows={1}
            style={{ flex:1,border:'none',background:'transparent',fontSize:14,color:'#2d2d1a',lineHeight:1.6,padding:'5px 0',resize:'none',maxHeight:120,fontFamily:'Georgia,serif' }}
            onInput={e => { const t=e.target as HTMLTextAreaElement;t.style.height='auto';t.style.height=Math.min(t.scrollHeight,120)+'px'; }}
          />
          <button onClick={() => send()} disabled={loading||!input.trim()}
            style={{ width:40,height:40,borderRadius:'50%',background:loading||!input.trim()?'#e0d8c8':'linear-gradient(135deg,#5a7c45,#8B6914)',color:'#fff',fontSize:18,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:loading?'none':'0 4px 14px rgba(90,124,69,0.4)',transition:'all 0.2s' }}>
            ✦
          </button>
        </div>
        <p style={{ textAlign:'center',marginTop:6,fontSize:10,color:'#b5a88a' }}>Powered by AyuraHealth AI 🌿 🌿</p>
      </div>
    </div>
  );
}
