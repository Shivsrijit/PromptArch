
export interface SavedPrompt {
  id: string;
  userId?: string;
  name: string;
  text: string;
  sourceImageUrl?: string;
  attributes?: string[];
  createdAt: number;
}

export interface PublicPrompt extends SavedPrompt {
  likes: number;
  author: string;
}

export enum AppMode {
  HOME = 'HOME',
  REVERSE_ENGINEER = 'REVERSE_ENGINEER',
  IMAGE_GEN = 'IMAGE_GEN',
  MY_LIBRARY = 'MY_LIBRARY',
  STYLE_TRANSFER = 'STYLE_TRANSFER',
  TRENDING_FEED = 'TRENDING_FEED'
}

export interface ImageAdjustments {
  brightness: number;
  contrast: number;
  rotation: number;
  scale: number;
  offsetX: number;
  offsetY: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface AnalysisResult {
  prompt: string;
  attributes: string[];
}
