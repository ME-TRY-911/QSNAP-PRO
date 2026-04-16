import React, { useState, useRef } from 'react';
import { Save, Copy, FileText, File as FileIcon, Trash2, Plus, X, Share2, ArrowLeft, MoreVertical, Image as ImageIcon, Upload } from 'lucide-react';
import { motion } from 'motion/react';
import { Question, QuestionType } from '../types';
import { exportService } from '../services/exportService';
import { storageService } from '../services/storageService';

interface EditorProps {
  question: Question;
  onSave: () => void;
  onCancel: () => void;
}

export default function Editor({ question: initialQuestion, onSave, onCancel }: EditorProps) {
  const [question, setQuestion] = useState<Question>(initialQuestion);
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCopy = () => {
    let text = question.text;
    if (question.options) {
      text += '\n' + question.options.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`).join('\n');
    }
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const handleSave = () => {
    storageService.saveQuestion(question);
    setIsSaved(true);
    setTimeout(() => onSave(), 1000);
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...(question.options || [])];
    newOptions[index] = value;
    setQuestion({ ...question, options: newOptions });
  };

  const addOption = () => {
    setQuestion({ ...question, options: [...(question.options || []), ''] });
  };

  const removeOption = (index: number) => {
    const newOptions = (question.options || []).filter((_, i) => i !== index);
    setQuestion({ ...question, options: newOptions });
  };

  const handleShare = () => {
    let text = `*Question:* ${question.text}\n`;
    if (question.options) {
      text += question.options.map((opt, i) => `*${String.fromCharCode(65 + i)}.* ${opt}`).join('\n');
    }
    const url = `whatsapp://send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setQuestion({ ...question, imageUrl: base64 });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-2xl mx-auto md:max-w-none">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between mb-2">
          <button onClick={onCancel} className="text-ink-light flex items-center gap-2 hover:text-ink">
            <ArrowLeft size={18} />
          </button>
          <h2 className="text-base font-extrabold uppercase tracking-tight">Edit Question</h2>
          <button className="text-ink-light">
            <MoreVertical size={18} />
          </button>
        </div>

        <div className="flex justify-center gap-4 mb-6">
          <div className="w-2 h-2 rounded-full bg-border" />
          <div className="w-6 h-2 rounded-full bg-primary" />
          <div className="w-2 h-2 rounded-full bg-border" />
        </div>

        <div className="space-y-6 editor-body">
          <div className="space-y-2">
            <span className="label">Question Media</span>
            {question.imageUrl ? (
              <div className="relative group">
                <div className="rounded-xl overflow-hidden border border-border bg-slate-50 p-2">
                  <img src={question.imageUrl} alt="Source" className="w-full max-h-40 object-contain" referrerPolicy="no-referrer" />
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs rounded-xl gap-2"
                >
                  <Upload size={16} /> Change Photo
                </button>
                <button 
                  onClick={() => setQuestion({ ...question, imageUrl: undefined })}
                  className="absolute top-4 right-4 bg-red-500 text-white p-1 rounded-full shadow-lg"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-8 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 text-ink-light hover:border-primary hover:text-primary transition-all"
              >
                <ImageIcon size={32} className="opacity-20" />
                <span className="text-xs font-extrabold uppercase tracking-widest">Attach Photo</span>
              </button>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
          </div>

          <div className="space-y-4">
            <div>
              <span className="label">Format Question</span>
              <textarea
                value={question.text}
                onChange={(e) => setQuestion({ ...question, text: e.target.value })}
                className="editable-text min-h-[100px]"
                placeholder="Enter question text..."
              />
            </div>

            <div>
              <span className="label">Question Type</span>
              <div className="flex gap-2">
                {(['MCQ', 'Short', 'Long'] as QuestionType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setQuestion({ ...question, type })}
                    className={`flex-1 py-1.5 rounded-md text-[12px] font-extrabold uppercase tracking-wider border transition-all ${
                      question.type === type 
                      ? 'bg-primary/10 text-primary border-primary' 
                      : 'bg-white text-ink-light border-border'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {question.type === 'MCQ' && (
              <div className="space-y-3">
                <span className="label">Options</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(question.options || []).map((opt, index) => (
                    <div key={index} className="flex gap-2 items-center bg-white p-2 rounded-lg border border-border group">
                      <div className="w-6 h-6 rounded bg-app-bg flex items-center justify-center font-extrabold text-[10px] text-ink-light shrink-0">
                        {String.fromCharCode(65 + index)}
                      </div>
                      <input
                        value={opt}
                        onChange={(e) => updateOption(index, e.target.value)}
                        className="flex-1 bg-transparent text-sm outline-none font-medium"
                        placeholder={`Option ${String.fromCharCode(65 + index)}`}
                      />
                      <button 
                        onClick={() => removeOption(index)}
                        className="p-1 text-ink-light hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={addOption}
                  className="w-full py-2 rounded-lg border border-dashed border-border text-ink-light hover:border-primary hover:text-primary transition-all text-xs font-bold uppercase"
                >
                  <Plus size={14} className="inline mr-1" /> Add Option
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-6 border-t border-border">
          <button onClick={handleCopy} className="btn-outline flex-1">
            <Copy size={16} /> Copy Text
          </button>
          <button onClick={handleSave} className="btn-primary flex-1">
            {isSaved ? 'Question Saved' : <><Save size={16} /> Save Changes</>}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 pb-8">
          <button onClick={() => exportService.exportToPDF(question)} className="btn-outline text-[12px] bg-slate-50 italic">
            <FileText size={16} /> Export PDF
          </button>
          <button onClick={() => exportService.exportToWord(question)} className="btn-outline text-[12px] bg-slate-50 italic">
            <FileIcon size={16} /> Export Word
          </button>
          <button onClick={handleShare} className="btn-outline text-[12px] col-span-2 bg-[#25D366]/10 border-[#25D366]/20 text-[#25D366] font-extrabold">
            <Share2 size={16} /> Share on WhatsApp
          </button>
        </div>
      </motion.div>
    </div>
  );
}


