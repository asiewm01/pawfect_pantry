import React, { useState, useRef, useEffect } from 'react';
import './css/ChatbotWidget.css';
import axios from 'axios';

const ChatbotWidget = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const toggleChatbot = () => setOpen(prev => !prev);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

      const introMessage = {
        type: 'bot',
        text: `<b>👋 Hello! My name is <span style="color:#007BFF;">B.A.R.K.L.E.Y.</span> – Bot Assistant for Recommending Kits, Listings & Engaging You.</b><br>Ask me anything about our store, products, or promotions! 🐾`
      };

      const isFirstInteraction = messages.length === 0;

      setMessages([
        ...updatedMessages,
        ...(isFirstInteraction ? [introMessage] : []),
        { type: 'bot', text: botReply }
      ]);
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
