export type QuestionType = 'MCQ' | 'Short' | 'Long';

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[];
  answer?: string;
  timestamp: number;
  imageUrl?: string;
}

export interface OCRResult {
  text: string;
  type: QuestionType;
  options?: string[];
}
