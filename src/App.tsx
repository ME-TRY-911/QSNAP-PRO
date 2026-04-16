/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Home as HomeIcon, History as HistoryIcon, PlusCircle, Settings, Camera, Book, FileText, User } from 'lucide-react';
import Home from './components/Home';
import Editor from './components/Editor';
import History from './components/History';
import { Question } from './types';
import { storageService } from './services/storageService';

type Page = 'home' | 'history' | 'editor';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [recentQuestions, setRecentQuestions] = useState<Question[]>([]);

  useEffect(() => {
    setRecentQuestions(storageService.getHistory().slice(0, 3));
  }, [currentPage]);

  const handleQuestionExtracted = (question: Question) => {
    setActiveQuestion(question);
    setCurrentPage('editor');
  };

  const handleSelectFromHistory = (question: Question) => {
    setActiveQuestion(question);
    setCurrentPage('editor');
  };

  return (
    <div className="flex min-h-screen bg-app-bg">
      {/* Sidebar - Desktop Only */}
      <aside className="sidebar">
        <div className="logo flex items-center gap-3 text-primary font-extrabold text-xl mb-8">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">Q</div>
          QSnap Pro
        </div>
        
        <nav className="flex-1">
          <div 
            onClick={() => setCurrentPage('home')}
            className={`nav-item ${currentPage === 'home' ? 'active' : ''}`}
          >
            <Camera size={20} /> New Scan
          </div>
          <div 
            onClick={() => setCurrentPage('history')}
            className={`nav-item ${currentPage === 'history' ? 'active' : ''}`}
          >
            <Book size={20} /> My Library
          </div>
          <div className="nav-item">
            <FileText size={20} /> Paper Generator
          </div>
          <div className="nav-item">
            <Settings size={20} /> Settings
          </div>
        </nav>

        <div className="mt-auto pt-6 border-t border-border">
          <div className="nav-item">
            <User size={20} /> Prof. Rajesh Kumar
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row max-w-[1440px] mx-auto w-full">
        <main className="flex-1 md:p-6 pb-24 md:pb-6 overflow-y-auto">
          {/* Header - Mobile Only */}
          <header className="md:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-border px-6 py-4 flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">Q</div>
              <span className="font-bold text-lg tracking-tight">QSnap Pro</span>
            </div>
            <button className="p-2 text-ink-light">
              <Settings size={20} />
            </button>
          </header>

          <div className="max-w-3xl mx-auto h-full">
            {currentPage === 'home' && (
              <Home onQuestionExtracted={handleQuestionExtracted} />
            )}
            {currentPage === 'history' && (
              <History onSelect={handleSelectFromHistory} />
            )}
            {currentPage === 'editor' && activeQuestion && (
              <Editor 
                question={activeQuestion} 
                onSave={() => setCurrentPage('history')}
                onCancel={() => setCurrentPage('home')}
              />
            )}
          </div>
        </main>

        {/* Right Sidebar - History Summary (Desktop Only) */}
        <aside className="hidden lg:flex w-[300px] bg-app-bg p-6 flex-col gap-6">
          <h3 className="text-sm font-extrabold text-ink-light uppercase tracking-wider">Recent Extracts</h3>
          <div className="flex flex-col gap-3">
            {recentQuestions.length > 0 ? (
              recentQuestions.map(q => (
                <div 
                  key={q.id} 
                  onClick={() => handleSelectFromHistory(q)}
                  className="p-3 bg-white rounded-xl border border-border shadow-sm cursor-pointer hover:border-primary transition-colors"
                >
                  <p className="text-sm font-bold text-ink line-clamp-1">{q.text}</p>
                  <p className="text-[11px] text-ink-light mt-1 uppercase font-bold tracking-tighter">
                    {new Date(q.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {q.type}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-xs text-ink-light italic">No recent scans</p>
            )}
          </div>

          <div className="mt-auto p-4 bg-gradient-to-br from-primary to-primary-dark rounded-xl text-white">
            <p className="text-[10px] uppercase font-bold opacity-80 mb-1 tracking-widest">Storage Space</p>
            <p className="text-lg font-extrabold">75% Used</p>
            <div className="w-full h-1.5 bg-white/20 rounded-full my-2">
              <div className="w-3/4 h-full bg-white rounded-full"></div>
            </div>
            <button className="w-full bg-white text-primary border-none p-2 rounded-lg font-bold text-xs mt-2 uppercase">
              Upgrade to Pro
            </button>
          </div>
        </aside>
      </div>

      {/* Bottom Navigation - Mobile Only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border px-8 py-4 flex justify-between items-center z-40">
        <button 
          onClick={() => setCurrentPage('home')}
          className={`flex flex-col items-center gap-1 transition-colors ${currentPage === 'home' ? 'text-primary' : 'text-ink-light'}`}
        >
          <HomeIcon size={24} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Home</span>
        </button>
        
        <button 
          onClick={() => setCurrentPage('home')}
          className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/20 -mt-12 border-4 border-white active:scale-95 transition-transform"
        >
          <Camera size={28} />
        </button>

        <button 
          onClick={() => setCurrentPage('history')}
          className={`flex flex-col items-center gap-1 transition-colors ${currentPage === 'history' ? 'text-primary' : 'text-ink-light'}`}
        >
          <Book size={24} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Library</span>
        </button>
      </nav>
    </div>
  );
}


