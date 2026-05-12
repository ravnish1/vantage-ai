'use client';

import React from 'react';
import SkillChart from './SkillChart';
import styles from './Results.module.css';

interface Skill {
  name: string;
  required: number;
  estimated: number;
}

interface ResultsProps {
  skills: Skill[];
}

export default function Results({ skills }: ResultsProps) {
  // Mock learning roadmap data
  const roadmap = skills.filter(s => s.estimated < s.required).map(s => ({
    skill: s.name,
    gap: s.required - s.estimated,
    resources: [
      { name: `${s.name} Official Documentation`, url: '#' },
      { name: `Advanced ${s.name} Course`, url: '#' }
    ],
    project: `Build a real-world ${s.name} application focusing on [specific feature].`
  }));

  return (
    <div className="animate-fade-in">
      <div className="glass-card" style={{ padding: '3rem', marginBottom: '3rem' }}>
        <h2 className="premium-gradient-text" style={{ marginBottom: '2rem', textAlign: 'center' }}>
          Skill Analysis Report
        </h2>
        <SkillChart skills={skills} />
      </div>

      <div className={styles.grid}>
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3>Top Strengths</h3>
          <ul className={styles.list}>
            {skills.sort((a, b) => b.estimated - a.estimated).slice(0, 2).map(s => (
              <li key={s.name}>
                <strong>{s.name}</strong> - Proficiency: {s.estimated}/10
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3>Critical Gaps</h3>
          <ul className={styles.list}>
            {skills.sort((a, b) => (b.required - b.estimated) - (a.required - a.estimated)).slice(0, 2).map(s => (
              <li key={s.name}>
                <strong>{s.name}</strong> - Gap: {s.required - s.estimated} points
              </li>
            ))}
          </ul>
        </div>
      </div>

      <h2 className="premium-gradient-text" style={{ margin: '4rem 0 2rem' }}>
        Your Personalized Learning Path
      </h2>
      
      <div className={styles.roadmap}>
        {roadmap.map((step, i) => (
          <div key={step.skill} className={`${styles.roadmapStep} glass-card`}>
            <div className={styles.stepNumber}>{i + 1}</div>
            <div className={styles.stepContent}>
              <h3>Master {step.skill}</h3>
              <p>To bridge the {step.gap}-point gap, focus on these resources:</p>
              <div className={styles.resourceLinks}>
                {step.resources.map(r => (
                  <a key={r.name} href={r.url} className={styles.resourceBtn}>{r.name}</a>
                ))}
              </div>
              <div className={styles.practiceProject}>
                <strong>Practice Project:</strong>
                <p>{step.project}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
