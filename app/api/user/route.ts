import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'leaderboard.json');

export async function POST(request: Request) {
    try {
        const { name } = await request.json();

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        let users = [];
        if (fs.existsSync(dataFilePath)) {
            const fileData = fs.readFileSync(dataFilePath, 'utf8');
            users = JSON.parse(fileData);
        }

        const existingUser = users.find((u: any) => u.name.toLowerCase() === name.toLowerCase());

        if (existingUser) {
            return NextResponse.json(existingUser);
        }

        const newUser = { name, score: 0 };
        users.push(newUser);

        fs.writeFileSync(dataFilePath, JSON.stringify(users, null, 2));

        return NextResponse.json(newUser);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to process user' }, { status: 500 });
    }
}
