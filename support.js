// ChatGPT-like AI assistant for ThaoVyStore
(function(){
  const chatWindow = document.getElementById('chatWindow');
  const input = document.getElementById('messageInput');
  const sendBtn = document.getElementById('sendBtn');
  const useAiToggle = document.getElementById('useAiToggle');

  // This client calls a server proxy at /api/support which holds the API key securely.
  // Make sure you run the provided proxy server and set OPENAI_API_KEY there.

  function appendMessage(text, from='bot'){
    const wrap = document.createElement('div'); wrap.className = 'msg ' + (from==='user'?'user':'bot');
    const b = document.createElement('div'); b.className = 'bubble ' + (from==='user'?'user':'bot');
    b.innerText = text; wrap.appendChild(b); chatWindow.appendChild(wrap); chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  // conversation history sent to remote API (kept in memory)
  const messages = [
    { role: 'system', content: 'Bạn là trợ lý hỗ trợ khách hàng cho ThaoVyStore. Trả lời ngắn gọn, thân thiện bằng tiếng Việt. Nếu người dùng cung cấp mã đơn hàng, hướng dẫn cách kiểm tra và chỉ ra cách xem trạng thái trên trang.' }
  ];

  async function callRemoteAi(messagesArray){
    try{
      const res = await fetch('http://localhost:3000/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messagesArray })
      });
      if(!res.ok){
        const t = await res.text(); throw new Error(res.status + ' ' + t);
      }
      const j = await res.json();
      if(j.error) throw new Error(j.error);
      return j.result || j.reply || JSON.stringify(j);
    }catch(e){
      throw e;
    }
  }

  async function handleSend(){
    const text = input.value.trim(); if(!text) return; input.value = '';
    appendMessage(text,'user');

    // require AI mode and API key for ChatGPT-like replies
    if(!useAiToggle.checked){
      appendMessage('Chức năng AI chưa bật. Bật "Kích hoạt AI" để nhận trả lời kiểu ChatGPT.', 'bot');
      return;
    }

    // append user message to conversation and call server proxy
    messages.push({ role: 'user', content: text });
    appendMessage('Đang trả lời...', 'bot');
    try{
      const reply = await callRemoteAi(messages);
      // remove placeholder 'Đang trả lời...' (last bot bubble)
      const lastBot = Array.from(chatWindow.querySelectorAll('.msg.bot')).pop();
      if(lastBot) lastBot.remove();
      // show assistant reply and add to history
      appendMessage(reply, 'bot');
      messages.push({ role: 'assistant', content: reply });
    }catch(e){
      const lastBot = Array.from(chatWindow.querySelectorAll('.msg.bot')).pop(); if(lastBot) lastBot.remove();
      appendMessage('Lỗi khi gọi dịch vụ AI: ' + (e.message||e), 'bot');
    }
  }

  sendBtn.addEventListener('click', handleSend);
  input.addEventListener('keydown', e=>{ if(e.key==='Enter') handleSend(); });

  // FAQ quick buttons: prefill input but do not trigger canned replies
  document.querySelectorAll('.faq').forEach(b=>b.addEventListener('click', e=>{ input.value = e.target.innerText; input.focus(); }));

  // preload welcome
  appendMessage('ChàO Bạn Mình Là RedQueen.', 'bot');
})();
