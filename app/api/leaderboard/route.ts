import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const users = await kv.get<any[]>('users') || [];

        // Sort by score descending
        const leaderboard = users.sort((a: any, b: any) => b.score - a.score).slice(0, 10);

        return NextResponse.json(leaderboard);
    } catch (error) {
        console.error('KV Error:', error);
        return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
    }
}
