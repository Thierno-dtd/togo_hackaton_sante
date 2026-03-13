import { useQuery } from '@tanstack/react-query';
import { examService } from '../services/exam.service';
import type { Exam } from '../types/exam.types';

export const examKeys = {
  all: ['exams'] as const,
  list: (patientId: string) => [...examKeys.all, 'list', patientId] as const,
  detail: (examId: string) => [...examKeys.all, 'detail', examId] as const,
};

export const useExams = (patientId: string | undefined) => {
  return useQuery<Exam[]>({
    queryKey: examKeys.list(patientId ?? ''),
    queryFn: () => examService.getExams(patientId!),
    enabled: !!patientId,
  });
};

export const useExamDetail = (examId: string | undefined) => {
  return useQuery<Exam | undefined>({
    queryKey: examKeys.detail(examId ?? ''),
    queryFn: () => examService.getExamById(examId!),
    enabled: !!examId,
  });
};
