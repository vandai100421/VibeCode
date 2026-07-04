import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { apiError, apiSuccess } from '@/lib/errors';
import { createNguon, listNguon } from '@/modules/nguon/api/nguon-service';
import { createNguonSchema } from '@/modules/nguon/schema/nguon-schema';

export async function GET() {
  try {
    const data = await listNguon();
    return apiSuccess(data);
  } catch (e) {
    console.error('GET /api/nguon error:', e);
    return apiError({ code: 'INTERNAL', message: 'Lỗi server' }, 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input = createNguonSchema.parse(body);
    const data = await createNguon(input);
    return apiSuccess(data, 201);
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
    if (e instanceof Error && e.name === 'ConflictError') {
      return apiError({ code: 'CONFLICT', message: e.message }, 409);
    }
    console.error('POST /api/nguon error:', e);
    return apiError({ code: 'INTERNAL', message: 'Lỗi server' }, 500);
  }
}
