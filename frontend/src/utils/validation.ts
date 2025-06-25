export const validateTranscript = (
  content: string,
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!content || content.trim().length === 0) {
    errors.push("Transcript content cannot be empty");
  }

  if (content.length < 50) {
    errors.push("Transcript must be at least 50 characters long");
  }

  if (content.length > 50000) {
    errors.push("Transcript cannot exceed 50,000 characters");
  }

  // Check for potentially harmful content
  const suspiciousPatterns = [/<script/i, /javascript:/i, /on\w+\s*=/i];

  if (suspiciousPatterns.some((pattern) => pattern.test(content))) {
    errors.push("Transcript contains potentially harmful content");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateFile = (
  file: File,
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ["text/plain", "text/csv", "application/json"];

  if (file.size > maxSize) {
    errors.push("File size cannot exceed 10MB");
  }

  if (!allowedTypes.includes(file.type)) {
    errors.push("Only text files (.txt, .csv, .json) are allowed");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
