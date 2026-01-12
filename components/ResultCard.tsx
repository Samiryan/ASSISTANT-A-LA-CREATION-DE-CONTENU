
import React, { useState, useRef } from 'react';
import { GeminiService } from '../services/geminiService';

interface ResultCardProps {
  title: string;
  icon: React.ReactNode;
  content: string;
  subContent?: string;
  visualPrompt: string;
}

export const ResultCard: React.FC<ResultCardProps> = ({ title, icon, content, subContent, visualPrompt }) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Questionnaire en 4 points
  const [imgDetails, setImgDetails] = useState({
    context: '',
    style: 'Photographie professionnelle',
    nuances: 'Éclairage cinématique, accents néon cyan',
    equipment: '85mm f/1.8'
  });
  
  const [refImg, setRefImg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setRefImg(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateImage = async () => {
    setLoading(true);
    try {
      const imgUrl = await GeminiService.generateImage(visualPrompt, imgDetails, refImg || undefined);
      setImage(imgUrl);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl overflow-hidden hover:border-[#00F3FF]/30 transition-all flex flex-col h-full group">
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#1a1a1a] rounded-lg text-[#00F3FF] group-hover:bg-[#00F3FF] group-hover:text-black transition-colors">
              {icon}
            </div>
            <h3 className="font-bold text-lg uppercase tracking-wider">{title}</h3>
          </div>
          <button 
            onClick={handleCopy}
            className={`text-xs px-3 py-1 rounded-full border border-[#1a1a1a] hover:border-[#00F3FF] transition-all font-bold uppercase tracking-widest ${copied ? 'bg-[#00F3FF] text-black border-[#00F3FF]' : 'text-gray-400'}`}
          >
            {copied ? 'Copié !' : 'Copier'}
          </button>
        </div>

        <div className="flex-1 space-y-4">
          <div className="bg-[#050505] p-5 rounded-xl border border-[#1a1a1a] text-sm text-gray-300 leading-relaxed whitespace-pre-wrap min-h-[140px] shadow-inner">
            {content}
          </div>

          {subContent && (
            <div className="p-3 bg-[#00F3FF]/5 border border-[#00F3FF]/10 rounded-lg text-[11px] text-[#00F3FF] font-medium leading-tight italic">
              💡 STRATÉGIE VISUELLE : {subContent}
            </div>
          )}

          <div className="pt-4 border-t border-[#1a1a1a] space-y-4">
            {!image ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <h4 className="text-[10px] font-black text-[#00F3FF] uppercase tracking-[0.2em]">Configurer le rendu de l'image</h4>
                   <button 
                    onClick={() => fileRef.current?.click()}
                    className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded border transition-all ${refImg ? 'border-green-500 text-green-500 bg-green-500/10' : 'border-[#1a1a1a] text-gray-500 hover:text-[#00F3FF]'}`}
                  >
                    {refImg ? 'Référence OK' : '+ Référence'}
                  </button>
                  <input type="file" ref={fileRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-[#050505] p-4 rounded-xl border border-[#1a1a1a]">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">1. Contexte / Action</label>
                      <input 
                        type="text" 
                        placeholder="Que fait le sujet ? Où ?" 
                        value={imgDetails.context}
                        onChange={(e) => setImgDetails({...imgDetails, context: e.target.value})}
                        className="w-full bg-black border border-[#1a1a1a] rounded-lg p-2 text-xs text-white focus:border-[#00F3FF] outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">2. Esthétique / Style</label>
                      <select 
                        value={imgDetails.style}
                        onChange={(e) => setImgDetails({...imgDetails, style: e.target.value})}
                        className="w-full bg-black border border-[#1a1a1a] rounded-lg p-2 text-xs text-gray-400 focus:border-[#00F3FF] outline-none"
                      >
                        <option value="Photographie réaliste">Photographie réaliste</option>
                        <option value="Illustration 3D minimaliste">Illustration 3D minimaliste</option>
                        <option value="Peinture à l'huile moderne">Peinture à l'huile moderne</option>
                        <option value="Cyberpunk Digital Art">Cyberpunk Digital Art</option>
                        <option value="Studio Portrait">Studio Portrait</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">3. Nuances (Lumière & Couleurs)</label>
                      <input 
                        type="text" 
                        placeholder="Ambiance, lumière..." 
                        value={imgDetails.nuances}
                        onChange={(e) => setImgDetails({...imgDetails, nuances: e.target.value})}
                        className="w-full bg-black border border-[#1a1a1a] rounded-lg p-2 text-xs text-white focus:border-[#00F3FF] outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">4. Équipement</label>
                      <input 
                        type="text" 
                        placeholder="Objectif, type de caméra..." 
                        value={imgDetails.equipment}
                        onChange={(e) => setImgDetails({...imgDetails, equipment: e.target.value})}
                        className="w-full bg-black border border-[#1a1a1a] rounded-lg p-2 text-xs text-white focus:border-[#00F3FF] outline-none"
                      />
                    </div>
                </div>

                <button
                  onClick={handleGenerateImage}
                  disabled={loading}
                  className="w-full py-4 bg-[#00F3FF] text-black font-black uppercase text-[11px] tracking-[0.3em] rounded-2xl glow-cyan-strong hover:bg-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )}
                  {loading ? 'Traitement du Rendu...' : "Lancer la production visuelle"}
                </button>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden border border-[#1a1a1a] animate-in fade-in zoom-in duration-700 shadow-2xl">
                <img src={image} alt="Generated" className="w-full h-auto object-cover aspect-video" />
                <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                   <button 
                    onClick={() => setImage(null)}
                    className="bg-white text-black px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-[#00F3FF] transition-colors"
                  >
                    Régénérer
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
