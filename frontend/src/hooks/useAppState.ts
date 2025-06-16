import { useState, useCallback } from 'react';
import { AppState, TranscriptData, StreamingChunk, ParsedJsonValue } from '../types';

const initialState: AppState = {
  currentStep: 1,
  transcriptData: null,
  processedContent: '',
  streamingChunks: [],
  parsedJson: [],
  isProcessing: false,
  error: null,
};

export const useAppState = () => {
  const [state, setState] = useState<AppState>(initialState);

  const updateState = useCallback((updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const nextStep = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      currentStep: Math.min(prev.currentStep + 1, 3),
      error: null 
    }));
  }, []);

  const previousStep = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      currentStep: Math.max(prev.currentStep - 1, 1),
      error: null 
    }));
  }, []);

  const setTranscriptData = useCallback((data: TranscriptData) => {
    setState(prev => ({ ...prev, transcriptData: data, error: null }));
  }, []);

  const addStreamingChunk = useCallback((chunk: StreamingChunk) => {
    setState(prev => ({ 
      ...prev, 
      streamingChunks: [...prev.streamingChunks, chunk] 
    }));
  }, []);

  const clearStreamingChunks = useCallback(() => {
    setState(prev => ({ ...prev, streamingChunks: [] }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error, isProcessing: false }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    state,
    updateState,
    nextStep,
    previousStep,
    setTranscriptData,
    addStreamingChunk,
    clearStreamingChunks,
    setError,
    reset,
  };
};