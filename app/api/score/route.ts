import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'leaderboard.json');

export async function POST(request: Request) {
    try {
        const { name, points } = await request.json();

        if (!name || typeof points !== 'number') {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }

        let users = [];
        if (fs.existsSync(dataFilePath)) {
            const fileData = fs.readFileSync(dataFilePath, 'utf8');
            users = JSON.parse(fileData);
        }

        const userIndex = users.findIndex((u: any) => u.name.toLowerCase() === name.toLowerCase());

        if (userIndex === -1) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        users[userIndex].score += points;

        fs.writeFileSync(dataFilePath, JSON.stringify(users, null, 2));

        return NextResponse.json(users[userIndex]);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update score' }, { status: 500 });
    }
}
