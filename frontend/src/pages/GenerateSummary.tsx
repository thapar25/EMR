import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Edit3, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { StreamingChunk, TranscriptData, AppState } from '../types';
import { ApiService } from '../services/api';

interface GenerateSummaryProps {
  transcriptData: TranscriptData | null;
  onNext: (content: string) => void;
  onPrevious: () => void;
  streamingChunks: StreamingChunk[];
  isProcessing: boolean;
  onAddChunk: (chunk: StreamingChunk) => void;
  onClearChunks: () => void;
  onSetError: (error: string | null) => void;
  updateState: (updates: Partial<AppState>) => void;
}

export const GenerateSummary: React.FC<GenerateSummaryProps> = ({
  transcriptData,
  onNext,
  onPrevious,
  streamingChunks,
  isProcessing,
  onAddChunk,
  onClearChunks,
  onSetError,
  updateState,
}) => {
  const navigate = useNavigate();
  const [editableContent, setEditableContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [streamingComplete, setStreamingComplete] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const streamInitiatedRef = useRef(false);
  const apiService = ApiService.getInstance();

  useEffect(() => {
    if (transcriptData && !isStreaming && streamingChunks.length === 0 && !streamInitiatedRef.current) {
      streamInitiatedRef.current = true;
      startSummaryStream();
    }
  }, [transcriptData]);

  const startSummaryStream = async () => {
    if (!transcriptData?.content) return;

    setIsStreaming(true);
    onClearChunks();
    setStreamingComplete(false);
    onSetError(null);

    try {
      const stream = await apiService.getSummaryStream(transcriptData.content);
      
      if (!stream) {
        const mockStream = apiService.createMockStream();
        await processStream(mockStream);
        return;
      }

      await processStream(stream);
    } catch (error) {
      console.error('Streaming error:', error);
      onSetError('Failed to generate summary. Please try again.');
      setIsStreaming(false);
    }
  };

  const processStream = async (stream: ReadableStream<Uint8Array>) => {
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim()) {
            try {
              const parsed = JSON.parse(line);
              if (parsed.delta) {
                const chunk: StreamingChunk = {
                  id: Date.now().toString() + Math.random(),
                  content: parsed.delta,
                  timestamp: new Date(),
                  type: 'data',
                };
                onAddChunk(chunk);
              }
            } catch (parseError) {
              console.warn('Failed to parse chunk:', line);
            }
          }
        }
      }

      setStreamingComplete(true);
      setIsStreaming(false);
    } catch (error) {
      console.error('Stream processing error:', error);
      onSetError('Error processing summary stream');
      setIsStreaming(false);
    }
  };

  const combinedContent = streamingChunks.map(chunk => chunk.content).join('');

  useEffect(() => {
    if (combinedContent) {
      setEditableContent(combinedContent);
    }
  }, [combinedContent]);

  const canEdit = !isStreaming && streamingComplete;

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleSubmit = () => {
    onNext(editableContent);
    navigate('/extract');
  };

  const handlePrevious = () => {
    onPrevious();
    navigate('/upload');
  };

  const handleRetry = () => {
    streamInitiatedRef.current = false;
    startSummaryStream();
  };

  const renderMarkdown = (content: string) => {
    return content
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-gray-900 mb-4">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold text-gray-800 mb-3 mt-6">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-medium text-gray-700 mb-2 mt-4">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/^- (.*$)/gm, '<li class="ml-4 list-disc">$1</li>')
      .replace(/^(\d+)\. (.*$)/gm, '<li class="ml-4 list-decimal">$2</li>')
      .replace(/^---$/gm, '<hr class="my-6 border-gray-200">')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/^(.+)$/gm, '<p class="mb-4">$1</p>');
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Zap className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Clinical Summary Generation
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {isStreaming 
            ? 'Generating AI-powered clinical summary from your transcript...' 
            : streamingComplete
            ? 'Summary generation complete. Review and edit the content as needed.'
            : 'Ready to generate clinical summary from your transcript.'
          }
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-3 ${
                isStreaming ? 'bg-blue-500 animate-pulse' : 
                streamingComplete ? 'bg-green-500' : 'bg-gray-400'
              }`} />
              <span className="text-sm font-medium text-gray-700">
                {isStreaming ? 'Generating Summary...' : 
                 streamingComplete ? 'Summary Complete' : 'Ready to Generate'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {!streamingComplete && !isStreaming && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRetry}
                >
                  Generate Summary
                </Button>
              )}
              {canEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={isEditing ? handleSave : handleEdit}
                  icon={<Edit3 className="w-4 h-4" />}
                >
                  {isEditing ? 'Save Changes' : 'Edit Content'}
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          {editableContent ? (
            isEditing ? (
              <textarea
                value={editableContent}
                onChange={(e) => setEditableContent(e.target.value)}
                className="w-full h-96 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
                placeholder="Edit your clinical summary..."
              />
            ) : (
              <div 
                ref={contentRef}
                className="prose prose-blue max-w-none min-h-[200px]"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(editableContent) }}
              />
            )
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-500">
              <div className="text-center">
                <Zap className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>Click "Generate Summary" to start processing your transcript</p>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handlePrevious}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Previous Step
            </Button>
            <div className="text-sm text-gray-500">
              Step 2 of 3: Generate Summary
            </div>
            <Button
              onClick={handleSubmit}
              disabled={isStreaming || !editableContent.trim()}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Extract SOAP Note
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};