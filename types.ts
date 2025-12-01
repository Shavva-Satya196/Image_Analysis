export interface AnalysisResult {
  id: string;
  imageUrl: string;
  description: string;
  timestamp: number;
  fileName: string;
}

export interface AnalysisError {
  message: string;
  code?: string;
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export type ImageUploadHandler = (file: File) => Promise<void>;
