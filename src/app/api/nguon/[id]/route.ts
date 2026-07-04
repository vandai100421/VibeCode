import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { apiError, apiSuccess } from '@/lib/errors';
import { deleteNguon, getNguonById, updateNguon } from '@/modules/nguon/api/nguon-service';
import { updateNguonSchema } from '@/modules/nguon/schema/nguon-schema';

export async function GET(_request: NextRequest, ctx: RouteContext<'/api/nguon/[id]'>) {
  try {
    const { id } = await ctx.params;
    const numId = Number(id);
    if (Number.isNaN(numId)) {
      return apiError({ code: 'VALIDATION', message: 'ID không hợp lệ' }, 400);
    }
    const data = await getNguonById(numId);
    return apiSuccess(data);
  } catch (e) {
    if (e instanceof Error && e.name === 'NotFoundError') {
      return apiError({ code: 'NOT_FOUND', message: e.message }, 404);
    }
    console.error('GET /api/nguon/[id] error:', e);
    return apiError({ code: 'INTERNAL', message: 'Lỗi server' }, 500);
  }
}

export async function PUT(request: NextRequest, ctx: RouteContext<'/api/nguon/[id]'>) {
  try {
    const { id } = await ctx.params;
    const numId = Number(id);
    if (Number.isNaN(numId)) {
      return apiError({ code: 'VALIDATION', message: 'ID không hợp lệ' }, 400);
    }
    const body = await request.json();
    const input = updateNguonSchema.parse(body);
    const data = await updateNguon(numId, input);
    return apiSuccess(data);
  } catch (e) {
    if (e instanceof ZodError) {
      const first = e.issues[0];
      return apiError(
        {
          code: 'VALIDATION',
          message: first?.message ?? 'Dữ liệu không hợp lệ',
          field: first?.path[0]?.toString(),
        },
        400,
      );
    }
    if (e instanceof Error) {
      if (e.name === 'NotFoundError') {
        return apiError({ code: 'NOT_FOUND', message: e.message }, 404);
      }
      if (e.name === 'ConflictError') {
        return apiError({ code: 'CONFLICT', message: e.message }, 409);
      }
    }
    console.error('PUT /api/nguon/[id] error:', e);
    return apiError({ code: 'INTERNAL', message: 'Lỗi server' }, 500);
  }
}

export async function DELETE(_request: NextRequest, ctx: RouteContext<'/api/nguon/[id]'>) {
  try {
    const { id } = await ctx.params;
    const numId = Number(id);
    if (Number.isNaN(numId)) {
      return apiError({ code: 'VALIDATION', message: 'ID không hợp lệ' }, 400);
    }
    await deleteNguon(numId);
    return new Response(null, { status: 204 });
  } catch (e) {
    if (e instanceof Error) {
      if (e.name === 'NotFoundError') {
        return apiError({ code: 'NOT_FOUND', message: e.message }, 404);
      }
      if (e.name === 'ConflictError') {
        return apiError({ code: 'CONFLICT', message: e.message }, 409);
      }
    }
    console.error('DELETE /api/nguon/[id] error:', e);
    return apiError({ code: 'INTERNAL', message: 'Lỗi server' }, 500);
  }
}
