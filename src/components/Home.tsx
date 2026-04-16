import React, { useState, useRef } from 'react';
import { Upload, Loader2, Zap, Camera, Plus, Book } from 'lucide-react';
import { motion } from 'motion/react';
import { extractQuestionFromImage } from '../services/geminiService';
import { Question } from '../types';

interface HomeProps {
  onQuestionExtracted: (question: Question) => void;
}

export default function Home({ onQuestionExtracted }: HomeProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        const result = await extractQuestionFromImage(base64, file.type);
        
        const newQuestion: Question = {
          id: crypto.randomUUID(),
          text: result.text,
          type: result.type,
          options: result.options,
          timestamp: Date.now(),
          imageUrl: base64
        };
        
        onQuestionExtracted(newQuestion);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("OCR Error:", error);
      alert("Failed to extract text. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="mb-10">
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-[24px] flex items-center justify-center mx-auto mb-6">
            <Zap size={40} className="fill-primary" />
          </div>
          <h1 className="text-4xl font-extrabold text-ink mb-3 tracking-tight">QSnap Pro</h1>
          <p className="text-ink-light font-medium">The ultimate tool for digitizing questions for teachers.</p>
        </div>

        {isProcessing && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-success text-white px-6 py-3 rounded-full text-sm font-bold shadow-2xl z-50 animate-pulse flex items-center gap-2">
            <Loader2 className="animate-spin" size={18} />
            PROCESSING IMAGE...
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="w-full btn-primary h-20 text-lg flex flex-col items-center justify-center gap-1 group"
          >
            <div className="flex items-center gap-3">
              <Camera size={24} />
              <span className="font-extrabold uppercase tracking-tight">Image to Text</span>
            </div>
            <span className="text-[10px] opacity-70 font-bold uppercase tracking-widest">Snap or Upload Photo</span>
          </button>
          
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => onQuestionExtracted({
                id: crypto.randomUUID(),
                text: '',
                type: 'Short',
                timestamp: Date.now()
              })}
              className="btn-outline h-20 flex flex-col items-center justify-center gap-1"
            >
              <div className="flex items-center gap-2">
                <Plus size={20} className="text-primary" />
                <span className="font-bold">Manual</span>
              </div>
              <span className="text-[9px] text-ink-light font-extrabold uppercase tracking-widest">Type Question</span>
            </button>

            <button
              onClick={() => {
                const nav = document.querySelectorAll('nav button');
                if (nav[2]) (nav[2] as HTMLButtonElement).click();
              }}
              className="btn-outline h-20 flex flex-col items-center justify-center gap-1"
            >
              <div className="flex items-center gap-2">
                <Book size={20} className="text-primary" />
                <span className="font-bold">Library</span>
              </div>
              <span className="text-[9px] text-ink-light font-extrabold uppercase tracking-widest">Saved Items</span>
            </button>
          </div>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>

        <div className="mt-12 p-4 bg-white rounded-2xl border border-border flex items-center gap-4 text-left">
          <div className="w-10 h-10 rounded-lg bg-success/10 text-success flex items-center justify-center shrink-0">
            <Zap size={20} />
          </div>
          <div>
            <p className="text-xs font-extrabold text-ink uppercase tracking-tight">AI OCR Engine Active</p>
            <p className="text-[10px] text-ink-light font-bold">Fast question extraction with 99% accuracy.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

