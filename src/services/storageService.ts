import { Question } from "../types";

const STORAGE_KEY = 'qsnap_pro_history';

export const storageService = {
  saveQuestion: (question: Question) => {
    const history = storageService.getHistory();
    const updatedHistory = [question, ...history];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  },

  getHistory: (): Question[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  deleteQuestion: (id: string) => {
    const history = storageService.getHistory();
    const updatedHistory = history.filter(q => q.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  },

  updateQuestion: (updatedQuestion: Question) => {
    const history = storageService.getHistory();
    const updatedHistory = history.map(q => q.id === updatedQuestion.id ? updatedQuestion : q);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  }
};
