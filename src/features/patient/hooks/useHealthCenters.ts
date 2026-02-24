// ============================================================
// useHealthCenters - Hook React Query centres de santé
// ============================================================

import { useQuery } from '@tanstack/react-query';
import { healthCenterService } from '../services/health-center.service';
import type { CentreSanteFilter } from '../types/patient.types';

export const healthCenterKeys = {
  all: ['health-centers'] as const,
  list: (filters?: CentreSanteFilter) => [...healthCenterKeys.all, 'list', filters] as const,
  detail: (id: string) => [...healthCenterKeys.all, 'detail', id] as const,
};

/**
 * Hook pour récupérer la liste des centres de santé
 */
export const useHealthCenters = (filters?: CentreSanteFilter) => {
  return useQuery({
    queryKey: healthCenterKeys.list(filters),
    queryFn: () => healthCenterService.getCentres(filters),
  });
};

/**
 * Hook pour récupérer un centre spécifique
 */
export const useHealthCenter = (centreId: string | undefined) => {
  return useQuery({
    queryKey: healthCenterKeys.detail(centreId ?? ''),
    queryFn: () => healthCenterService.getCentre(centreId!),
    enabled: !!centreId,
  });
};
