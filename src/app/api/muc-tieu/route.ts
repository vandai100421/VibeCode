import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { apiError, apiSuccess } from '@/lib/errors';
import { createMucTieu, listMucTieu } from '@/modules/muc-tieu/api/muc-tieu-service';
import { createMucTieuSchema } from '@/modules/muc-tieu/schema/muc-tieu-schema';

export async function GET() {
  try {
    const data = await listMucTieu();
    return apiSuccess(data);
  } catch (e) {
    console.error('GET /api/muc-tieu error:', e);
    return apiError({ code: 'INTERNAL', message: 'Lỗi server' }, 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input = createMucTieuSchema.parse(body);
    const data = await createMucTieu(input);
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
    console.error('POST /api/muc-tieu error:', e);
    return apiError({ code: 'INTERNAL', message: 'Lỗi server' }, 500);
  }
}
