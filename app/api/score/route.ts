import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function POST(request: Request) {
    try {
        const { name, points } = await request.json();

        if (!name || typeof points !== 'number') {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }

        const users = await kv.get<any[]>('users') || [];
        const userIndex = users.findIndex((u: any) => u.name.toLowerCase() === name.toLowerCase());

        if (userIndex === -1) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        users[userIndex].score += points;

        await kv.set('users', users);

        return NextResponse.json(users[userIndex]);
    } catch (error) {
        console.error('KV Error:', error);
        return NextResponse.json({ error: 'Failed to update score' }, { status: 500 });
    }
}
