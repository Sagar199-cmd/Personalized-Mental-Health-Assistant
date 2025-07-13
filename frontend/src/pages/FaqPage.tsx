import React from 'react';

const FaqPage: React.FC = () => {
  return (
    <div className="faq-page">
      <h1>Frequently Asked Questions</h1>
      <div className="faq-list">
        <div className="faq-item">
          <h3>What is this platform?</h3>
          <p>This platform allows you to track your mood and mental wellness over time.</p>
        </div>
        <div className="faq-item">
          <h3>How do I track my mood?</h3>
          <p>You can track your mood daily by filling out a quick mood questionnaire in your dashboard.</p>
        </div>
        {/* Add more FAQs as necessary */}
      </div>
    </div>
  );
};

export default FaqPage;
