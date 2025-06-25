export interface TranscriptData {
  id: string;
  content: string;
  fileName?: string;
  uploadedAt: Date;
  processedAt?: Date;
}

export interface ProcessingStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
}

export interface StreamingChunk {
  id: string;
  content: string;
  timestamp: Date;
  type: "data" | "error" | "complete";
}

export interface ParsedJsonValue {
  key: string;
  value: any;
  isNull: boolean;
  path: string;
}

export interface AppState {
  currentStep: number;
  transcriptData: TranscriptData | null;
  processedContent: string;
  streamingChunks: StreamingChunk[];
  parsedJson: ParsedJsonValue[];
  isProcessing: boolean;
  error: string | null;
}
