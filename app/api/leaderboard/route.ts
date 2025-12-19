import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET() {
    try {
        let users: any[] = await kv.get('users') || [];

        // Sort by score descending
        const leaderboard = users.sort((a: any, b: any) => b.score - a.score).slice(0, 10);

        return NextResponse.json(leaderboard);
    } catch (error) {
        console.error('KV Error:', error);
        return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
    }
}
