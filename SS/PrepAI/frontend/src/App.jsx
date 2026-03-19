import { useState, useEffect } from 'react';
import { generateAcademicRoadmap } from './services/aiEngine';
import { subscriptionService } from './services/subscription';
import './index.css';

export default function App() {
  const [currentGrade, setCurrentGrade] = useState(11);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [aiData, setAiData] = useState(null);
  const [metaInfo, setMetaInfo] = useState(null);
  const [tierInfo, setTierInfo] = useState(null);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    setMounted(true);
    
    // Simulate fetching user profile
    const fetchProfile = async () => {
      setLoading(true);
      setTierInfo(subscriptionService.getCurrentTier());
      setActivities(subscriptionService.currentUser.activityLedger);
      setLoading(false);
      
      // Auto-trigger the generation sequence upon load
      handleGenerateRoadmap("Ivy Plus");
    };

    fetchProfile();
  }, []);

  const handleGenerateRoadmap = async (tier) => {
    setGenerating(true);
    const profile = {
      grade: 11,
      targetMajors: ["STEM"],
      targetTier: tier,
      courses: ["AP Calculus BC", "AP Physics 1"]
    };
    
    // The RAG + LLM Inference Call
    const response = await generateAcademicRoadmap(profile);
    setAiData(response.payload);
    setMetaInfo(response.generation_metadata);
    setGenerating(false);
  };

  const handleAddActivity = (activityStr) => {
    const newLedger = subscriptionService.logActivity({ title: activityStr });
    setActivities([...newLedger]);
  };

  const progressPercentage = ((currentGrade - 6) / (12 - 6)) * 100;

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      <header className="header glass">
        <div>
          <h1 style={{ margin: 0, fontSize: '1.25rem' }}>PrepAI Pathfinder</h1>
          <span className="badge">Student ID #7X9A (STEM)</span>
        </div>
        <div style={{ background: 'var(--surface)', padding: '0.5rem', borderRadius: '50%', cursor: 'pointer' }}>
          🧑‍🎓
        </div>
      </header>

      <main className="content">
        <section className="animate-in" style={{ animationDelay: '0.1s' }}>
          <div className="card glass">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600 }}>Grade {currentGrade} Journey</span>
              <span className={`badge ${tierInfo?.id === 'premium' ? 'badge-premium' : ''}`}>
                {tierInfo?.name} Tier
              </span>
            </div>
            
            <div className="progress-container">
              <div 
                className="progress-bar" 
                style={{ width: mounted ? `${progressPercentage}%` : '0%' }}
              />
            </div>
          </div>
        </section>

        {generating && (
          <section className="animate-in" style={{ marginTop: '2rem', textAlign: 'center' }}>
            <div className="spinner" style={{ margin: '0 auto', borderColor: 'var(--accent)', borderTopColor: 'transparent' }}></div>
            <p style={{ marginTop: '1rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>
              Agent initializing RAG context and generating personalized roadmap...
            </p>
          </section>
        )}

        {aiData && metaInfo && !generating && (
          <>
            {/* Grounding RAG Context Meta Component */}
            <section className="animate-in" style={{ animationDelay: '0.05s', marginTop: '1rem' }}>
              <div className="card glass" style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                    🟢 Agentic Engine Grounding
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{metaInfo.llm_model}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                  <strong>Source:</strong> {metaInfo.grounding_source} <br/>
                  <strong>Log:</strong> {metaInfo.rag_log} <br/>
                  <span style={{color: 'grey', fontSize: '0.7rem'}}>PII Scrubber: {metaInfo.pii_scrubbed}</span>
                </div>
              </div>
            </section>

            {/* Target University Toggle */}
            <section className="animate-in" style={{ marginTop: '1rem' }}>
               <h3 style={{ fontSize: '1rem' }}>Adjust Target Tier Constraint:</h3>
               <div style={{ display: 'flex', gap: '0.5rem' }}>
                 <button className="btn" style={{ padding: '0.5rem', background: 'var(--surface)' }} onClick={() => handleGenerateRoadmap("State Flagship")}>State Flagship</button>
                 <button className="btn" style={{ padding: '0.5rem', background: 'var(--surface)' }} onClick={() => handleGenerateRoadmap("Ivy Plus")}>Ivy Plus Tech</button>
               </div>
            </section>

            {/* AI Strategy Summary Component */}
            <section className="animate-in" style={{ animationDelay: '0.1s', marginTop: '1.5rem' }}>
              <h3>AI Strategy Summary</h3>
              <div className="card glass" style={{ borderLeft: '4px solid var(--primary)' }}>
                <p style={{ margin: 0, fontSize: '0.95rem', fontStyle: 'italic', color: 'var(--text-primary)', lineHeight: '1.6' }}>
                  "{aiData.summary}"
                </p>
              </div>
            </section>

            {/* Academic Roadmap Component */}
            <section className="animate-in" style={{ animationDelay: '0.2s', marginTop: '2rem' }}>
              <h3>Academic Roadmap</h3>
              {aiData.academic_roadmap.map((milestone, idx) => (
                <div key={idx} className="card glass" style={{ marginBottom: '1rem', borderLeft: '4px solid var(--secondary)' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>{milestone.grade} - {milestone.focus}</h4>
                  
                  <div style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    <strong>Math Hook:</strong> {milestone.math_course}
                  </div>
                  <div style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    <strong>Testing Milestone:</strong> {milestone.testing_milestone}
                  </div>
                  <div style={{ fontSize: '0.85rem' }}>
                    <strong>Extracurricular:</strong> {milestone.extracurricular_goal}
                  </div>
                </div>
              ))}
            </section>

            {/* Holistic Profile Component */}
            <section className="animate-in" style={{ animationDelay: '0.3s', marginTop: '2rem' }}>
               <h3>Holistic Profile Builder</h3>
               
               {/* The Spike */}
               <div className="card glass" style={{ borderLeft: '4px solid var(--accent)', marginBottom: '1rem' }}>
                 <h4 style={{ margin: '0 0 0.5rem 0' }}>💡 Your "Spike"</h4>
                 <p style={{ fontSize: '0.9rem', marginBottom: '0rem', color: 'var(--text-primary)' }}>
                   {aiData.holistic_profile.the_spike}
                 </p>
               </div>
               
               {/* Volunteering List */}
              <div className="card glass" style={{ marginBottom: '1rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem' }}>Suggested Volunteering</h4>
                <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                 {aiData.holistic_profile.volunteering.map((v, i) => (
                   <li key={i} style={{ marginBottom: '0.5rem' }}>
                     {v} <button className="badge" style={{ border: 'none', cursor: 'pointer', float: 'right' }} onClick={() => handleAddActivity(v)}>Add</button>
                   </li>
                 ))}
                 </ul>
              </div>

               {/* Render the Ledger */}
               {activities.length > 0 && (
                 <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--surface)', borderRadius: '8px' }}>
                   <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>Activity Ledger ({activities.length})</h4>
                   <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                     {activities.map((a, i) => (
                       <li key={i}>{a.title} {a.verified ? '✅' : '⏳(Pending Verif.)'}</li>
                     ))}
                   </ul>
                 </div>
               )}
             </section>
          </>
        )}
      </main>
      <style>{`
        .spinner { border: 4px solid var(--surface); border-top: 4px solid var(--primary); border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}
