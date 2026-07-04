'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Nguon } from '@/infrastructure/prisma/generated/client';
import type { CreateNguonInput } from '../schema/nguon-schema';

const KEY = ['nguon'] as const;

export function useNguonList() {
  return useQuery({
    queryKey: KEY,
    queryFn: () => api.get<Nguon[]>('/api/nguon'),
  });
}

export function useCreateNguon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateNguonInput) => api.post<Nguon>('/api/nguon', input),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateNguon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: CreateNguonInput }) =>
      api.put<Nguon>(`/api/nguon/${id}`, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteNguon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/api/nguon/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
