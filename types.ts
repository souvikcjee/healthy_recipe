export interface HealthProfile {
  age: number;
  sex: 'Male' | 'Female' | 'Other';
  conditions: string;
  goal: 'Weight Loss' | 'Maintenance' | 'Muscle Gain' | 'General Health';
}

export interface AnalysisResult {
  ingredients: string[];
  rawAnalysis: string;
}

export interface RecipeSuggestion {
  content: string;
  groundingLinks: GroundingLink[];
}

export interface GroundingLink {
  title: string;
  url: string;
}

export enum AppState {
  IDLE,
  ANALYZING_IMAGE,
  GENERATING_RECIPE,
  SUCCESS,
  ERROR
}
