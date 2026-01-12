
export enum Objective {
  SELL = 'Vendre',
  EDUCATE = 'Éduquer',
  ENGAGE = 'Engager',
  INFLUENCE = 'Influencer',
  STORYTELLING = 'Storytelling',
  INSPIRE = 'Inspirer',
  ENTERTAIN = 'Divertir',
  AUTHORITY = 'Autorité'
}

export enum Emotion {
  CONFIDENCE = 'Confiance',
  URGENCY = 'Urgence',
  JOY = 'Joie',
  MYSTERY = 'Mystère',
  LUXURY = 'Luxe'
}

export enum MarketingAngle {
  EMOTIONAL = 'Émotionnel',
  RATIONAL = 'Rationnel',
  IDENTITY = 'Identitaire'
}

export enum PersuasiveFramework {
  PAS = 'PAS (Problème, Amplification, Solution)',
  AIDA = 'AIDA (Attention, Intérêt, Désir, Action)'
}

export enum VisualStyle {
  LUXE_MINIMALIST = 'Luxe Minimaliste',
  EXPLOSIVE_ENERGY = 'Énergie Explosive',
  TECH_CYBER = 'Tech Cyber',
  PRO_CORPORATE = 'Professionnel Corporate',
  EMOTIONAL_STORY = 'Storytelling Émotionnel'
}

export interface AvatarAnalysis {
  pains: string[];
  fears: string[];
  desires: string[];
}

export interface ContentStrategy {
  avatar: AvatarAnalysis;
  refinedIdea: string;
  marketingHook: string;
  linkedin: {
    text: string;
    visualIdea: string;
    visualPrompt: string;
  };
  tiktok: {
    hook: string;
    script: string;
    visualPrompt: string;
  };
  instagram: {
    caption: string;
    carouselIdea: string;
    visualPrompt: string;
  };
  facebook: {
    post: string;
    visualIdea: string;
    visualPrompt: string;
  };
}

export interface UserInput {
  rawIdea: string;
  persona: string;
  objective: Objective;
  cta: string;
  brandColor: string;
  emotion: Emotion;
  angle: MarketingAngle;
  framework: PersuasiveFramework;
}
