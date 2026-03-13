import type { Exam } from '../types/exam.types';
import { MOCK_EXAMS, getMockExamsForPatient } from '@shared/data/mock-data';

// simulate API calls reading from centralized mock-data
export const examService = {
  getExams: async (patientId: string): Promise<Exam[]> => {
    await new Promise((r) => setTimeout(r, 400));
    // filter by patient if possible
    if (patientId) {
      return getMockExamsForPatient(patientId);
    }
    return MOCK_EXAMS;
  },

  getExamById: async (examId: string): Promise<Exam | undefined> => {
    await new Promise((r) => setTimeout(r, 300));
    return MOCK_EXAMS.find((e) => e.id === examId);
  },
};
