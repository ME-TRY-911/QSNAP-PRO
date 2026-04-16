import React from 'react';
import { Trash2, FileText, File as FileIcon, Clock, ChevronRight, Book } from 'lucide-react';
import { motion } from 'motion/react';
import { Question } from '../types';
import { storageService } from '../services/storageService';
import { exportService } from '../services/exportService';

interface HistoryProps {
  onSelect: (question: Question) => void;
}

export default function History({ onSelect }: HistoryProps) {
  const [history, setHistory] = React.useState<Question[]>([]);

  React.useEffect(() => {
    setHistory(storageService.getHistory());
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    storageService.deleteQuestion(id);
    setHistory(history.filter(q => q.id !== id));
  };

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-ink-light px-6 text-center">
        <Book size={48} className="mb-4 opacity-20" />
        <p className="font-bold">Library is empty</p>
        <p className="text-xs uppercase tracking-widest mt-2 opacity-60">Scanned questions will appear here</p>
      </div>
    );
  }

  return (
    <div className="py-4 space-y-4">
      <div className="flex items-center justify-between px-2 mb-6">
        <h2 className="text-xl font-extrabold tracking-tight">My Library</h2>
        <span className="text-[10px] font-extrabold bg-primary/10 text-primary px-2 py-1 rounded uppercase tracking-widest">
          {history.length} Questions
        </span>
      </div>
      
      <div className="grid gap-3">
        {history.map((q, index) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelect(q)}
            className="card group hover:border-primary transition-all cursor-pointer p-4 bg-white"
          >
            <div className="flex justify-between items-start mb-3">
              <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-widest ${
                q.type === 'MCQ' ? 'bg-blue-50 text-blue-600' :
                q.type === 'Short' ? 'bg-green-50 text-green-600' :
                'bg-purple-50 text-purple-600'
              }`}>
                {q.type}
              </span>
              <button 
                onClick={(e) => handleDelete(q.id, e)}
                className="p-1 text-border hover:text-red-500 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
            
            <p className="text-ink font-bold text-sm line-clamp-2 mb-4 leading-relaxed">{q.text}</p>
            
            <div className="flex items-center justify-between pt-3 border-t border-border/50">
              <div className="flex items-center gap-2 text-[10px] text-ink-light font-bold uppercase tracking-tighter">
                <Clock size={12} />
                {new Date(q.timestamp).toLocaleDateString()}
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={(e) => { e.stopPropagation(); exportService.exportToPDF(q); }}
                  className="text-ink-light hover:text-primary transition-colors"
                  title="Export PDF"
                >
                  <FileText size={16} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); exportService.exportToWord(q); }}
                  className="text-ink-light hover:text-primary transition-colors"
                  title="Export Word"
                >
                  <FileIcon size={16} />
                </button>
                <ChevronRight size={16} className="text-border group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

