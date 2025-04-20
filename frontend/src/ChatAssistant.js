import React, { useRef, useEffect } from 'react';
import './App.css';

const ChatAssistant = ({ messages, onSendMessage, inputValue, onInputChange, loading }) => {
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="chat-messages" ref={chatContainerRef}>
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`chat-message ${msg.sender === 'user' || msg.role === 'user' ? 'chat-message-user' : 'chat-message-ai'}`}
          >
            <div className="message-content">
              {msg.text || msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="chat-message chat-message-ai">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={onSendMessage} className="chat-input-form">
        <input
          type="text"
          value={inputValue}
          onChange={onInputChange}
          placeholder="Ask about crypto portfolio optimization..."
          className="chat-input"
          disabled={loading}
        />
        <button type="submit" className="chat-send-button" disabled={loading || !inputValue.trim()}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatAssistant;