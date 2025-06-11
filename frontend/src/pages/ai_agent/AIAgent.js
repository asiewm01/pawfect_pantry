import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

// Utility to get CSRF token from cookie
function getCSRFToken() {
  const name = 'csrftoken';
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const trimmed = cookie.trim();
    if (trimmed.startsWith(name + '=')) {
      return decodeURIComponent(trimmed.substring(name.length + 1));
    }
  }
  return null;
}

const AIAgent = () => {
  const [input, setInput] = useState('');
  const [file, setFile] = useState(null);
  const [messages, setMessages] = useState([]);

  // Initial greeting
  useEffect(() => {
    const greeting = {
      type: 'bot',
      text: "👋 Hi there! I'm Dr.AI – your pet food and nutrition assistant.<br>🐶🐱 Let's talk! What pets or breeds do you have, and what are their dietary needs?"
    };
    setMessages([greeting]);
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() && !file) return;

    const userMessage = file
      ? `📎 Sent file: ${file.name}`
      : input.trim();

    const newMessages = [...messages, { type: 'user', text: userMessage }];
    setMessages(newMessages);
    setInput('');
    setFile(null);

    try {
      const formData = new FormData();
      if (input.trim()) formData.append('message', input);
      if (file) formData.append('file', file);

      const res = await axios.post(
        'https://django-api.icypebble-e6a48936.southeastasia.azurecontainerapps.io/api/ai/agent/',
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
            'X-CSRFToken': getCSRFToken(),
          }
        }
      );

      const botReply = res.data.reply || "🤖 Sorry, I couldn't process that.";
      setMessages([...newMessages, { type: 'bot', text: botReply }]);

    } catch (err) {
      const errorText = err.response?.data?.error || "Unexpected error occurred.";
      setMessages([...newMessages, {
        type: 'bot',
        text: `❌ ${errorText}`
      }]);
    }
  };

  return (
    <div className="container-fluid min-vh-100 py-5 bg-light">
      <div className="container">
        <div className="row">
          {/* Left Column – AI Image */}
          <div className="col-md-4 d-none d-md-block text-center">
            <img
              src="/media/images/corgi-side-banner.png"
              alt="Dr.AI Assistant"
              className="img-fluid rounded shadow"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>

          {/* Right Column – Chat UI */}
          <div className="col-md-8">
            <div className="bg-white rounded shadow p-4">
              <h2 className="text-center mb-4">
                🐾 <strong>Ask Dr.AI about Pet Food & Nutrition</strong>
              </h2>

              {/* Chat Messages */}
              <div
                className="chat-area mb-3 p-3 rounded border bg-light overflow-auto"
                style={{ minHeight: '300px', maxHeight: '80vh' }}
              >
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`alert ${msg.type === 'user' ? 'alert-primary text-end' : 'alert-secondary text-start'}`}
                    dangerouslySetInnerHTML={{ __html: msg.text }}
                  />
                ))}
              </div>

              {/* Chat Form */}
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="d-flex flex-column flex-md-row gap-2 align-items-stretch">
                  <input
                    type="text"
                    className="form-control"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a question about pet diets..."
                  />

                  <input
                    type="file"
                    className="form-control"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    style={{ maxWidth: '250px' }}
                  />

                  <button type="submit" className="btn btn-primary">
                    Send
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAgent;
