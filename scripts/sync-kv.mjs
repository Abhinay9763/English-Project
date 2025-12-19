import { kv } from '@vercel/kv';
import fs from 'fs';
import path from 'path';

async function sync() {
    try {
        console.log('Reading local leaderboard.json...');
        const dataPath = path.join(process.cwd(), 'data', 'leaderboard.json');

        if (!fs.existsSync(dataPath)) {
            console.error('leaderboard.json not found!');
            return;
        }

        const localData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        console.log(`Found ${localData.length} entries. Syncing to Vercel KV...`);

        await kv.set('users', localData);

        const verified = await kv.get('users');
        console.log('✅ Sync successful!');
        console.log('Verified data in KV:', verified);
    } catch (error) {
        console.error('❌ Sync failed:', error);
        console.log('\nTIP: Make sure you have your KV environment variables in .env.local');
    }
}

sync();
