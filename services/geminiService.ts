
import { GoogleGenAI, Type } from "@google/genai";
import { UserInput, ContentStrategy } from "../types";

export class GeminiService {
  private static getClient() {
    // Priorité à la clé saisie par l'utilisateur dans le localStorage
    const userKey = localStorage.getItem('gemini_api_key');
    const apiKey = userKey || process.env.API_KEY || '';
    return new GoogleGenAI({ apiKey });
  }

  static async clarifyIdea(idea: string): Promise<string> {
    const ai = this.getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Utilise la technique du "Miroir" pour reformuler et clarifier cette idée brute tout en conservant l'intention originale. Rends-la percutante et professionnelle en moins de 100 mots. Idée : ${idea}`,
    });
    return response.text || idea;
  }

  static async generateStrategy(input: UserInput): Promise<ContentStrategy> {
    const ai = this.getClient();
    const prompt = `
      Tu es "OmniContent Architect", expert en stratégie marketing de haut niveau.
      
      CONTEXTE DU BRIEF :
      - Idée : ${input.rawIdea}
      - Cible : ${input.persona}
      - Type de Contenu / Objectif : ${input.objective}
      - CTA : ${input.cta}
      - Angle Marketing : ${input.angle}
      - Framework : ${input.framework}
      - Émotion : ${input.emotion}
      - Couleur de marque : ${input.brandColor}

      ÉTAPE 1 : ANALYSE D'AVATAR
      Identifie 3 points pour chaque : Douleurs (Pains), Peurs, Désirs basés sur la psychologie de la cible.

      ÉTAPE 2 : STRATÉGIE TRANS-MÉDIA
      Applique rigoureusement le framework ${input.framework} et adapte le ton pour :
      - LinkedIn : Focus expertise, autorité.
      - TikTok : Script 15s, hook immédiat, rythme soutenu.
      - Instagram : Storytelling visuel, émotion.
      - Facebook : Focus engagement communautaire, partage et storytelling de proximité.

      ÉTAPE 3 : PROMPTS IMAGES SIGNATURE
      Crée des prompts spécifiques : [Sujet], [Action], [Style : ${input.emotion}], [Éclairage], [Palette : ${input.brandColor}, Noir, Blanc].

      RETOURNE EXCLUSIVEMENT DU JSON :
      {
        "avatar": { "pains": [], "fears": [], "desires": [] },
        "refinedIdea": "...",
        "marketingHook": "Le grand titre accrocheur",
        "linkedin": { "text": "...", "visualIdea": "...", "visualPrompt": "..." },
        "tiktok": { "hook": "...", "script": "...", "visualPrompt": "..." },
        "instagram": { "caption": "...", "carouselIdea": "...", "visualPrompt": "..." },
        "facebook": { "post": "...", "visualIdea": "...", "visualPrompt": "..." }
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.8,
      },
    });

    try {
      const text = response.text || '{}';
      return JSON.parse(text);
    } catch (error) {
      console.error("Failed to parse Gemini response:", error);
      throw new Error("Invalid response from AI");
    }
  }

  static async generateImage(prompt: string, details: { context: string, style: string, nuances: string, equipment: string }, referenceImageBase64?: string): Promise<string> {
    const ai = this.getClient();
    
    const fullPrompt = `
      Generate a high-end visual asset based on this core concept: ${prompt}.
      
      TECHNICAL SPECIFICATIONS:
      1. Context/Action: ${details.context}
      2. Aesthetic/Style: ${details.style}
      3. Nuances (Light/Colors): ${details.nuances}
      4. Equipment/Technical: ${details.equipment || 'Professional lens, sharp focus'}
      
      Final polish: 8k resolution, cinematic masterpiece, commercial quality.
    `;
    
    const parts: any[] = [{ text: fullPrompt }];

    if (referenceImageBase64) {
      const base64Data = referenceImageBase64.split(',')[1] || referenceImageBase64;
      parts.unshift({
        inlineData: {
          mimeType: 'image/png',
          data: base64Data,
        },
      });
      parts.push({ text: "Use the provided image for composition and primary subject structure." });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts },
      config: { imageConfig: { aspectRatio: "16:9" } }
    });

    const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
    if (part?.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
    throw new Error("Image Generation Failed.");
  }
}
