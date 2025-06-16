import { TranscriptData } from '../types';

const API_BASE_URL = 'http://127.0.0.1:8000';

export class ApiService {
  private static instance: ApiService;

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  async uploadTranscript(transcriptData: TranscriptData): Promise<{ success: boolean; message?: string }> {
    try {
      // For now, just simulate upload success since we're focusing on summary/extract
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    } catch (error) {
      console.error('Upload transcript error:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Upload failed' 
      };
    }
  }

  async getSummaryStream(dialogue: string): Promise<ReadableStream<Uint8Array> | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/summary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dialogue }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.body;
    } catch (error) {
      console.error('Get summary stream error:', error);
      return null;
    }
  }

  async extractSOAP(summary: string): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/extract`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ summary }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Extract SOAP error:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Extraction failed' 
      };
    }
  }

  // Keep mock stream for development/fallback
  createMockStream(): ReadableStream<Uint8Array> {
    const encoder = new TextEncoder();
    let chunkIndex = 0;
    
    const mockChunks = [
      '{"delta": "# Clinical Summary\\n\\nAnalyzing transcript..."}',
      '{"delta": "\\n\\n## Patient Information\\n\\n- Chief Complaint: Follow-up visit"}',
      '{"delta": "\\n- Duration: 15 minutes\\n- Assessment: Routine check-up"}',
      '{"delta": "\\n\\n## Key Findings\\n\\n- Vital signs stable"}',
      '{"delta": "\\n- No acute concerns noted\\n- Patient reports feeling well"}',
      '{"delta": "\\n\\n## Recommendations\\n\\n- Continue current medications"}',
      '{"delta": "\\n- Follow-up in 3 months\\n\\n*Summary complete.*"}',
    ];

    return new ReadableStream({
      start(controller) {
        const interval = setInterval(() => {
          if (chunkIndex < mockChunks.length) {
            const chunk = encoder.encode(mockChunks[chunkIndex] + '\n');
            controller.enqueue(chunk);
            chunkIndex++;
          } else {
            controller.close();
            clearInterval(interval);
          }
        }, 800);
      },
    });
  }
}