import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Loader2 } from 'lucide-react';

interface ImageAnalyzerProps {
  onImageSelected: (base64: string, mimeType: string) => void;
  isAnalyzing: boolean;
  onClear: () => void;
}

const ImageAnalyzer: React.FC<ImageAnalyzerProps> = ({ onImageSelected, isAnalyzing, onClear }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setPreview(base64String);
      
      // Extract base64 data and mime type
      const match = base64String.match(/^data:(.*);base64,(.*)$/);
      if (match) {
        onImageSelected(match[2], match[1]);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onClear();
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col">
      <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Camera className="w-5 h-5 text-emerald-600" />
        Scan Ingredients
      </h2>

      {!preview ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer min-h-[200px]"
        >
          <Upload className="w-10 h-10 text-slate-400 mb-3" />
          <p className="text-slate-600 font-medium">Click to upload photo</p>
          <p className="text-slate-400 text-sm mt-1">Supports JPG, PNG, WEBP</p>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
      ) : (
        <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 flex-1 flex items-center justify-center min-h-[200px]">
          <img src={preview} alt="Ingredients" className="max-w-full max-h-[400px] object-contain" />
          
          <button 
            onClick={handleClear}
            className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-all"
            disabled={isAnalyzing}
          >
            <X className="w-5 h-5" />
          </button>

          {isAnalyzing && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white backdrop-blur-sm">
              <Loader2 className="w-10 h-10 animate-spin mb-3 text-emerald-400" />
              <p className="font-medium">Analyzing ingredients...</p>
              <p className="text-sm text-slate-300">Using Gemini 3 Pro Preview</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageAnalyzer;
