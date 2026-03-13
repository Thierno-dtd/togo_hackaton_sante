// barrel exports for examens feature

export type { Exam, ExamStatus, ExamContext, ExamResult } from './types/exam.types';
export { examService } from './services/exam.service';
export { useExams, useExamDetail } from './hooks/useExams';
export { default as Examens } from './components/Examens';
