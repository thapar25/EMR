import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Header } from "./components/layout/Header";
import { ProgressIndicator } from "./components/ProgressIndicator";
import { ErrorNotification } from "./components/ErrorNotification";
import { UploadTranscript } from "./pages/UploadTranscript";
import { GenerateSummary } from "./pages/GenerateSummary";
import { ExtractSOAP } from "./pages/ExtractSOAP";
import { useAppState } from "./hooks/useAppState";
import { ProcessingStep } from "./types";

function App() {
  const {
    state,
    nextStep,
    previousStep,
    setTranscriptData,
    setError,
    updateState,
    reset,
    addStreamingChunk,
    clearStreamingChunks,
  } = useAppState();

  const steps: ProcessingStep[] = [
    {
      id: 1,
      title: "Upload Transcript",
      description: "Paste or upload your transcript file",
      completed: state.currentStep > 1,
      current: state.currentStep === 1,
    },
    {
      id: 2,
      title: "Generate Summary",
      description: "AI-powered clinical summary generation",
      completed: state.currentStep > 2,
      current: state.currentStep === 2,
    },
    {
      id: 3,
      title: "Extract SOAP Note",
      description: "Structured clinical data extraction",
      completed: state.currentStep > 3,
      current: state.currentStep === 3,
    },
  ];

  const handleLogin = () => {
    console.log("Login clicked");
  };

  const handleLogout = () => {
    console.log("Logout clicked");
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header
          onLogin={handleLogin}
          onLogout={handleLogout}
          isAuthenticated={false}
        />

        <main className="py-8">
          <ProgressIndicator steps={steps} currentStep={state.currentStep} />

          <Routes>
            <Route path="/" element={<Navigate to="/upload" replace />} />
            <Route
              path="/upload"
              element={
                <UploadTranscript
                  onNext={(data) => {
                    setTranscriptData(data);
                    nextStep();
                  }}
                  isProcessing={state.isProcessing}
                  updateState={updateState}
                  setError={setError}
                />
              }
            />
            <Route
              path="/summary"
              element={
                <GenerateSummary
                  transcriptData={state.transcriptData}
                  onNext={(content) => {
                    updateState({ processedContent: content });
                    nextStep();
                  }}
                  onPrevious={previousStep}
                  streamingChunks={state.streamingChunks}
                  isProcessing={state.isProcessing}
                  onAddChunk={addStreamingChunk}
                  onClearChunks={clearStreamingChunks}
                  onSetError={setError}
                  updateState={updateState}
                />
              }
            />
            <Route
              path="/extract"
              element={
                <ExtractSOAP
                  processedContent={state.processedContent}
                  onPrevious={previousStep}
                  onReset={reset}
                  onSetError={setError}
                />
              }
            />
          </Routes>
        </main>

        {state.error && (
          <ErrorNotification
            error={state.error}
            onDismiss={() => setError(null)}
          />
        )}
      </div>
    </Router>
  );
}

export default App;
