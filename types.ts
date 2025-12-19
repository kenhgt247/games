
export type ScreenType = 'LOBBY' | 'START' | 'PLAYING' | 'CELEBRATION' | 'FINISH';

export interface Option {
  id: string;
  label: string;
  icon: string;
  color: string;
  isCorrect: boolean;
}

export interface LevelConfig {
  id: number;
  title: string;
  instruction: string;
  options: Option[];
}

export interface GameDefinition {
  id: string;
  title: string;
  ageRange: string;
  category: 'English' | 'Math' | 'Vietnamese' | 'Logic';
  icon: string;
  themeColor: string;
  levels: LevelConfig[];
}

export interface GameState {
  selectedGameId: string | null;
  currentLevelIndex: number;
  score: number;
  isSoundEnabled: boolean;
  screen: ScreenType;
}
