'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCreateMucTieu, useUpdateMucTieu } from '../hooks/use-muc-tieu';
import { createMucTieuSchema, type CreateMucTieuInput } from '../schema/muc-tieu-schema';
import type { MucTieu } from '@/infrastructure/prisma/generated/client';

interface MucTieuFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing?: MucTieu | null;
}

export function MucTieuFormDialog({ open, onOpenChange, editing }: MucTieuFormDialogProps) {
  const isEdit = Boolean(editing);
  const createMut = useCreateMucTieu();
  const updateMut = useUpdateMucTieu();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateMucTieuInput>({
    resolver: zodResolver(createMucTieuSchema),
    defaultValues: { ten: '' },
  });

  useEffect(() => {
    if (open) {
      reset({ ten: editing?.ten ?? '' });
    }
  }, [open, editing, reset]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      if (isEdit && editing) {
        await updateMut.mutateAsync({ id: editing.id, input: values });
        toast.success('Đã cập nhật mục tiêu');
      } else {
        await createMut.mutateAsync(values);
        toast.success('Đã tạo mục tiêu mới');
      }
      onOpenChange(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Lỗi không xác định');
    }
  });

  const pending = createMut.isPending || updateMut.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Sửa mục tiêu' : 'Tạo mục tiêu mới'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ten">Tên mục tiêu</Label>
            <Input id="ten" placeholder="VD: Khu công nghiệp Bắc Thăng Long" {...register('ten')} />
            {errors.ten && <p className="text-sm text-destructive">{errors.ten.message}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
