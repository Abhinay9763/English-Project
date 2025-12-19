import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'leaderboard.json');

export async function GET() {
    try {
        let users = [];
        if (fs.existsSync(dataFilePath)) {
            const fileData = fs.readFileSync(dataFilePath, 'utf8');
            users = JSON.parse(fileData);
        }

        // Sort by score descending
        const leaderboard = users.sort((a: any, b: any) => b.score - a.score).slice(0, 10);

        return NextResponse.json(leaderboard);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
    }
}
