'use client';

import React, { useState, useCallback } from 'react';
import styles from './InterviewAgent.module.css';

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

interface Skill {
  name: string;
  required: number;
  estimated: number;
}

interface InterviewAgentProps {
  skills: Skill[];
  onComplete: (transcript: Message[]) => void;
}

export default function InterviewAgent({ skills, onComplete }: InterviewAgentProps) {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: `Hi! I'm your AI assessment agent. Let's start with **${skills[0].name}**. Can you tell me about your experience with it?` 
    }
  ]);
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const addAssistantMessage = useCallback((content: string) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content }]);
      setIsTyping(false);
    }, 1000);
  }, []);


  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');

    // Here we would call the AI to evaluate and ask the next question
    // For now, let's simulate the flow
    setIsTyping(true);
    
    // Simulate API call
    setTimeout(() => {
      if (currentSkillIndex < skills.length - 1) {
        const nextSkill = skills[currentSkillIndex + 1].name;
        setCurrentSkillIndex(prev => prev + 1);
        addAssistantMessage(`Got it. Now let's talk about **${nextSkill}**. [Simulated Question]`);
      } else {
        addAssistantMessage("Great! We've covered all skills. Calculating your results now...");
        setTimeout(() => onComplete(messages), 2000);
      }
    }, 1500);
  };

  return (
    <div className={`${styles.container} glass-card animate-fade-in`}>
      <div className={styles.header}>
        <h3>Assessment in Progress</h3>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill} 
            style={{ width: `${((currentSkillIndex + 1) / skills.length) * 100}%` }}
          />
        </div>
      </div>

      <div className={styles.chatArea}>
        {messages.map((m, i) => (
          <div key={i} className={`${styles.message} ${styles[m.role]}`}>
            <div className={styles.bubble}>
              {m.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className={`${styles.message} ${styles.assistant}`}>
            <div className={styles.bubble}>...</div>
          </div>
        )}
      </div>

      <div className={styles.inputArea}>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your answer here..."
          className={styles.input}
        />
        <button onClick={handleSend} className="btn-premium">Send</button>
      </div>
    </div>
  );
}
