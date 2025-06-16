// src/components/FeedbackSection.js
import React from 'react';
import './css/FeedbackSection.css';

const FeedbackSection = ({ feedbackList }) => {
  return (
    <div className="feedback-section">
      <h3>Customer Feedback</h3>
      {feedbackList.length > 0 ? (
        feedbackList.map((fb, index) => (
          <div key={index} className="feedback-item">
            <strong>{fb.user}</strong>
            <p>{fb.comment}</p>
            <span className={`badge ${
              fb.sentiment === 'positive' ? 'bg-success' :
              fb.sentiment === 'negative' ? 'bg-danger' : 'bg-secondary'
            }`}>
              {fb.sentiment}
            </span>
          </div>
        ))
      ) : (
        <p>No feedback yet.</p>
      )}
    </div>
  );
};

export default FeedbackSection;
