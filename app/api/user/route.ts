import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function POST(request: Request) {
    try {
        const { name } = await request.json();

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        // Fetch current users from KV
        let users: any[] = await kv.get('leaderboard') || [];

        const existingUser = users.find((u: any) => u.name.toLowerCase() === name.toLowerCase());

        if (existingUser) {
            return NextResponse.json(existingUser);
        }

        const newUser = { name, score: 0 };
        users.push(newUser);

        // Save updated users back to KV
        await kv.set('leaderboard', users);

        return NextResponse.json(newUser);
    } catch (error) {
        console.error('KV Error:', error);
        return NextResponse.json({ error: 'Failed to process user' }, { status: 500 });
    }
}
