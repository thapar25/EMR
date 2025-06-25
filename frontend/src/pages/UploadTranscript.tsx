import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Upload } from "lucide-react";
import { Button } from "../components/ui/Button";
import { FileUpload } from "../components/ui/FileUpload";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { validateTranscript } from "../utils/validation";
import { TranscriptData, AppState } from "../types";
import { ApiService } from "../services/api";

interface UploadTranscriptProps {
  onNext: (data: TranscriptData) => void;
  isProcessing: boolean;
  updateState: (updates: Partial<AppState>) => void;
  setError: (error: string | null) => void;
}

export const UploadTranscript: React.FC<UploadTranscriptProps> = ({
  onNext,
  isProcessing,
  updateState,
  setError,
}) => {
  const navigate = useNavigate();
  const [transcriptContent, setTranscriptContent] = useState("");
  const [fileName, setFileName] = useState<string | undefined>();
  const [errors, setErrors] = useState<string[]>([]);
  const [uploadMethod, setUploadMethod] = useState<"paste" | "upload">("paste");
  const apiService = ApiService.getInstance();

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTranscriptContent(e.target.value);
    setErrors([]);
  };

  const handleFileSelect = (file: File, content: string) => {
    setTranscriptContent(content);
    setFileName(file.name);
    setErrors([]);
  };

  const handleSubmit = async () => {
    const validation = validateTranscript(transcriptContent);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    updateState({ isProcessing: true });

    const transcriptData: TranscriptData = {
      id: Date.now().toString(),
      content: transcriptContent,
      fileName,
      uploadedAt: new Date(),
    };

    try {
      const result = await apiService.uploadTranscript(transcriptData);
      if (result.success) {
        onNext(transcriptData);
        navigate("/summary");
        updateState({ isProcessing: false });
      } else {
        setError(result.message || "Upload failed");
        updateState({ isProcessing: false });
      }
    } catch (error) {
      setError("Failed to upload transcript");
      updateState({ isProcessing: false });
    }
  };

  const isValid = transcriptContent.trim().length > 0 && errors.length === 0;

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Upload Your Transcript
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Paste your transcript content directly or upload a text file to get
          started. We'll process and analyze your transcript in the next steps.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 p-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg max-w-sm mx-auto">
            <button
              onClick={() => setUploadMethod("paste")}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
                uploadMethod === "paste"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Paste Text
            </button>
            <button
              onClick={() => setUploadMethod("upload")}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
                uploadMethod === "upload"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Upload File
            </button>
          </div>
        </div>

        <div className="p-6">
          {uploadMethod === "paste" ? (
            <div className="space-y-4">
              <label
                htmlFor="transcript"
                className="block text-sm font-medium text-gray-700"
              >
                Transcript Content
              </label>
              <textarea
                id="transcript"
                rows={12}
                value={transcriptContent}
                onChange={handleTextChange}
                placeholder="Paste your transcript content here..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
              />
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{transcriptContent.length} characters</span>
                <span>Minimum 50 characters required</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Upload Transcript File
              </label>
              <FileUpload onFileSelect={handleFileSelect} className="mb-4" />
              {transcriptContent && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preview
                  </label>
                  <div className="bg-gray-50 rounded-lg p-4 max-h-32 overflow-y-auto">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                      {transcriptContent.substring(0, 300)}
                      {transcriptContent.length > 300 && "..."}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}

          {errors.length > 0 && (
            <div className="mt-4">
              {errors.map((error, index) => (
                <ErrorMessage key={index} message={error} className="mb-2" />
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Step 1 of 3: Upload Transcript
            </div>
            <Button
              onClick={handleSubmit}
              disabled={!isValid}
              loading={isProcessing}
              icon={<Upload className="w-4 h-4" />}
            >
              Process Transcript
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
