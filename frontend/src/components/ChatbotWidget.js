import React, { useState, useRef, useEffect } from 'react';
import './css/ChatbotWidget.css';
import axios from 'axios';

const ChatbotWidget = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const toggleChatbot = () => setOpen(prev => !prev);

  // Auto-scroll to bottom on message update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-open and greet after login
useEffect(() => {
  const timer = setTimeout(() => {
    setOpen(true);
    if (messages.length === 0) {
      const welcomeMsg = {
        type: 'bot',
        text: `<b>👋 Hello! I'm <span style="color:#007BFF;">B.A.R.K.L.E.Y.</span> – <br> Bot Assistant for Recommending Kits, Listings & Engaging You.</b>
        <br><br>
        Ask me anything about our store, products, or promotions! 🐾
        <br><br>
        You can also <span class="chatbot-close-link" style="color:#007BFF; cursor:pointer;">close</span> this tab and come back later ! I will be here anytime when you need me !` 
      };
      setMessages([welcomeMsg]);

      setTimeout(() => {
        const closeLink = document.querySelector('.chatbot-close-link');
        if (closeLink) {
          closeLink.addEventListener('click', () => setOpen(false));
        }
      }, 100);
    }
  }, 1000);

  return () => clearTimeout(timer);
}, [messages.length]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    const userInput = input.trim();
    if (!userInput) return;

    const updatedMessages = [...messages, { type: 'user', text: userInput }];
    setMessages(updatedMessages);
    setInput('');

    try {
      const endpoint = `https://django-api.icypebble-e6a48936.southeastasia.azurecontainerapps.io/api/ai/chatbot/`;
      const response = await axios.post(endpoint, { message: userInput }, { withCredentials: true });

      const botReply = response.data.reply || "❓ Sorry, I didn't understand that.";
      setMessages([...updatedMessages, { type: 'bot', text: botReply }]);
    } catch (err) {
      const errorMessage =
        err.response?.status === 401
          ? "🔒 Please log in to use BARKLEY ChatBot. You can log in from the top-right menu."
          : "⚠️ Something went wrong. Please try again later.";

      setMessages([...updatedMessages, { type: 'bot', text: errorMessage }]);
    }
  };

  return (
    <>
      <button id="chatbot-toggle" onClick={toggleChatbot}>
        <div className="chatbot-icon">💬</div>
      </button>

      {open && (
        <div id="chatbot-box">
          <div id="chatbot-header">🐾 BARKLEY ChatBot</div>

          <div id="chatbot-messages">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`chatbot-message chatbot-${msg.type}`}
                dangerouslySetInnerHTML={{ __html: msg.text }}
              ></div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form id="chatbot-form" onSubmit={handleSubmit}>
            <input
              type="text"
              id="chatbot-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask BARKLEY about products, promos, or categories..."
              required
            />
            <button type="submit" id="chatbot-send">➤</button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;
