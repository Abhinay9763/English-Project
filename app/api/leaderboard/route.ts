import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET() {
    try {
        // Fetch current users from KV
        const users: any[] = await kv.get('leaderboard') || [];

        // Sort by score descending and take top 10
        const leaderboard = users.sort((a: any, b: any) => b.score - a.score).slice(0, 10);

        return NextResponse.json(leaderboard);
    } catch (error) {
        console.error('KV Error:', error);
        return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
    }
}
