import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const AIAgent = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  // Show initial message on first load
  useEffect(() => {
    const greeting = {
      type: 'bot',
      text: "👋 Hi there! I'm Dr.AI – your pet food and nutrition assistant. <br>🐶🐱 Let's talk! What pets or breeds do you have, and what are their dietary needs?"
    };
    setMessages([greeting]);
  }, []);

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
    <div className="container my-4 p-3 bg-light rounded shadow">
      <h2 className="text-center mb-4">
        🐾 <strong>Ask Dr.AI about Pet Food & Nutrition</strong> <br />
      </h2>

      <div className="mb-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`alert ${msg.type === 'user' ? 'alert-primary text-end' : 'alert-secondary text-start'}`}
            dangerouslySetInnerHTML={{ __html: msg.text }}
          />
        ))}
      </div>

      <form className="d-flex flex-column flex-sm-row gap-2" onSubmit={handleSubmit}>
        <input
          className="form-control"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about pet diets..."
        />
        <button className="btn btn-primary" type="submit">Send</button>
      </form>
    </div>
  );
};

export default AIAgent;
