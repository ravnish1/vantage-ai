'use client';

import React, { useState } from 'react';
import styles from "./page.module.css";
import InterviewAgent from '@/components/InterviewAgent';
import Results from '@/components/Results';

type Phase = 'landing' | 'analyzing' | 'interview' | 'results';

interface Skill {
  name: string;
  required: number;
  estimated: number;
}

export default function Home() {
  const [phase, setPhase] = useState<Phase>('landing');
  const [skills, setSkills] = useState<Skill[]>([]);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jdText, setJdText] = useState('');

  const handleStart = async () => {
    if (!resumeFile || !jdText) {
      alert("Please upload a resume and paste a Job Description.");
      return;
    }

    setPhase('analyzing');

    // Simulate API call to /api/analyze
    // In a real scenario, we would use FormData
    setTimeout(() => {
      setSkills([
        { name: 'Python', required: 8, estimated: 5 },
        { name: 'React', required: 9, estimated: 7 },
        { name: 'SQL', required: 7, estimated: 8 },
        { name: 'Docker', required: 6, estimated: 3 }
      ]);
      setPhase('interview');
    }, 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  if (phase === 'interview') {
    return (
      <main className="container" style={{ padding: '4rem 0' }}>
        <InterviewAgent 
          skills={skills} 
          onComplete={(transcript) => {
            console.log("Interview Complete", transcript);
            setPhase('results');
          }} 
        />
      </main>
    );
  }

  if (phase === 'analyzing') {
    return (
      <main className={styles.hero}>
        <div className="container animate-fade-in">
          <div className="glass-card" style={{ padding: '4rem' }}>
            <h2 className="premium-gradient-text">Analyzing your profile...</h2>
            <p>Our AI is extracting skills from your resume and comparing them with the JD.</p>
            <div className={styles.loader} />
          </div>
        </div>
      </main>
    );
  }

  if (phase === 'results') {
    return (
      <main className="container" style={{ padding: '4rem 0' }}>
        <Results skills={skills} />
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <button className="btn-premium" onClick={() => setPhase('landing')}>
            Restart Assessment
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.hero}>
      <div className="container animate-fade-in">
        <h1 className="premium-gradient-text">Vantage</h1>
        <p>
          Beyond resumes. Test what you actually know, find your gaps, and get a 
          personalized roadmap to bridge them.
        </p>

        <div className={styles.uploadSection}>
          <div className={`${styles.card} glass-card`}>
            <h3>1. Upload Resume</h3>
            <label className={styles.dropzone}>
              <input 
                type="file" 
                onChange={handleFileUpload} 
                style={{ display: 'none' }} 
                accept=".pdf,.docx,.txt"
              />
              <svg 
                width="40" height="40" viewBox="0 0 24 24" fill="none" 
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" 
                strokeLinejoin="round" style={{ marginBottom: '1rem', opacity: 0.5 }}
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span>{resumeFile ? resumeFile.name : 'Drop your PDF or DOCX here'}</span>
            </label>
          </div>

          <div className={`${styles.card} glass-card`}>
            <h3>2. Job Description</h3>
            <textarea 
              className={styles.jdInput}
              placeholder="Paste the Job Description text here..."
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.actionArea}>
          <button className="btn-premium" onClick={handleStart}>
            Analyze & Start Interview
          </button>
        </div>
      </div>
    </main>
  );
}
