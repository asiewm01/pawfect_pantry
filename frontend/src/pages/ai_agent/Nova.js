// src/pages/Nova.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/Nova.css';
import DashboardSidebar from '../../components/DashboardSidebar';

const Nova = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages([
      {
        type: 'bot',
        text: "👋 Hello! I'm Nova – your order support assistant. How can I help with your delivery, tracking, or order issues?"
      }
    ]);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, { type: 'user', text: input }]);
    setInput('');

    try {
      const response = await axios.post(
        'https://django-api.icypebble-e6a48936.southeastasia.azurecontainerapps.io/api/ai/nova/',
        { message: input },
        { withCredentials: true }
      );
      setMessages(prev => [...prev, { type: 'bot', text: response.data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        type: 'bot',
        text: "❌ Sorry, I couldn't reach Nova right now. Try again shortly!"
      }]);
    }
  };

  return (
<div className="nova-container container-fluid my-5 px-4">
  <div className="row flex-lg-nowrap">

    {/* Sidebar */}
    <div className="col-lg-3 col-md-12 mb-4">
      <DashboardSidebar />
    </div>

    {/* Nova Avatar */}
    <div className="col-lg-3 d-none d-md-flex justify-content-center">
      <div className="nova-avatar-box text-center">
        <img
          src="/media/images/Nova.png"
          alt="Nova Avatar"
          className="img-fluid rounded shadow nova-avatar-img"
        />
        <p className="mt-3 text-muted">Hi, I'm Nova! 👱‍♀️<br />Order support is my thing!</p>
      </div>
    </div>

    {/* Chat Interface */}
    <div className="col-lg-6 col-md-12">
      <h3 className="text-center mb-4">🛰️ Nova – Your Personal Help Desk</h3>

      <div id="nova-chat-box" className="chat-box mb-3 p-3 bg-white border rounded shadow-sm">
        {messages.map((msg, index) => (
          <div key={index} className={`text-${msg.type === 'bot' ? 'primary' : 'dark'} mb-2`}>
            <strong>{msg.type === 'bot' ? 'Nova:' : 'You:'}</strong> <br />
            <span dangerouslySetInnerHTML={{ __html: msg.text }} />
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="d-flex">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Type your order query here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="btn btn-primary">Send</button>
      </form>
    </div>
  </div>
</div>

  );
};

export default Nova;

