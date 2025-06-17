const chatWindow = document.getElementById('chat-window');
const input = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const STORAGE_KEY = 'nova_chat_history';

window.addEventListener('DOMContentLoaded', () => {
  const history = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  chatWindow.innerHTML = '';
  history.forEach(msg => renderMessage(msg));
  chatWindow.scrollTop = chatWindow.scrollHeight;
});

sendBtn.addEventListener('click', sendMessage);
input.addEventListener('keydown', e => {
  if (e.key === 'Enter') sendMessage();
});

async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;
  const userMsg = { role: 'user', text };
  saveAndRender(userMsg);
  input.value = '';
  const botText = await getGeminiResponse(text);
  const botMsg = { role: 'bot', text: botText };
  saveAndRender(botMsg);
}

function saveAndRender(msg) {
  const history = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  history.push(msg);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  renderMessage(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function renderMessage(msg) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `flex items-end gap-3 ${msg.role === 'user' ? 'justify-end' : ''} animate-fade-in`;
  if (msg.role === 'user') {
    msgDiv.innerHTML = `
      <div class="bg-[#1e5c5c] text-white px-5 py-3 rounded-2xl max-w-xs md:max-w-md shadow transition-all">${escapeHTML(msg.text)}</div>
      <span class="w-9 h-9 rounded-full bg-[#283046] flex items-center justify-center">
        <svg class="w-5 h-5 text-[#b0b8c9]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <circle cx="12" cy="8" r="4"/>
          <path d="M6 20c0-2.2 3.6-3.5 6-3.5s6 1.3 6 3.5"/>
        </svg>
      </span>
    `;
  } else {
    msgDiv.innerHTML = `
      <span class="w-9 h-9 rounded-full bg-[#283046] flex items-center justify-center">
        <svg class="w-5 h-5 text-[#b0b8c9]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <circle cx="12" cy="8" r="4"/>
          <path d="M6 20c0-2.2 3.6-3.5 6-3.5s6 1.3 6 3.5"/>
        </svg>
      </span>
      <div class="bg-[#232b3b] text-white px-5 py-3 rounded-2xl max-w-xs md:max-w-md shadow transition-all">${escapeHTML(msg.text)}</div>
    `;
  }
  chatWindow.appendChild(msgDiv);
  setTimeout(() => {
    chatWindow.scrollTo({ top: chatWindow.scrollHeight, behavior: 'smooth' });
  }, 50);
}

async function getGeminiResponse(userText) {
  const res = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userText })
  });
  const data = await res.json();
  return data.text;
}

function escapeHTML(str) {
  return str.replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[m]);
}