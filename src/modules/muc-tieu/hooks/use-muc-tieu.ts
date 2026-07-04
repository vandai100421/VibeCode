'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { MucTieu } from '@/infrastructure/prisma/generated/client';
import type { CreateMucTieuInput } from '../schema/muc-tieu-schema';

const KEY = ['muc-tieu'] as const;

export function useMucTieuList() {
  return useQuery({
    queryKey: KEY,
    queryFn: () => api.get<MucTieu[]>('/api/muc-tieu'),
  });
}

export function useCreateMucTieu() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateMucTieuInput) => api.post<MucTieu>('/api/muc-tieu', input),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateMucTieu() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: CreateMucTieuInput }) =>
      api.put<MucTieu>(`/api/muc-tieu/${id}`, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteMucTieu() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/api/muc-tieu/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
