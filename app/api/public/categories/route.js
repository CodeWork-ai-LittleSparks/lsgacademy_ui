export const dynamic = 'force-dynamic';

import { API_CONFIG } from '@/lib/constants/config';

export async function GET() {
  try {
    const url = `${API_CONFIG.BASE_URL}/categories`;
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return Response.json(
        {
          success: false,
          error: {
            message: data?.error?.message || 'Failed to load categories',
            code: data?.error?.code || 'UNKNOWN_ERROR',
          },
          data: data?.data,
        },
        { status: res.status }
      );
    }

    // Return the backend payload as-is for consistency
    return Response.json(data, { status: res.status });
  } catch (error) {
    return Response.json(
      { success: false, error: { message: error.message || 'Network error', code: 'NETWORK_ERROR' } },
      { status: 500 }
    );
  }
}

