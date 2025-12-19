import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function POST(request: Request) {
    try {
        const { name } = await request.json();

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        // Get users from KV, default to empty array if none exist
        let users: any[] = await kv.get('users') || [];

        const existingUser = users.find((u: any) => u.name.toLowerCase() === name.toLowerCase());

        if (existingUser) {
            return NextResponse.json(existingUser);
        }

        const newUser = { name, score: 0 };
        users.push(newUser);

        // Save back to KV
        await kv.set('users', users);

        return NextResponse.json(newUser);
    } catch (error) {
        console.error('KV Error:', error);
        return NextResponse.json({ error: 'Failed to process user' }, { status: 500 });
    }
}
