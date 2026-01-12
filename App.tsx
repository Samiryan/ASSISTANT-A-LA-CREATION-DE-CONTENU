
import React, { useState, useEffect } from 'react';
import { Header, Container } from './components/Layout';
import { UserInput, Objective, Emotion, ContentStrategy, MarketingAngle, PersuasiveFramework } from './types';
import { GeminiService } from './services/geminiService';
import { ResultCard } from './components/ResultCard';

const ApiKeyModal: React.FC<{ onValid: (key: string) => void }> = ({ onValid }) => {
  const [key, setKey] = useState('');

  const handleSave = () => {
    if (key.trim().length > 10) {
      localStorage.setItem('gemini_api_key', key.trim());
      onValid(key.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
      <div className="bg-[#0a0a0a] border border-[#00F3FF]/30 w-full max-w-lg rounded-[2.5rem] p-8 md:p-12 shadow-[0_0_50px_rgba(0,243,255,0.15)] animate-in zoom-in duration-300">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#00F3FF] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(0,243,255,0.4)]">
            <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Configuration requise</h2>
          <p className="text-gray-400 text-sm">Veuillez renseigner votre clé API Gemini pour activer l'Architecte.</p>
        </div>

        <div className="space-y-6">
          <div className="group">
            <label className="text-[10px] font-black text-[#00F3FF] uppercase tracking-[0.2em] mb-2 block">Clé API Gemini</label>
            <input 
              type="password" 
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-black border border-[#1a1a1a] rounded-xl p-4 text-sm text-[#00F3FF] focus:border-[#00F3FF] outline-none transition-all glow-cyan"
            />
          </div>

          <button 
            onClick={handleSave}
            disabled={key.trim().length < 10}
            className="w-full py-4 bg-[#00F3FF] text-black font-black uppercase tracking-[0.3em] rounded-xl hover:bg-white transition-all glow-cyan-strong disabled:opacity-30 disabled:glow-none"
          >
            Activer l'Architecte
          </button>

          <div className="pt-6 border-t border-[#1a1a1a]">
            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Comment obtenir votre clé ?</h4>
            <ol className="text-[11px] text-gray-400 space-y-3">
              <li className="flex gap-3"><span className="text-[#00F3FF] font-bold">01.</span> Allez sur <a href="https://aistudio.google.com/" target="_blank" className="text-[#00F3FF] underline">Google AI Studio</a></li>
              <li className="flex gap-3"><span className="text-[#00F3FF] font-bold">02.</span> Connectez-vous avec votre compte Google</li>
              <li className="flex gap-3"><span className="text-[#00F3FF] font-bold">03.</span> Cliquez sur "Get API key" (barre latérale gauche)</li>
              <li className="flex gap-3"><span className="text-[#00F3FF] font-bold">04.</span> Cliquez sur "Create API key in new project"</li>
              <li className="flex gap-3"><span className="text-[#00F3FF] font-bold">05.</span> Copiez la clé et collez-la dans le champ ci-dessus</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [hasKey, setHasKey] = useState(false);
  const [step, setStep] = useState(1);
  const [input, setInput] = useState<UserInput>({
    rawIdea: '',
    persona: '',
    objective: Objective.ENGAGE,
    cta: '',
    brandColor: '#00F3FF',
    emotion: Emotion.CONFIDENCE,
    angle: MarketingAngle.EMOTIONAL,
    framework: PersuasiveFramework.AIDA,
  });

  const [loading, setLoading] = useState(false);
  const [clarifying, setClarifying] = useState(false);
  const [strategy, setStrategy] = useState<ContentStrategy | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) setHasKey(true);
  }, []);

  const handleClarify = async () => {
    if (!input.rawIdea) return;
    setClarifying(true);
    try {
      const refined = await GeminiService.clarifyIdea(input.rawIdea);
      setInput({ ...input, rawIdea: refined });
    } finally {
      setClarifying(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await GeminiService.generateStrategy(input);
      setStrategy(result);
      setStep(3);
    } catch (err) {
      setError("Erreur stratégique. Vérifiez votre clé API ou relancez l'architecte.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!hasKey) {
    return <ApiKeyModal onValid={() => setHasKey(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#050505]">
      <Header />
      <Container>
        {/* Navigation Étapes */}
        <div className="flex justify-center mb-10 gap-4">
          {[1, 2, 3].map((s) => (
            <button
              key={s}
              onClick={() => s <= (strategy ? 3 : 2) && setStep(s)}
              className={`px-4 py-2 rounded-full text-[10px] sm:text-xs font-bold transition-all uppercase tracking-widest ${
                step === s ? 'bg-[#00F3FF] text-black glow-cyan' : 'bg-[#1a1a1a] text-gray-500'
              }`}
            >
              Étape {s} : {s === 1 ? 'Analyse' : s === 2 ? 'Persuasion' : 'Production'}
            </button>
          ))}
        </div>

        <div className="max-w-6xl mx-auto">
          {step === 1 && (
            <div className="grid md:grid-cols-2 gap-8 animate-in slide-in-from-right-10 duration-500">
               <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-8 rounded-3xl space-y-6">
                 <h2 className="text-2xl font-black text-neon uppercase tracking-tighter">Phase 1 : L'Avatar</h2>
                 <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Qui est votre cible ?</label>
                      <input 
                        type="text" 
                        value={input.persona}
                        onChange={(e) => setInput({...input, persona: e.target.value})}
                        className="w-full bg-black border border-[#1a1a1a] rounded-xl p-4 text-sm focus:border-[#00F3FF] outline-none transition-colors"
                        placeholder="Ex: Freelances fatigués du salariat..."
                      />
                    </div>
                    <div className="relative">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Idée Brute (Le Brouillon)</label>
                      <textarea 
                        value={input.rawIdea}
                        onChange={(e) => setInput({...input, rawIdea: e.target.value})}
                        className="w-full h-40 bg-black border border-[#1a1a1a] rounded-xl p-4 text-sm focus:border-[#00F3FF] outline-none resize-none transition-colors"
                        placeholder="Votre idée en vrac..."
                      />
                      <button 
                        onClick={handleClarify}
                        disabled={clarifying || !input.rawIdea}
                        className="absolute bottom-4 right-4 bg-[#1a1a1a] text-[#00F3FF] px-3 py-1 rounded-lg text-[10px] font-bold border border-[#00F3FF]/20 hover:bg-[#00F3FF] hover:text-black transition-all flex items-center gap-2"
                      >
                        {clarifying ? (
                          <div className="w-2 h-2 border border-black border-t-transparent rounded-full animate-spin"></div>
                        ) : '✨'}
                        {clarifying ? 'Miroir...' : 'Clarifier (Technique Miroir)'}
                      </button>
                    </div>
                 </div>
                 <button onClick={() => setStep(2)} className="w-full py-4 bg-[#1a1a1a] text-white font-bold rounded-xl hover:border-[#00F3FF] border border-transparent transition-all uppercase text-xs tracking-widest">
                   Passer à la Stratégie →
                 </button>
               </div>
               <div className="flex flex-col justify-center p-8 opacity-50 hidden md:flex border-l border-[#1a1a1a]">
                 <p className="text-gray-400 text-lg leading-relaxed font-light italic">
                   "Le succès marketing commence par une compréhension viscérale de l'avatar. 
                   Ne vendez pas un produit, vendez une issue de secours à leur douleur actuelle."
                 </p>
                 <span className="mt-4 text-[#00F3FF] font-mono text-xs">— Omni Architect</span>
               </div>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="bg-[#0a0a0a] border border-[#1a1a1a] p-8 rounded-3xl space-y-8 animate-in slide-in-from-right-10 duration-500">
               <h2 className="text-2xl font-black text-neon uppercase tracking-tighter">Phase 2 : L'Architecte de Persuasion</h2>
               
               <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="lg:col-span-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Type de Contenu / Objectif</label>
                    <select 
                      value={input.objective} 
                      onChange={(e) => setInput({...input, objective: e.target.value as Objective})} 
                      className="w-full bg-black border border-[#1a1a1a] rounded-xl p-4 text-sm focus:border-[#00F3FF] outline-none"
                    >
                      {Object.values(Objective).map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Framework</label>
                    <select 
                      value={input.framework} 
                      onChange={(e) => setInput({...input, framework: e.target.value as PersuasiveFramework})} 
                      className="w-full bg-black border border-[#1a1a1a] rounded-xl p-4 text-sm focus:border-[#00F3FF] outline-none"
                    >
                      {Object.values(PersuasiveFramework).map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Angle Marketing</label>
                    <select 
                      value={input.angle} 
                      onChange={(e) => setInput({...input, angle: e.target.value as MarketingAngle})} 
                      className="w-full bg-black border border-[#1a1a1a] rounded-xl p-4 text-sm focus:border-[#00F3FF] outline-none"
                    >
                      {Object.values(MarketingAngle).map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
               </div>

               <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Émotion Dominante</label>
                    <select 
                      value={input.emotion} 
                      onChange={(e) => setInput({...input, emotion: e.target.value as Emotion})} 
                      className="w-full bg-black border border-[#1a1a1a] rounded-xl p-4 text-sm focus:border-[#00F3FF] outline-none"
                    >
                      {Object.values(Emotion).map(e => <option key={e} value={e}>{e}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Appel à l'Action (CTA)</label>
                    <input 
                      type="text" 
                      value={input.cta} 
                      onChange={(e) => setInput({...input, cta: e.target.value})} 
                      className="w-full bg-black border border-[#1a1a1a] rounded-xl p-4 text-sm focus:border-[#00F3FF] outline-none" 
                      placeholder="Ex: Réservez votre audit offert ou Téléchargez le guide"
                    />
                  </div>
               </div>

               <div className="pt-4">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Identité Visuelle (Couleur de marque)</label>
                  <div className="flex gap-4 items-center">
                     <div className="relative group">
                        <input 
                          type="color" 
                          value={input.brandColor} 
                          onChange={(e) => setInput({...input, brandColor: e.target.value})} 
                          className="h-14 w-14 bg-transparent border-none cursor-pointer rounded-full" 
                        />
                        <div className="absolute inset-0 rounded-full border-2 border-[#1a1a1a] pointer-events-none group-hover:border-[#00F3FF] transition-colors"></div>
                     </div>
                     <input 
                       type="text" 
                       value={input.brandColor} 
                       onChange={(e) => setInput({...input, brandColor: e.target.value})} 
                       className="flex-1 bg-black border border-[#1a1a1a] rounded-xl p-4 text-sm font-mono text-[#00F3FF] focus:border-[#00F3FF] outline-none" 
                     />
                  </div>
               </div>

               <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-5 bg-transparent border border-[#1a1a1a] text-gray-400 font-bold uppercase tracking-widest rounded-2xl hover:border-gray-600 transition-all"
                  >
                    ← Retour
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="flex-[2] py-5 bg-[#00F3FF] text-black font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-white transition-all glow-cyan-strong flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                    ) : 'Déployer l\'écosystème Transmédia'}
                  </button>
               </div>
               {error && <p className="text-red-500 text-xs text-center font-bold uppercase animate-pulse">{error}</p>}
            </form>
          )}

          {step === 3 && strategy && (
            <div className="space-y-8 animate-in fade-in duration-1000">
               <div className="bg-[#0a0a0a] border-l-4 border-[#00F3FF] p-8 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                 <h3 className="text-[#00F3FF] text-xs font-black uppercase tracking-[0.3em] mb-6 border-b border-[#1a1a1a] pb-4">Profil Psychologique de la Cible</h3>
                 <div className="grid md:grid-cols-3 gap-8">
                   <div className="space-y-4">
                     <h4 className="text-[#00F3FF] text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                       <span className="w-1 h-3 bg-[#00F3FF]"></span> Douleurs (Pains)
                     </h4>
                     <ul className="text-xs space-y-2 text-gray-400">
                       {strategy.avatar.pains.map((p, i) => <li key={i} className="flex gap-2"><span className="text-[#00F3FF]/50">0{i+1}</span>{p}</li>)}
                     </ul>
                   </div>
                   <div className="space-y-4">
                     <h4 className="text-red-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1 h-3 bg-red-500"></span> Peurs
                     </h4>
                     <ul className="text-xs space-y-2 text-gray-400">
                       {strategy.avatar.fears.map((f, i) => <li key={i} className="flex gap-2"><span className="text-red-500/50">0{i+1}</span>{f}</li>)}
                     </ul>
                   </div>
                   <div className="space-y-4">
                     <h4 className="text-green-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1 h-3 bg-green-500"></span> Désirs
                     </h4>
                     <ul className="text-xs space-y-2 text-gray-400">
                       {strategy.avatar.desires.map((d, i) => <li key={i} className="flex gap-2"><span className="text-green-500/50">0{i+1}</span>{d}</li>)}
                     </ul>
                   </div>
                 </div>
               </div>

               <div className="bg-[#00F3FF]/5 border border-[#00F3FF]/20 p-6 rounded-2xl text-center">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#00F3FF] mb-2 block">Angle Marketing Validé</span>
                  <h2 className="text-xl md:text-2xl font-black italic tracking-tight">"{strategy.marketingHook}"</h2>
               </div>

               <div className="grid lg:grid-cols-2 gap-8">
                  <ResultCard 
                    title="LinkedIn (Autorité)"
                    icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>}
                    content={strategy.linkedin.text}
                    subContent={strategy.linkedin.visualIdea}
                    visualPrompt={strategy.linkedin.visualPrompt}
                  />
                  <ResultCard 
                    title="TikTok / Reels (Viral)"
                    icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1.04-.1z"/></svg>}
                    content={`HOOK: ${strategy.tiktok.hook}\n\nSCRIPT:\n${strategy.tiktok.script}`}
                    visualPrompt={strategy.tiktok.visualPrompt}
                  />
                  <ResultCard 
                    title="Instagram (Aesthetic)"
                    icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>}
                    content={strategy.instagram.caption}
                    subContent={strategy.instagram.carouselIdea}
                    visualPrompt={strategy.instagram.visualPrompt}
                  />
                  <ResultCard 
                    title="Facebook (Engagement)"
                    icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>}
                    content={strategy.facebook.post}
                    subContent={strategy.facebook.visualIdea}
                    visualPrompt={strategy.facebook.visualPrompt}
                  />
               </div>
            </div>
          )}
        </div>
      </Container>
      
      <footer className="mt-20 border-t border-[#1a1a1a] py-12 text-center text-gray-600">
        <div className="flex justify-center gap-8 mb-4">
           <span className="text-[10px] tracking-[0.3em] uppercase">PAS Architecture</span>
           <span className="text-[10px] tracking-[0.3em] uppercase text-[#00F3FF]">AIDA Masterclass</span>
           <span className="text-[10px] tracking-[0.3em] uppercase">Transmedia ROI</span>
        </div>
        <p className="text-[9px] tracking-widest opacity-50 uppercase">OmniContent Architect — v2.1 Ultimate Strategy — © 2025</p>
      </footer>
    </div>
  );
};

export default App;
