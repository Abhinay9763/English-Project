import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

// Simple profanity list - you can expand this
const BANNED_WORDS = [
    'fuck', 'shit', 'asshole', 'bitch', 'bastard', 'piss', 'cunt', 'dick',
    'pussy', 'slut', 'whore', 'idiot', 'stupid', 'bastard', 'nigga', 'nigger'
];

export async function POST(request: Request) {
    try {
        const { name } = await request.json();
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        // Profanity Filter
        const lowerName = name.toLowerCase();
        const containsBanned = BANNED_WORDS.some(word => lowerName.includes(word));

        if (containsBanned) {
            return NextResponse.json({
                error: 'Please choose a more appropriate name! 😊'
            }, { status: 400 });
        }

        const users = await kv.get<any[]>('users') || [];
        const existingUser = users.find((u: any) => u.name.toLowerCase() === name.toLowerCase());

        if (existingUser) {
            // Log the login even for existing users
            await kv.lpush('audit_logs', {
                event: 'login',
                name,
                ip,
                timestamp: new Date().toISOString()
            });
            return NextResponse.json(existingUser);
        }

        const newUser = {
            name,
            score: 0,
            registeredIp: ip,
            createdAt: new Date().toISOString()
        };
        users.push(newUser);

        await kv.set('users', users);

        // Log the new registration
        await kv.lpush('audit_logs', {
            event: 'register',
            name,
            ip,
            timestamp: new Date().toISOString()
        });

        return NextResponse.json(newUser);
    } catch (error) {
        console.error('KV Error:', error);
        return NextResponse.json({ error: 'Failed to process user' }, { status: 500 });
    }
}
