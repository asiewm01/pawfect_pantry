import React, { useState } from 'react';
import './css/AIAgent.css';
import axios from 'axios';

const AIAgent = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { type: 'user', text: input }];
    setMessages(newMessages);
    setInput('');

    try {
      const res = await axios.post(
        'https://django-api.icypebble-e6a48936.southeastasia.azurecontainerapps.io/api/ai/agent/',
        { message: input },
        { withCredentials: true }
      );
      const botReply = res.data.reply || "🤖 Sorry, I couldn't process that.";
      setMessages([...newMessages, { type: 'bot', text: botReply }]);
    } catch (err) {
      setMessages([...newMessages, {
        type: 'bot',
        text: "❌ Error connecting to AI agent."
      }]);
    }
  };

  return (
    <div className="ai-agent-container">
      <h2 className="ai-agent-title">🐾 Ask About Pet Nutrition</h2>
      <div className="ai-agent-messages">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`ai-message ai-${msg.type}`}
            dangerouslySetInnerHTML={{ __html: msg.text }}
          />
        ))}
      </div>
      <form className="ai-agent-form" onSubmit={handleSubmit}>
        <input
          className="ai-agent-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about pet diets..."
        />
        <button className="ai-agent-send" type="submit">Send</button>
      </form>
    </div>
  );
};

export default AIAgent;
