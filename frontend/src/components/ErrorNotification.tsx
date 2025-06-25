import React from "react";
import { X } from "lucide-react";

interface ErrorNotificationProps {
  error: string;
  onDismiss: () => void;
}

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  error,
  onDismiss,
}) => {
  return (
    <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg max-w-md">
      <div className="flex items-start">
        <p className="text-sm flex-1">{error}</p>
        <button
          onClick={onDismiss}
          className="ml-3 text-red-400 hover:text-red-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <button
        onClick={onDismiss}
        className="mt-2 text-xs underline hover:no-underline"
      >
        Dismiss
      </button>
    </div>
  );
};
