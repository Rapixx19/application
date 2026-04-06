import { RefObject, useState, DragEvent } from "react";

interface StepMotivationProps {
  data: { portfolio_url: string; motivation: string };
  onChange: (field: string, value: string) => void;
  cvFile: File | null;
  onCvChange: (file: File | null) => void;
  cvInputRef: RefObject<HTMLInputElement | null>;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export function StepMotivation({ data, onChange, cvFile, onCvChange, cvInputRef }: StepMotivationProps) {
  const [dragOver, setDragOver] = useState(false);
  const [fileError, setFileError] = useState("");

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return "Please upload a PDF or Word document (.pdf, .doc, .docx)";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "File size must be less than 10MB";
    }
    return null;
  };

  const handleFile = (file: File) => {
    const error = validateFile(file);
    if (error) {
      setFileError(error);
      return;
    }
    setFileError("");
    onCvChange(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const removeFile = () => {
    onCvChange(null);
    setFileError("");
    if (cvInputRef.current) {
      cvInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-primary mb-1.5">
          Portfolio or LinkedIn URL
          <span className="text-muted font-normal text-xs ml-2">(optional)</span>
        </label>
        <input
          type="url"
          value={data.portfolio_url}
          onChange={(e) => onChange("portfolio_url", e.target.value)}
          placeholder="https://..."
          className="w-full p-3.5 border border-border rounded-[10px] text-[0.95rem] focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-colors"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-primary mb-1.5">
          Why this project? <span className="text-accent">*</span>
        </label>
        <textarea
          value={data.motivation}
          onChange={(e) => onChange("motivation", e.target.value)}
          placeholder="What about Sentavita interests you, and what can you bring to this collaboration?"
          rows={5}
          className="w-full p-3.5 border border-border rounded-[10px] text-[0.95rem] focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-colors resize-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-primary mb-1.5">
          Upload your CV
          <span className="text-muted font-normal text-xs ml-2">(optional)</span>
        </label>
        {cvFile ? (
          <div className="flex items-center justify-between p-4 border border-border rounded-[10px] bg-[#f9fafb]">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-primary">{cvFile.name}</p>
                <p className="text-xs text-muted">{(cvFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <button
              type="button"
              onClick={removeFile}
              className="text-muted hover:text-red-600 transition-colors"
              aria-label="Remove file"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => cvInputRef.current?.click()}
            className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-[10px] cursor-pointer transition-colors ${
              dragOver
                ? "border-primary bg-primary/5"
                : "border-border hover:border-muted"
            }`}
          >
            <svg className="w-8 h-8 text-muted mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-sm text-muted mb-1">
              <span className="font-medium text-primary">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-muted">PDF or Word document (max 10MB)</p>
            <input
              ref={cvInputRef}
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleInputChange}
              className="hidden"
            />
          </div>
        )}
        {fileError && (
          <p className="text-sm text-red-600 mt-2">{fileError}</p>
        )}
      </div>
    </div>
  );
}
